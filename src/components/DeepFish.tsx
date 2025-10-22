import { useScrollProgress } from "@/contexts/ScrollContext";
import { useMemo } from 'react';

interface DeepFishProps {
  topOffset?: number;
}

const DeepFish = ({ topOffset = 0 }: DeepFishProps) => {
  const scrollProgress = useScrollProgress();

  const fish = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      bottom: `${10 + i * 15}%`,
      delay: `${i * 10}s`,
      duration: `${25 + Math.random() * 10}s`,
      scale: 1.8 + Math.random() * 0.8,
    })), []
  );

  // Only show when scrolled past 40%
  const opacity = scrollProgress > 0.4 ? Math.min((scrollProgress - 0.4) / 0.3, 1) * 0.8 : 0;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-500" 
      style={{ zIndex: 3, transform: `translateY(${topOffset}px)` }}
    >
      {fish.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            bottom: f.bottom,
            left: '-150px',
            animation: `fish-swim ${f.duration} linear ${f.delay} infinite`,
            transform: `scale(${f.scale})`,
            opacity,
          }}
        >
          <svg
            width="90"
            height="45"
            viewBox="0 0 60 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 15C50 15 45 10 35 10C25 10 15 12 10 15C15 18 25 20 35 20C45 20 50 15 50 15Z"
              fill="hsl(var(--primary))"
            />
            <path
              d="M10 15L0 10L5 15L0 20L10 15Z"
              fill="hsl(var(--primary))"
            />
            <circle cx="38" cy="13" r="2" fill="hsl(var(--background))" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default DeepFish;
