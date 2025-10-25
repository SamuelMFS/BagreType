import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TypingTest from "@/components/TypingTest";
import ScrollIndicator from "@/components/ScrollIndicator";
import { Zap, Clock, Target, TrendingUp, Play, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLocalization } from "@/hooks/useLocalization";

const Learn = () => {
  const [showTest, setShowTest] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [hasCompletedBaseline, setHasCompletedBaseline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocalization();
  const { language } = useParams();

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
  const saveBaselineCompletion = async (results: { wpm: number; accuracy: number }) => {
    try {
      console.log('Saving baseline completion for user:', user?.id, 'results:', results);
      if (user) {
        // For logged-in users, save to Supabase
        const baselineData = {
          user_id: user.id,
          baseline_completed: true,
          baseline_wpm: results.wpm,
          baseline_accuracy: results.accuracy,
          updated_at: new Date().toISOString()
        };
        console.log('Saving baseline data to Supabase:', baselineData);
        
        const { data, error } = await supabase
          .from('user_progress')
          .upsert(baselineData)
          .select();

        if (error) {
          console.error('Supabase error saving baseline:', error);
          throw error;
        }
        console.log('Baseline saved successfully:', data);
      } else {
        // For anonymous users, save to localStorage
        console.log('Saving baseline to localStorage for anonymous user');
        localStorage.setItem('baseline_completed', 'true');
        localStorage.setItem('baseline_wpm', results.wpm.toString());
        localStorage.setItem('baseline_accuracy', results.accuracy.toString());
        console.log('Baseline saved to localStorage:', { wpm: results.wpm, accuracy: results.accuracy });
      }
      
      setHasCompletedBaseline(true);
    } catch (error) {
      console.error('Error saving baseline completion:', error);
    }
  };

  // Handle test completion
  const handleTestComplete = async (wpm: number, accuracy: number) => {
    const results = { wpm, accuracy };
    setTestResults(results);
    setShowTest(false);
    await saveBaselineCompletion(results);
    
    // Check if user has seen the post-baseline page before
    const hasSeenPostBaseline = localStorage.getItem('bagre-post-baseline-seen') === 'true';
    
    if (!hasSeenPostBaseline) {
      // Navigate directly to post-baseline page
      navigate(`/${language}/post-baseline`, { 
        state: { 
          baselineResults: results 
        } 
      });
    }
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
                {t('learn.title')}
              </h1>
              <p className="text-2xl text-aqua-light max-w-3xl mx-auto">
                {t('learn.loading')}
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
                {t('learn.testResults.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('learn.testResults.description')}
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
                    <p className="text-lg text-muted-foreground">{t('learn.testResults.wpm')}</p>
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
                    <p className="text-lg text-muted-foreground">{t('learn.testResults.accuracy')}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 text-center shadow-lg">
              <div className="space-y-6">
                <p className="text-lg text-foreground/90">
                  {t('learn.testResults.greatJob')}
                </p>
                <Button 
                  size="lg"
                  variant="ocean"
                  className="text-lg px-8 py-6 group"
                  onClick={() => navigate(`/${language}/lessons`)}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('learn.testResults.continueToLessons')}
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
                      {t('learn.testScreen.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {t('learn.testScreen.description')}
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
              {t('learn.title')}
            </h1>
            <p className="text-2xl text-aqua-light max-w-3xl mx-auto">
              {t('learn.description')}
            </p>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold text-accent">{t('learn.whyLearn')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('learn.whyLearnDescription')}
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
                      <p className="text-lg text-muted-foreground">{t('learn.benefits.speedIncrease')}</p>
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
                      <p className="text-lg text-muted-foreground">{t('learn.benefits.dailyPractice')}</p>
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
                      <p className="text-4xl font-bold text-primary">{t('learn.benefits.timeToProficientValue')}</p>
                      <p className="text-lg text-muted-foreground">{t('learn.benefits.timeToProficient')}</p>
                    </div>
                  </div>
                </Card>
              </Card3D>
            </div>

            <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 text-center">
              <p className="text-lg text-muted-foreground italic">
                {t('learn.gamifiedNote')}
              </p>
            </Card>
          </div>

          {/* Get Started Section - Only show if baseline not completed */}
          {!hasCompletedBaseline && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-semibold text-accent">{t('learn.getStarted')}</h2>
                <p className="text-lg text-muted-foreground">
                  {t('learn.getStartedDescription')}
                </p>
              </div>

              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <BarChart3 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-accent">{t('learn.baselineTest')}</h3>
                      <p className="text-lg text-muted-foreground">
                        {t('learn.baselineTestDescription')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-base text-foreground/90">
                      {t('learn.baselineTestExplanation')}
                    </p>
                    
                    <Button 
                      size="lg"
                      variant="ocean"
                      className="text-lg px-8 py-6 group"
                      onClick={() => setShowTest(true)}
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('learn.startBaselineTest')}
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <p className="text-base text-muted-foreground">
                  {t('learn.afterTestNote')}
                </p>
              </div>
            </div>
          )}

          {/* Continue to Lessons - Show if baseline completed */}
          {hasCompletedBaseline && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-semibold text-accent">{t('learn.readyToLearn')}</h2>
                <p className="text-lg text-muted-foreground">
                  {t('learn.readyToLearnDescription')}
                </p>
              </div>

              <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-accent">{t('learn.startLearning')}</h3>
                      <p className="text-lg text-muted-foreground">
                        {t('learn.startLearningDescription')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-base text-foreground/90">
                      {t('learn.startLearningExplanation')}
                    </p>
                    
                    <Button 
                      size="lg"
                      variant="ocean"
                      className="text-lg px-8 py-6 group"
                      onClick={() => navigate(`/${language}/lessons`)}
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('learn.startLessons')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <ScrollIndicator />
    </div>
  );
};

export default Learn;
