import { useMemo } from 'react';

const LightRays = () => {
  const rays = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${15 + i * 20}%`,
      delay: `${i * 2}s`,
      opacity: 0.05 + Math.random() * 0.08,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {rays.map((ray) => (
        <div
          key={ray.id}
          className="absolute top-0 h-full"
          style={{
            left: ray.left,
            width: '100px',
            background: `linear-gradient(180deg, hsl(var(--primary) / ${ray.opacity}) 0%, transparent 60%)`,
            transform: 'skewX(-10deg)',
            animation: `light-shimmer 8s ease-in-out ${ray.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default LightRays;
