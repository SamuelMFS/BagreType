import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LightRays from "@/components/LightRays";
import Bubbles from "@/components/Bubbles";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingDown, Brain, Rocket, Zap, Target } from "lucide-react";
import ScrollIndicator from "@/components/ScrollIndicator";

const PostBaseline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [baselineResults, setBaselineResults] = useState<{ wpm: number; accuracy: number } | null>(null);

  useEffect(() => {
    // Get baseline results from location state or localStorage
    const results = location.state?.baselineResults || {
      wpm: parseInt(localStorage.getItem('baseline_wpm') || '0'),
      accuracy: parseInt(localStorage.getItem('baseline_accuracy') || '0')
    };
    
    if (results.wpm > 0 && results.accuracy > 0) {
      setBaselineResults(results);
    }
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [location.state]);

  // 3D Card Component
  const Card3D = ({ children, className = "" }) => {
    const [transform, setTransform] = useState("");
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
    };

    const handleMouseLeave = () => {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    };

    return (
      <div
        ref={cardRef}
        className={`transition-transform duration-300 ease-out ${className}`}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  };

  const expectations = [
    {
      icon: TrendingDown,
      title: "Speed Drop",
      description: "Your typing speed will drop at first - this is completely normal!",
      color: "text-orange-400"
    },
    {
      icon: Brain,
      title: "Neural Rewiring",
      description: "Your brain is rewiring neural pathways - it takes time and patience",
      color: "text-purple-400"
    },
    {
      icon: Rocket,
      title: "Skyrocket Speed",
      description: "After dedicated practice, your speed will skyrocket beyond what you thought possible",
      color: "text-green-400"
    }
  ];

  const handleContinue = () => {
    // Mark that user has seen this page
    localStorage.setItem('bagre-post-baseline-seen', 'true');
    navigate('/lessons');
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 max-w-6xl relative" style={{ zIndex: 10 }}>
        <div className={`animate-fade-in space-y-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-primary animate-float drop-shadow-[0_2px_10px_hsl(var(--primary)/0.5)]">
                Welcome to Your Journey!
              </h1>
              <p className="text-2xl text-aqua-light font-light max-w-4xl mx-auto leading-relaxed">
                Time to break those old habits and build something 
                <span className="text-primary font-semibold"> amazing</span>
              </p>
            </div>
          </div>

          {/* Hand GIF Section */}
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-card/20 backdrop-blur-md rounded-2xl border border-border/30 flex items-center justify-center shadow-2xl">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">👋</div>
                <p className="text-lg text-muted-foreground">Hand GIF Placeholder</p>
                <p className="text-sm text-muted-foreground/70">(You'll add the gif here)</p>
              </div>
            </div>
          </div>

          {/* Baseline Results Section */}
          {baselineResults && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-accent mb-4">Your Baseline Results</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  This is your starting point - we'll track your improvement from here!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card3D>
                  <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Typing Speed</h3>
                        <p className="text-3xl font-bold text-primary">{baselineResults.wpm}</p>
                        <p className="text-muted-foreground">Words per minute</p>
                      </div>
                    </div>
                  </Card>
                </Card3D>

                <Card3D>
                  <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Accuracy</h3>
                        <p className="text-3xl font-bold text-primary">{baselineResults.accuracy}%</p>
                        <p className="text-muted-foreground">Character accuracy</p>
                      </div>
                    </div>
                  </Card>
                </Card3D>
              </div>
            </div>
          )}

          {/* Touch Typing Introduction */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">What is Touch Typing?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The art of typing without looking at your keyboard, using muscle memory.
              </p>
            </div>

            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6 text-xl leading-relaxed">
                <p className="text-foreground">
                  Have you ever noticed that F and J keys have a little bump? Those are the touchtyping landmarks to show you where your index fingers should be so you dont have to look down at the keyboard.
                </p>
                <p className="text-foreground">
                  I see you there with that hand on WASD, you little gamer! 😏
                </p>
                <p className="text-foreground/90">
                  Don't worry, we've all been there. Your fingers have been doing the same dance for years, 
                  and now we're about to teach them a whole new choreography.
                </p>
              </div>
            </div>
          </div>

          {/* Expectations Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">Here's What to Expect</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your typing journey will have ups and downs, but the destination is worth it
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {expectations.map((expectation, index) => {
                const Icon = expectation.icon;
                return (
                  <Card3D key={index}>
                    <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${expectation.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">{expectation.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{expectation.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Card3D>
                );
              })}
            </div>
          </div>

          {/* Final Encouragement */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <p className="text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Think of it like learning to play piano with your feet - awkward at first, 
                but once you get it, you'll wonder how you ever lived without it!
              </p>
              <p className="text-lg text-muted-foreground">
                Remember: Every expert was once a beginner
              </p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '0ms' }}>
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-accent/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '150ms' }}>
                <div className="w-4 h-4 bg-accent rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '300ms' }}>
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="pt-8">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="group text-xl px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                Let's Dive In! 🌊
              </Button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default PostBaseline;
