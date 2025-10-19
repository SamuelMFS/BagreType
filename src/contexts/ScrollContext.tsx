import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ScrollContextType {
  scrollProgress: number;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
