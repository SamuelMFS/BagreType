import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import ScrollIndicator from "@/components/ScrollIndicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TypingTest from "@/components/TypingTest";

const CompareProgress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [baselineResults, setBaselineResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [finalTestResults, setFinalTestResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [showComparisonTest, setShowComparisonTest] = useState(false);
  const [comparisonTestResults, setComparisonTestResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load baseline results
  useEffect(() => {
    const loadBaselineResults = async () => {
      try {
        if (user) {
          // Load from Supabase for logged-in users
          const { data, error } = await supabase
            .from('user_progress')
            .select('baseline_wpm, baseline_accuracy')
            .eq('user_id', user.id)
            .single();

          if (data && !error && data.baseline_wpm && data.baseline_accuracy) {
            setBaselineResults({
              wpm: data.baseline_wpm,
              accuracy: data.baseline_accuracy
            });
          }
        } else {
          // Load from localStorage for anonymous users
          const baselineWpm = localStorage.getItem('baseline_wpm');
          const baselineAccuracy = localStorage.getItem('baseline_accuracy');
          
          if (baselineWpm && baselineAccuracy) {
            setBaselineResults({
              wpm: parseInt(baselineWpm),
              accuracy: parseInt(baselineAccuracy)
            });
          }
        }
      } catch (error) {
        console.error('Error loading baseline results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBaselineResults();
  }, [user]);

  // Load final test results (from the most recent lesson completion)
  useEffect(() => {
    const loadFinalTestResults = async () => {
      try {
        if (user) {
          // Get the most recent typing session (should be the final test)
          const { data, error } = await supabase
            .from('typing_sessions')
            .select('wpm, accuracy')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (data && !error) {
            setFinalTestResults({
              wpm: data.wpm,
              accuracy: data.accuracy
            });
          }
        } else {
          // For anonymous users, we'll need to get this from the lesson completion
          // This is a bit tricky since we don't store lesson results in localStorage
          // For now, we'll show a message to take the comparison test
        }
      } catch (error) {
        console.error('Error loading final test results:', error);
      }
    };

    loadFinalTestResults();
  }, [user]);

  const handleComparisonTestComplete = (wpm: number, accuracy: number) => {
    setComparisonTestResults({ wpm, accuracy });
    setShowComparisonTest(false);
    
    // Navigate to the comparison results page with the test results
    navigate("/comparison-results", {
      state: {
        comparisonResults: { wpm, accuracy }
      }
    });
  };

  const getImprovementMessage = () => {
    if (!baselineResults || !finalTestResults) return null;
    
    const wpmImprovement = finalTestResults.wpm - baselineResults.wpm;
    const accuracyImprovement = finalTestResults.accuracy - baselineResults.accuracy;
    
    if (wpmImprovement > 0 && accuracyImprovement > 0) {
      return `🚀 Amazing! You've improved by ${wpmImprovement} WPM and ${accuracyImprovement}% accuracy!`;
    } else if (wpmImprovement > 0) {
      return `⚡ Great! You've improved by ${wpmImprovement} WPM!`;
    } else if (accuracyImprovement > 0) {
      return `🎯 Excellent! You've improved by ${accuracyImprovement}% accuracy!`;
    } else {
      return `💪 Keep practicing! Every keystroke makes you better!`;
    }
  };

  const getComparisonResults = () => {
    if (!baselineResults) return null;
    
    const currentResults = comparisonTestResults || finalTestResults;
    if (!currentResults) return null;
    
    const wpmImprovement = currentResults.wpm - baselineResults.wpm;
    const accuracyImprovement = currentResults.accuracy - baselineResults.accuracy;
    
    return {
      wpmImprovement,
      accuracyImprovement,
      wpmPercentage: baselineResults.wpm > 0 ? Math.round((wpmImprovement / baselineResults.wpm) * 100) : 0,
      accuracyPercentage: baselineResults.accuracy > 0 ? Math.round((accuracyImprovement / baselineResults.accuracy) * 100) : 0
    };
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
                Loading Your Progress...
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showComparisonTest) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-primary animate-glow">
                Final Comparison Test
              </h1>
              <p className="text-xl text-muted-foreground">
                Let's see how much you've improved!
              </p>
            </div>

            <div className="flex justify-center">
              <TypingTest 
                wordCount={30}
                onComplete={handleComparisonTestComplete}
              />
            </div>
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
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Trophy className="w-20 h-20 text-primary animate-float" />
            </div>
            <h1 className="text-6xl font-bold text-primary mb-4 animate-glow">
              Congratulations! 🎉
            </h1>
            <p className="text-2xl text-aqua-light max-w-4xl mx-auto">
              You've unlocked a new superpower! Your fingers now dance across the keyboard with precision and speed.
            </p>
          </div>

          {/* Congratulatory Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Zap className="w-12 h-12 text-primary animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-primary">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Your typing speed has transformed from hunt-and-peck to lightning-fast precision!
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Target className="w-12 h-12 text-accent animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-accent">Pinpoint Accuracy</h3>
                <p className="text-muted-foreground">
                  Every keystroke hits its mark with surgical precision. No more typos slowing you down!
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <TrendingUp className="w-12 h-12 text-green-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-green-500">Continuous Growth</h3>
                <p className="text-muted-foreground">
                  This is just the beginning! Your typing skills will keep improving with practice.
                </p>
              </div>
            </Card>
          </div>

          {/* Progress Comparison */}
          {baselineResults && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-primary">
                  Your Amazing Progress
                </h2>
                <p className="text-xl text-muted-foreground">
                  Let's see how far you've come!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Baseline Results */}
                <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-muted-foreground">
                      Before (Baseline)
                    </h3>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-muted-foreground">
                        {baselineResults.wpm} WPM
                      </div>
                      <div className="text-2xl font-semibold text-muted-foreground">
                        {baselineResults.accuracy}% Accuracy
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Final Results */}
                <Card className="p-8 bg-card/50 backdrop-blur border-primary/20">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-primary">
                      After (Final Test)
                    </h3>
                    {finalTestResults ? (
                      <div className="text-center space-y-4">
                        <div className="text-4xl font-bold text-primary">
                          {finalTestResults.wpm} WPM
                        </div>
                        <div className="text-2xl font-semibold text-accent">
                          {finalTestResults.accuracy}% Accuracy
                        </div>
                        {getImprovementMessage() && (
                          <div className="text-lg font-semibold text-green-500 mt-4">
                            {getImprovementMessage()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                          Take a comparison test to see your final results!
                        </p>
                        <Button
                          onClick={() => setShowComparisonTest(true)}
                          className="gap-2"
                        >
                          <BarChart3 size={20} />
                          Take Comparison Test
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Comparison Results */}
              {comparisonTestResults && (
                <Card className="p-8 bg-card/50 backdrop-blur border-green-500/20">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-green-500">
                      Comparison Test Results
                    </h3>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-green-500">
                        {comparisonTestResults.wpm} WPM
                      </div>
                      <div className="text-2xl font-semibold text-green-500">
                        {comparisonTestResults.accuracy}% Accuracy
                      </div>
                      {(() => {
                        const comparison = getComparisonResults();
                        if (comparison) {
                          return (
                            <div className="space-y-2">
                              <div className="text-lg font-semibold text-green-500">
                                🚀 {comparison.wpmImprovement > 0 ? '+' : ''}{comparison.wpmImprovement} WPM improvement
                              </div>
                              <div className="text-lg font-semibold text-green-500">
                                🎯 {comparison.accuracyImprovement > 0 ? '+' : ''}{comparison.accuracyImprovement}% accuracy improvement
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="ocean"
                onClick={() => navigate("/lessons")}
                className="gap-2"
              >
                <ArrowLeft size={20} />
                Back to Roadmap
              </Button>
              
              {!comparisonTestResults && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowComparisonTest(true)}
                  className="gap-2"
                >
                  <BarChart3 size={20} />
                  Take Comparison Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProgress;
