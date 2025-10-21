import { useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import LessonRoadmap from "@/components/LessonRoadmap";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import DeepFish from "@/components/DeepFish";
import OceanFloor from "@/components/OceanFloor";
import ScrollDepthGradient from "@/components/ScrollDepthGradient";
import { useScrollProgress } from "@/contexts/ScrollContext";

const LessonsJourney = () => {
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    // Ensure we start at the top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const backgroundStyle = useMemo(() => ({
    background: `linear-gradient(180deg, 
      hsl(var(--background)) 0%, 
      hsl(var(--card)) 40%, 
      hsl(var(--muted)) ${60 + scrollProgress * 20}%, 
      hsl(220 40% ${Math.max(5, 8 - scrollProgress * 3)}%) 100%)`,
  }), [scrollProgress]);

  return (
    <div 
      className="min-h-[300vh] relative overflow-hidden transition-colors duration-700"
      style={backgroundStyle}
    >
      <Navigation />
      
      {/* Animated ocean elements */}
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      
      {/* Fish that appear at different depths */}
      <div style={{ opacity: scrollProgress < 0.3 ? 1 : 0.3 }}>
        <SwimmingFish />
      </div>
      <DeepFish />
      
      {/* Ocean floor appears at the bottom */}
      <OceanFloor />
      
      {/* Depth gradient overlay */}
      <ScrollDepthGradient />
      
      {/* Bioluminescent particles for deep ocean */}
      {scrollProgress > 0.5 && (
        <div className="fixed inset-0 pointer-events-none" style={{ opacity: (scrollProgress - 0.5) * 2 }}>
          {useMemo(() => 
            Array.from({ length: 15 }, (_, i) => ({
              id: i,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            })), []
          ).map((particle) => (
            <div
              key={`glow-${particle.id}`}
              className="absolute rounded-full animate-glow-pulse"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.width,
                height: particle.height,
                background: 'hsl(var(--accent))',
                boxShadow: '0 0 10px hsl(var(--accent))',
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="animate-fade-in space-y-12">
          {/* Title */}
          <div className="text-center space-y-4 sticky top-24 z-20 py-4">
            <h1 
              className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-[0_2px_10px_hsl(var(--primary)/0.5)]"
              style={{
                textShadow: '0 0 20px hsl(var(--primary) / 0.5)',
              }}
            >
              Your Typing Journey
            </h1>
            <p className="text-lg text-foreground/80 drop-shadow-lg">
              Descend into the depths and master each key
            </p>
          </div>

          {/* Roadmap */}
          <LessonRoadmap />
        </div>
      </div>
    </div>
  );
};

export default LessonsJourney;
