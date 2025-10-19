import { useEffect, useState } from "react";

const OceanFloor = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rocks = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${30 + Math.random() * 80}px`,
    height: `${20 + Math.random() * 50}px`,
    delay: `${Math.random() * 2}s`,
  }));

  // Only show when scrolled past 60%
  const opacity = scrollProgress > 0.6 ? (scrollProgress - 0.6) / 0.4 : 0;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none transition-opacity duration-500" 
      style={{ zIndex: 2, opacity }}
    >
      {/* Sandy bottom */}
      <div 
        className="absolute bottom-0 w-full h-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(var(--muted) / 0.3) 30%, hsl(var(--muted) / 0.5) 100%)',
        }}
      />
      
      {/* Rocks and debris */}
      {rocks.map((rock) => (
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
  );
};

export default OceanFloor;
