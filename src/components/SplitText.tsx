import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  animation?: "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "rotateIn";
}

const SplitText = ({ 
  children, 
  className = "", 
  delay = 0,
  duration = 0.6,
  stagger = 0.05,
  animation = "fadeInUp"
}: SplitTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = (index: number) => {
    if (!isVisible) return "opacity-0";
    
    const animationClasses = {
      fadeInUp: "animate-fade-in-up",
      fadeInDown: "animate-fade-in-down", 
      fadeInLeft: "animate-fade-in-left",
      fadeInRight: "animate-fade-in-right",
      scaleIn: "animate-scale-in",
      rotateIn: "animate-rotate-in"
    };

    return animationClasses[animation] || "animate-fade-in-up";
  };

  const getAnimationStyle = (index: number) => {
    if (!isVisible) return {};
    
    return {
      animationDelay: `${index * stagger}s`,
      animationDuration: `${duration}s`,
      animationFillMode: "both" as const
    };
  };

  return (
    <div ref={containerRef} className={`split-text-container ${className}`}>
      {children.split("").map((char, index) => (
        <span
          key={index}
          className={`split-text-char inline-block ${getAnimationClass(index)}`}
          style={getAnimationStyle(index)}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default SplitText;

