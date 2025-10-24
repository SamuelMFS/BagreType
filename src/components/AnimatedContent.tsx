import { useEffect, useState } from "react";

interface AnimatedContentProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
  isExiting?: boolean;
}

const AnimatedContent = ({ 
  children, 
  direction = "right", 
  duration = 500,
  className = "",
  isExiting = false
}: AnimatedContentProps) => {
  const [animationClass, setAnimationClass] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isExiting) {
      // Start exit animation
      setAnimationClass(direction === "right" ? "animate-slide-out-left" : "animate-slide-out-right");
      // Hide content after animation completes
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Exit animation duration
    } else {
      // Start enter animation
      setIsVisible(true);
      setAnimationClass(direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left");
    }
  }, [direction, isExiting]);

  if (!isVisible && isExiting) {
    return null;
  }

  return (
    <div 
      className={`transition-all duration-300 ${animationClass} ${className}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
