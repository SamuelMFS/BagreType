const ScrollDepthGradient = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, transparent 40%, hsl(var(--background) / 0.3) 70%, hsl(var(--background) / 0.5) 100%)',
        zIndex: 1
      }}
    />
  );
};

export default ScrollDepthGradient;
