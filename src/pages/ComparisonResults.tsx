import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, TrendingUp, Target, Zap, BarChart3, Award, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ComparisonResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [baselineResults, setBaselineResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [comparisonResults, setComparisonResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get comparison test results from navigation state
  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state?.comparisonResults) {
      console.log('Setting comparison results:', location.state.comparisonResults);
      setComparisonResults(location.state.comparisonResults);
    } else {
      console.log('No comparison results in location state');
    }
  }, [location.state]);

  // Load baseline results
  useEffect(() => {
    const loadBaselineResults = async () => {
      try {
        console.log('Loading baseline results for user:', user?.id);
        if (user) {
          // Load from Supabase for logged-in users
          const { data, error } = await supabase
            .from('user_progress')
            .select('baseline_wpm, baseline_accuracy')
            .eq('user_id', user.id)
            .single();

          console.log('Supabase baseline query result:', { data, error });
          
          if (data && !error && data.baseline_wpm && data.baseline_accuracy) {
            console.log('Setting baseline results:', { wpm: data.baseline_wpm, accuracy: data.baseline_accuracy });
            setBaselineResults({
              wpm: data.baseline_wpm,
              accuracy: data.baseline_accuracy
            });
          } else {
            console.log('No baseline data found or error occurred');
          }
        } else {
          // Load from localStorage for anonymous users
          console.log('Loading baseline from localStorage for anonymous user');
          const baselineWpm = localStorage.getItem('baseline_wpm');
          const baselineAccuracy = localStorage.getItem('baseline_accuracy');
          
          console.log('localStorage baseline data:', { baselineWpm, baselineAccuracy });
          
          if (baselineWpm && baselineAccuracy) {
            setBaselineResults({
              wpm: parseInt(baselineWpm),
              accuracy: parseInt(baselineAccuracy)
            });
          }
        }
      } catch (error) {
        console.error('Error loading baseline results:', error);
      }
      // Don't set loading to false here - wait for both results
    };

    loadBaselineResults();
  }, [user]);

  // Set loading to false after comparison results are loaded (baseline is optional)
  useEffect(() => {
    if (comparisonResults) {
      console.log('Comparison results loaded, setting loading to false. Baseline:', baselineResults);
      setIsLoading(false);
    }
  }, [baselineResults, comparisonResults]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Loading timeout reached, setting loading to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

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
                Loading Your Results...
              </h1>
              <p className="text-xl text-muted-foreground">
                Debug: isLoading={isLoading.toString()}, baselineResults={baselineResults ? 'loaded' : 'null'}, comparisonResults={comparisonResults ? 'loaded' : 'null'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonResults) {
    console.log('Missing comparison results - baselineResults:', baselineResults, 'comparisonResults:', comparisonResults);
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
              <h1 className="text-6xl font-bold text-primary mb-4">
                Results Not Available
              </h1>
              <p className="text-xl text-muted-foreground">
                We couldn't load your comparison results. Please try again.
              </p>
              <Button onClick={() => navigate("/compare-progress")}>
                Take Comparison Test Again
              </Button>
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
              Your Progress Results! 🎉
            </h1>
            <p className="text-2xl text-aqua-light max-w-4xl mx-auto">
              {baselineResults ? 
                `🚀 Amazing! You've improved by ${comparisonResults.wpm - baselineResults.wpm} WPM and ${comparisonResults.accuracy - baselineResults.accuracy}% accuracy!` :
                ``
              }
            </p>
          </div>

          {/* Comparison Results */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <p className="text-xl text-muted-foreground">
                {baselineResults ? "See how much you've improved since day one!" : "Here are your comparison test results!"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Baseline Results (if available) */}
              {baselineResults && (
                <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-muted-foreground">
                      Baseline Test
                    </h3>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-muted-foreground">
                        {baselineResults.wpm} WPM
                      </div>
                      <div className="text-2xl font-semibold text-muted-foreground">
                        {baselineResults.accuracy}% Accuracy
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your starting point
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Comparison Results */}
              <Card className="p-8 bg-card/50 backdrop-blur border-primary/20">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-primary">
                    Final Comparison Test
                  </h3>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {comparisonResults.wpm} WPM
                    </div>
                    <div className="text-2xl font-semibold text-accent">
                      {comparisonResults.accuracy}% Accuracy
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your current level
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Improvement Statistics (if baseline available) */}
            {baselineResults && (
              <Card className="p-8 bg-card/50 backdrop-blur border-green-500/20">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-green-500">
                    Your Amazing Improvement
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-green-500">
                        {comparisonResults.wpm - baselineResults.wpm > 0 ? '+' : ''}{comparisonResults.wpm - baselineResults.wpm} WPM
                      </div>
                      <div className="text-lg text-muted-foreground">
                        Speed Improvement
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-green-500">
                        {comparisonResults.accuracy - baselineResults.accuracy > 0 ? '+' : ''}{comparisonResults.accuracy - baselineResults.accuracy}%
                      </div>
                      <div className="text-lg text-muted-foreground">
                        Accuracy Improvement
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-primary">
                🚀 The Sky's the Limit!
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Now you can practice as much as you want! Your typing journey has just begun, and with consistent practice, you'll continue to improve and reach new heights.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="ocean"
                onClick={() => navigate("/practice")}
                className="gap-2 text-lg px-8 py-4"
              >
                <Zap size={24} />
                Start Practicing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;