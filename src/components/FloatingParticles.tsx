const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${15 + Math.random() * 15}s`,
    size: `${1 + Math.random() * 2}px`,
  }));

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
            background: 'hsl(180, 85%, 55%, 0.4)',
            boxShadow: '0 0 4px hsl(180, 85%, 55%, 0.6)',
            animation: `particle-drift ${particle.duration} linear ${particle.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
