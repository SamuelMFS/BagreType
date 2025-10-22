import { useMemo } from 'react';

interface SwimmingFishProps {
  topOffset?: number;
}

const SwimmingFish = ({ topOffset = 0 }: SwimmingFishProps) => {
  const fish = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: `${20 + i * 25}%`,
      delay: `${i * 8}s`,
      duration: `${20 + Math.random() * 10}s`,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ transform: `translateY(${topOffset}px)` }}>
      {fish.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            top: f.top,
            left: '-100px',
            animation: `fish-swim ${f.duration} linear ${f.delay} infinite`,
          }}
        >
          <svg
            width="60"
            height="30"
            viewBox="0 0 60 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.7 }}
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

export default SwimmingFish;
