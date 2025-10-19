const Bubbles = () => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: `${5 + Math.random() * 40}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-0 rounded-full opacity-30"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            background: "radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, hsl(var(--accent) / 0.1) 50%, transparent 70%)",
            boxShadow: "0 0 15px hsl(var(--primary) / 0.3)",
            animation: `bubble-rise ${bubble.duration} ease-in-out ${bubble.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Bubbles;
