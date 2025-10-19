import { useScrollProgress } from "@/contexts/ScrollContext";

const ScrollDepthGradient = () => {
  const scrollProgress = useScrollProgress();
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
