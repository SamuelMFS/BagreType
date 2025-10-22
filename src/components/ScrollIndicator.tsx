import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  className?: string;
  threshold?: number; // How far down to scroll before hiding (0-1)
}

const ScrollIndicator = ({ className = "", threshold = 0.95 }: ScrollIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress (0 to 1)
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(progress);
      
      // Hide indicator when user has scrolled past threshold
      setIsVisible(progress < threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToNext = () => {
    const windowHeight = window.innerHeight;
    const currentScroll = window.scrollY;
    const nextSection = currentScroll + windowHeight * 0.8; // Scroll 80% of viewport height
    
    window.scrollTo({
      top: nextSection,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <button
        onClick={scrollToNext}
        className="group flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300"
        aria-label="Scroll down to see more content"
      >
        {/* Simple arrow with circle background */}
        <div className="relative">
          <div className="h-16 w-12 bg-primary/15 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
            <ChevronDown 
              className="w-6 h-6 text-muted-foreground/90 group-hover:text-primary transition-colors duration-300" 
              style={{
                animation: 'bounce 1.5s infinite'
              }}
            />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ScrollIndicator;
