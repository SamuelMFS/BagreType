import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LetterPerformanceChart from "@/components/LetterPerformanceChart";
import HorizontalLetterChart from "@/components/HorizontalLetterChart";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TypingTestData {
  id: string;
  keyboard_layout: string;
  can_touch_type: string;
  test_duration_ms: number;
  total_letters: number;
  completed_letters: number;
  typing_data: Array<{
    letter: string;
    reactionTime: number;
    timestamp: number;
    correct: boolean;
  }>;
  average_reaction_time_ms: number;
  accuracy_percentage: number;
  created_at: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [typingTests, setTypingTests] = useState<TypingTestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadTypingTestData();
  }, [user]);

  const loadTypingTestData = async () => {
    try {
      if (user) {
        // Load from Supabase for logged-in users
        const { data, error } = await supabase
          .from('typing_test_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTypingTests(data || []);
      } else {
        // Load from localStorage for anonymous users
        const savedTests = localStorage.getItem('bagre-typing-tests');
        if (savedTests) {
          const tests = JSON.parse(savedTests);
          // Normalize localStorage data to match Supabase structure
          const normalizedTests = tests.map((test: any, index: number) => ({
            ...test,
            // Generate unique ID if missing
            id: test.id || `local-${Date.now()}-${index}`,
            // Use completed_at as created_at for localStorage data
            created_at: test.created_at || test.completed_at || new Date().toISOString()
          }));
          // Sort by date (most recent first)
          normalizedTests.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setTypingTests(normalizedTests);
        }
      }
    } catch (error) {
      console.error('Error loading typing test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregate all typing data from all tests
  const getAllTimeTypingData = () => {
    return typingTests.flatMap(test => test.typing_data || []);
  };

  const getLatestTest = () => {
    return typingTests.length > 0 ? typingTests[0] : null;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    return `${seconds}s`;
  };

  const getPerformanceLevel = (accuracy: number, avgReactionTime: number) => {
    if (accuracy >= 95 && avgReactionTime <= 300) return { level: "Expert", color: "text-green-500" };
    if (accuracy >= 90 && avgReactionTime <= 500) return { level: "Advanced", color: "text-blue-500" };
    if (accuracy >= 80 && avgReactionTime <= 800) return { level: "Intermediate", color: "text-yellow-500" };
    return { level: "Beginner", color: "text-orange-500" };
  };

  const toggleTestExpansion = (testId: string) => {
    setExpandedTestId(expandedTestId === testId ? null : testId);
  };

  const TESTS_PER_PAGE = 10;
  const totalPages = Math.ceil(typingTests.length / TESTS_PER_PAGE);
  const startIndex = (currentPage - 1) * TESTS_PER_PAGE;
  const endIndex = startIndex + TESTS_PER_PAGE;
  const currentTests = typingTests.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedTestId(null); // Close any expanded test when changing pages
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
                Results
              </h1>
              <p className="text-2xl text-aqua-light">
                Loading your performance data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latestTest = getLatestTest();

  if (!latestTest) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
                Results
              </h1>
              <p className="text-2xl text-aqua-light">
                No test data found
              </p>
              <Button 
                onClick={() => navigate('/collect')}
                className="mt-8"
              >
                Take a Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const performance = getPerformanceLevel(latestTest.accuracy_percentage, latestTest.average_reaction_time_ms);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Your Results
            </h1>
            <p className="text-2xl text-aqua-light">
              Performance analysis from your typing test
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Performance Card */}
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${performance.color} mb-2`}>
                    {performance.level}
                  </div>
                  <p className="text-muted-foreground">Performance Level</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {latestTest.accuracy_percentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">
                      {latestTest.average_reaction_time_ms}ms
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Reaction</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Test Details Card */}
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent">Test Details</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{formatDuration(latestTest.test_duration_ms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Letters Typed:</span>
                    <span className="font-semibold">{latestTest.completed_letters}/{latestTest.total_letters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keyboard:</span>
                    <span className="font-semibold capitalize">{latestTest.keyboard_layout}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Touch Typing:</span>
                    <span className="font-semibold capitalize">{latestTest.can_touch_type}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/collect')}
              className="flex-1 sm:flex-none"
            >
              Take Another Test
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Back to Home
            </Button>
          </div>

          {/* Letter Performance Chart */}
          <LetterPerformanceChart typingData={getAllTimeTypingData()} />

          {/* Test History */}
          {typingTests.length > 1 && (
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-accent">Test History</h3>
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, typingTests.length)} of {typingTests.length} tests
                  </div>
                </div>
                
                <div className="space-y-3">
                  {currentTests.map((test, index) => (
                    <div key={test.id} className="space-y-3">
                      {/* Test Summary Row */}
                      <div 
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleTestExpansion(test.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            #{typingTests.length - (startIndex + index)}
                          </div>
                          <div className="text-sm">
                            {new Date(test.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {expandedTestId === test.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span>{test.accuracy_percentage}% accuracy</span>
                          <span>{test.average_reaction_time_ms}ms avg</span>
                        </div>
                      </div>

                      {/* Expanded Chart */}
                      {expandedTestId === test.id && (
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <HorizontalLetterChart typingData={test.typing_data} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default Results;
