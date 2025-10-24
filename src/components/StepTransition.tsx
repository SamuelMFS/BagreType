import { useEffect, useState } from "react";

interface StepTransitionProps {
  currentStep: string;
  children: React.ReactNode;
  direction?: "left" | "right";
  duration?: number;
}

const StepTransition = ({ 
  currentStep, 
  children, 
  direction = "right", 
  duration = 500 
}: StepTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    // Start transition when step changes
    setIsTransitioning(true);
    
    // Set enter animation - new content slides in from the specified direction
    setAnimationClass(direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left");
    
    // End transition after enter animation
    setTimeout(() => {
      setIsTransitioning(false);
      setAnimationClass("");
    }, duration);
  }, [currentStep, direction, duration]);

  return (
    <div 
      className={`transition-all duration-300 ${animationClass}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default StepTransition;
