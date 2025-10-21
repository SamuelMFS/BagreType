import { createContext, useContext, useEffect, useState, useRef } from "react";

interface ScrollContextType {
  scrollProgress: number;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let lastScrollHeight = document.documentElement.scrollHeight;

    const handleScroll = () => {
      if (!ticking) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        
        rafRef.current = requestAnimationFrame(() => {
          const now = Date.now();
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = window.scrollY;
          
          // Only update if scroll position actually changed significantly
          // or if scroll height changed (page content changed)
          const scrollChanged = Math.abs(scrolled - lastScrollY) > 1;
          const heightChanged = Math.abs(scrollHeight - lastScrollHeight) > 10;
          
          if (scrollChanged || heightChanged) {
            const progress = scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0;
            
            setScrollProgress(prev => {
              // Only update if the change is significant and enough time has passed
              const shouldUpdate = Math.abs(prev - progress) > 0.001 && 
                                 (now - lastUpdateTime.current) > 16; // ~60fps max
              
              if (shouldUpdate) {
                lastUpdateTime.current = now;
                lastScrollY = scrolled;
                lastScrollHeight = scrollHeight;
              }
              
              return shouldUpdate ? progress : prev;
            });
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for resize events that might change scroll height
    window.addEventListener('resize', handleScroll, { passive: true });
    
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []); // Empty dependency array - no dependencies needed

  return (
    <ScrollContext.Provider value={{ scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScrollProgress must be used within a ScrollProvider");
  }
  return context.scrollProgress;
}
