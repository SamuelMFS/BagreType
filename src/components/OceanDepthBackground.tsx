const OceanDepthBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ height: '300vh' }}>
      {/* Darkening gradient from top to bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, transparent 30%, hsl(var(--background) / 0.3) 60%, hsl(var(--background) / 0.6) 100%)',
        }}
      />
      
      {/* Light rays at the top */}
      {Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: `${15 + i * 20}%`,
        delay: `${i * 2}s`,
        opacity: 0.05 + Math.random() * 0.08,
      })).map((ray) => (
        <div
          key={ray.id}
          className="absolute top-0"
          style={{
            left: ray.left,
            width: '100px',
            height: '40vh',
            background: `linear-gradient(180deg, hsl(var(--primary) / ${ray.opacity}) 0%, transparent 100%)`,
            transform: 'skewX(-10deg)',
            animation: `light-shimmer 8s ease-in-out ${ray.delay} infinite`,
          }}
        />
      ))}
      
      {/* Small fish at top/mid */}
      {Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: `${20 + i * 15}vh`,
        delay: `${i * 8}s`,
        duration: `${20 + Math.random() * 10}s`,
      })).map((f) => (
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
            style={{ opacity: 0.3 }}
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
      
      {/* Large fish at bottom */}
      {Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: `${150 + i * 20}vh`,
        delay: `${i * 10}s`,
        duration: `${25 + Math.random() * 10}s`,
        scale: 1.8 + Math.random() * 0.8,
      })).map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            top: f.top,
            left: '-150px',
            animation: `fish-swim ${f.duration} linear ${f.delay} infinite`,
            transform: `scale(${f.scale})`,
          }}
        >
          <svg
            width="90"
            height="45"
            viewBox="0 0 60 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.35 }}
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
      
      {/* Ocean floor at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div 
          className="absolute bottom-0 w-full h-20"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, hsl(var(--muted) / 0.3) 30%, hsl(var(--muted) / 0.5) 100%)',
          }}
        />
        
        {/* Rocks */}
        {Array.from({ length: 15 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          width: `${30 + Math.random() * 80}px`,
          height: `${20 + Math.random() * 50}px`,
          delay: `${Math.random() * 2}s`,
        })).map((rock) => (
          <div
            key={rock.id}
            className="absolute bottom-0 rounded-t-full opacity-40"
            style={{
              left: rock.left,
              width: rock.width,
              height: rock.height,
              background: `hsl(var(--muted-foreground) / 0.6)`,
              animation: `float 3s ease-in-out ${rock.delay} infinite`,
            }}
          />
        ))}
        
        {/* Seaweed */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`weed-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${10 + i * 12}%`,
              width: '3px',
              height: `${40 + Math.random() * 40}px`,
              background: `linear-gradient(180deg, transparent 0%, hsl(var(--accent) / 0.3) 50%, hsl(var(--accent) / 0.5) 100%)`,
              transformOrigin: 'bottom',
              animation: `wave ${2 + Math.random()}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OceanDepthBackground;
