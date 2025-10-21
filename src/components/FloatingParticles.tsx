import { useMemo } from 'react';

const FloatingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 2}px`,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            background: 'hsl(var(--primary) / 0.5)',
            boxShadow: '0 0 6px hsl(var(--primary) / 0.7)',
            animation: `particle-drift ${particle.duration} linear ${particle.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
