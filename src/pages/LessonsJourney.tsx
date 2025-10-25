import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LessonRoadmap from "@/components/LessonRoadmap";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import DeepFish from "@/components/DeepFish";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useScrollProgress } from "@/contexts/ScrollContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useLocalization } from "@/hooks/useLocalization";

const LessonsJourney = () => {
  const scrollProgress = useScrollProgress();
  const { currentLayout, layoutName } = useLayout();
  const { lang } = useParams();
  const { t } = useLocalization();

  useEffect(() => {
    // Ensure we start at the top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Dynamic background based on scroll depth
  const backgroundStyle = useMemo(() => {
    const isDark = document.documentElement.classList.contains('deep');
    
    if (isDark) {
      // Dark theme: gets slightly lighter with depth, more bioluminescence
      return {
        background: `linear-gradient(180deg, 
          hsl(var(--background)) 0%, 
          hsl(var(--card)) 20%, 
          hsl(var(--muted)) 40%, 
          hsl(220 40% ${Math.max(12, 15 - scrollProgress * 3)}%) 60%,
          hsl(220 35% ${Math.max(8, 12 - scrollProgress * 2)}%) 80%,
          hsl(220 30% ${Math.max(5, 8 - scrollProgress * 1)}%) 100%)`,
      };
    } else {
      // Light theme: gets slightly darker with depth but stays light
      return {
        background: `linear-gradient(180deg, 
          hsl(var(--background)) 0%, 
          hsl(var(--card)) 20%, 
          hsl(var(--muted)) 40%, 
          hsl(var(--muted) / 0.7) 60%,
          hsl(var(--muted) / 0.8) 80%,
          hsl(var(--muted) / 0.9) 100%)`,
      };
    }
  }, [scrollProgress]);

  // Bioluminescent particles for deep ocean (dark theme only)
  const bioluminescentParticles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${2 + Math.random() * 6}px`,
      height: `${1 + Math.random() * 6}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 3}s`,
    })), []
  );

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-700"
      style={backgroundStyle}
    >
      <Navigation />
      
      {/* Animated ocean elements */}
      <LightRays />
      <div 
        className="transition-all duration-1000"
        style={{ 
          transform: `translateY(${scrollProgress * 100}px)` // Bubbles rise as you dive
        }}
      >
        <Bubbles />
      </div>
      <div 
        className="transition-all duration-1000"
        style={{ 
          transform: `translateY(${scrollProgress * 50}px)` // Particles drift upward
        }}
      >
        <FloatingParticles />
      </div>
      
      {/* Fish that appear at different depths */}
      <SwimmingFish topOffset={scrollProgress * -200} />
      <DeepFish topOffset={scrollProgress * -200} />
      
      {/* Bioluminescent particles for deep ocean (dark theme only) */}
      {scrollProgress > 0.4 && (
        <div className="fixed inset-0 pointer-events-none" style={{ opacity: (scrollProgress - 0.4) * 1.5 }}>
          {/* Ambient glow background */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.3) 0%, transparent 70%),
                radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.25) 0%, transparent 70%),
                radial-gradient(circle at 40% 80%, hsl(var(--accent) / 0.2) 0%, transparent 70%),
                radial-gradient(circle at 60% 20%, hsl(var(--accent) / 0.15) 0%, transparent 70%)
              `
            }}
          />
          
          {/* Individual glowing particles */}
          {bioluminescentParticles.map((particle) => (
            <div
              key={`glow-${particle.id}`}
              className="absolute rounded-full animate-glow-pulse"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.width,
                height: particle.height,
                background: 'hsl(var(--accent))',
                boxShadow: `
                  0 0 15px hsl(var(--accent) / 1),
                  0 0 30px hsl(var(--accent) / 0.8),
                  0 0 45px hsl(var(--accent) / 0.6),
                  0 0 60px hsl(var(--accent) / 0.4),
                  0 0 75px hsl(var(--accent) / 0.2)
                `,
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
              {t('lessons.title')}
            </h1>
            <p className="text-lg text-foreground/80 drop-shadow-lg">
              {currentLayout ? t('lessons.learningLayout', { layout: layoutName.toUpperCase() }) : t('lessons.subtitle')}
            </p>
          </div>

          {/* Roadmap */}
          <LessonRoadmap layoutString={currentLayout || undefined} language={lang} />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default LessonsJourney;
