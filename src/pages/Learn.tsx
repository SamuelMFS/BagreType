import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TypingTest from "@/components/TypingTest";
import { Zap, Clock, Target, TrendingUp, Play, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Learn = () => {
  const [showTest, setShowTest] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [hasCompletedBaseline, setHasCompletedBaseline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 3D Card Component
  const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const [transform, setTransform] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Load baseline test completion status
  useEffect(() => {
    const loadBaselineStatus = async () => {
      try {
        if (user) {
          // For logged-in users, check Supabase
          const { data, error } = await supabase
            .from('user_progress')
            .select('baseline_completed')
            .eq('user_id', user.id)
            .single();

          if (data && !error) {
            setHasCompletedBaseline(data.baseline_completed || false);
          }
        } else {
          // For anonymous users, check localStorage
          const stored = localStorage.getItem('baseline_completed');
          setHasCompletedBaseline(stored === 'true');
        }
      } catch (error) {
        console.error('Error loading baseline status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBaselineStatus();
  }, [user]);

  // Save baseline test completion
  const saveBaselineCompletion = async () => {
    try {
      if (user) {
        // For logged-in users, save to Supabase
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            baseline_completed: true,
            baseline_wpm: testResults?.wpm,
            baseline_accuracy: testResults?.accuracy,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } else {
        // For anonymous users, save to localStorage
        localStorage.setItem('baseline_completed', 'true');
        if (testResults) {
          localStorage.setItem('baseline_wpm', testResults.wpm.toString());
          localStorage.setItem('baseline_accuracy', testResults.accuracy.toString());
        }
      }
      
      setHasCompletedBaseline(true);
    } catch (error) {
      console.error('Error saving baseline completion:', error);
    }
  };

  // Handle test completion
  const handleTestComplete = (wpm: number, accuracy: number) => {
    setTestResults({ wpm, accuracy });
    setShowTest(false);
    setShowResults(true);
    saveBaselineCompletion();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
          <div className="animate-fade-in space-y-16">
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
                Learn Touch Typing
              </h1>
              <p className="text-2xl text-aqua-light max-w-3xl mx-auto">
                Loading your progress...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && testResults) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
                Baseline Test Results
              </h1>
              <p className="text-xl text-muted-foreground">
                Here's how you did!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-6xl font-bold text-primary">{testResults.wpm}</p>
                    <p className="text-lg text-muted-foreground">Words Per Minute</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-6xl font-bold text-accent">{testResults.accuracy}%</p>
                    <p className="text-lg text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 text-center shadow-lg">
              <div className="space-y-6">
                <p className="text-lg text-foreground/90">
                  Great job! Now let's begin your personalized learning journey.
                </p>
                <Button 
                  size="lg"
                  variant="ocean"
                  className="text-lg px-8 py-6 group"
                  onClick={() => navigate("/lessons")}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Continue to Lessons
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showTest) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-8">
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <BarChart3 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary">
                      Baseline Test
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Type the words as quickly and accurately as you can
                    </p>
                  </div>
                </div>
                
                <TypingTest 
                  wordCount={30}
                  onComplete={handleTestComplete}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="animate-fade-in space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Learn Touch Typing
            </h1>
            <p className="text-2xl text-aqua-light max-w-3xl mx-auto">
              Master the art of typing without looking at the keyboard
            </p>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold text-accent">Why Learn Touch Typing?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Touch typing is a skill that dramatically improves your typing speed and accuracy. 
                With just <span className="text-primary font-semibold">30 minutes of practice per day</span>, 
                you can increase your WPM from 30-40 to 60-100+.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card3D>
                <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 text-center shadow-lg hover:shadow-2xl">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">2-3x</p>
                      <p className="text-lg text-muted-foreground">Typing speed increase</p>
                    </div>
                  </div>
                </Card>
              </Card3D>
              
              <Card3D>
                <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 text-center shadow-lg hover:shadow-2xl">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">30min</p>
                      <p className="text-lg text-muted-foreground">Daily practice needed</p>
                    </div>
                  </div>
                </Card>
              </Card3D>
              
              <Card3D>
                <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 text-center shadow-lg hover:shadow-2xl">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">2-4wk</p>
                      <p className="text-lg text-muted-foreground">To become proficient</p>
                    </div>
                  </div>
                </Card>
              </Card3D>
            </div>

            <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 text-center">
              <p className="text-lg text-muted-foreground italic">
                Many people find the learning process enjoyable through gamified typing practice, 
                similar to Monkeytype or TypeRacer.
              </p>
            </Card>
          </div>

          {/* Get Started Section - Only show if baseline not completed */}
          {!hasCompletedBaseline && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-semibold text-accent">Get Started</h2>
                <p className="text-lg text-muted-foreground">
                  First, let's see your current typing speed
                </p>
              </div>

              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <BarChart3 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-accent">Baseline Test</h3>
                      <p className="text-lg text-muted-foreground">
                        Type a 30-word passage as quickly and accurately as you can
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-base text-foreground/90">
                      Before we begin our learning journey, we'll test your current typing speed. 
                      This baseline will help track your progress as you learn.
                    </p>
                    
                    <Button 
                      size="lg"
                      variant="ocean"
                      className="text-lg px-8 py-6 group"
                      onClick={() => setShowTest(true)}
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Start Baseline Test
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <p className="text-base text-muted-foreground">
                  After the test, you'll begin your personalized learning journey
                </p>
              </div>
            </div>
          )}

          {/* Continue to Lessons - Show if baseline completed */}
          {hasCompletedBaseline && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-semibold text-accent">Ready to Learn!</h2>
                <p className="text-lg text-muted-foreground">
                  You've completed your baseline test. Let's start your learning journey!
                </p>
              </div>

              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-accent">Start Learning</h3>
                      <p className="text-lg text-muted-foreground">
                        Begin your personalized touch typing lessons
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-base text-foreground/90">
                      Your baseline test results have been saved. Now you can start learning 
                      touch typing with personalized lessons designed for your skill level.
                    </p>
                    
                    <Button 
                      size="lg"
                      variant="ocean"
                      className="text-lg px-8 py-6 group"
                      onClick={() => navigate("/lessons")}
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Start Lessons
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;
