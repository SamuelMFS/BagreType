import { useEffect, useState } from "react";

const ScrollDepthGradient = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = scrollProgress * 0.6;

  return (
    <div 
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        background: `linear-gradient(180deg, transparent 0%, transparent 40%, hsl(var(--background) / ${opacity * 0.5}) 70%, hsl(var(--background) / ${opacity}) 100%)`,
        zIndex: 1,
        opacity: scrollProgress > 0.1 ? 1 : 0,
      }}
    />
  );
};

export default ScrollDepthGradient;
