import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useLocalization } from "@/hooks/useLocalization";
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
    sequence?: string;
    sequenceIndex?: number;
    letterTimings?: Array<{
      letter: string;
      reactionTime: number;
      timestamp: number;
      correct: boolean;
    }>;
    sequenceStartTime?: number;
    sequenceEndTime?: number;
    totalSequenceTime?: number;
    // Old format fields (for backward compatibility)
    letter?: string;
    reactionTime?: number;
    timestamp?: number;
    correct?: boolean;
  }>;
  average_reaction_time_ms: number;
  accuracy_percentage: number;
  created_at: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user } = useAuth();
  const { t } = useLocalization();
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
        // Validate and sanitize data structure
        const validatedData = (data || []).map((test: any) => ({
          ...test,
          typing_data: (test.typing_data || []) as TypingTestData['typing_data'],
          accuracy_percentage: test.accuracy_percentage != null ? test.accuracy_percentage : 0,
          average_reaction_time_ms: test.average_reaction_time_ms != null ? test.average_reaction_time_ms : 0,
          test_duration_ms: test.test_duration_ms || 0,
          total_letters: test.total_letters || 0,
          completed_letters: test.completed_letters || 0,
        }));
        setTypingTests(validatedData as TypingTestData[]);
      } else {
        // Load from both Supabase (for anonymous users who consented) and localStorage (for those who didn't)
        const sessionId = localStorage.getItem('bagre-questionnaire-session');
        
        let supabaseTests: any[] = [];
        if (sessionId) {
          try {
            const { data, error } = await supabase
              .from('typing_test_data')
              .select('*')
              .eq('session_id', sessionId)
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              // Validate and sanitize Supabase data for anonymous users
              supabaseTests = data.map(test => ({
                ...test,
                typing_data: test.typing_data || [],
                accuracy_percentage: test.accuracy_percentage != null ? test.accuracy_percentage : 0,
                average_reaction_time_ms: test.average_reaction_time_ms != null ? test.average_reaction_time_ms : 0,
                test_duration_ms: test.test_duration_ms || 0,
                total_letters: test.total_letters || 0,
                completed_letters: test.completed_letters || 0,
              }));
            }
          } catch (error) {
            console.error('Error fetching from Supabase:', error);
          }
        }
        
        // Also check localStorage
        const savedTests = localStorage.getItem('bagre-typing-tests');
        let localStorageTests: any[] = [];
        if (savedTests) {
          try {
            const tests = JSON.parse(savedTests);
            localStorageTests = tests.map((test: any, index: number) => ({
              ...test,
              id: test.id || `local-${Date.now()}-${index}`,
              created_at: test.created_at || test.completed_at || new Date().toISOString(),
              typing_data: test.typing_data || [],
              accuracy_percentage: test.accuracy_percentage != null ? test.accuracy_percentage : 0,
              average_reaction_time_ms: test.average_reaction_time_ms != null ? test.average_reaction_time_ms : 0,
              test_duration_ms: test.test_duration_ms || 0,
              total_letters: test.total_letters || 0,
              completed_letters: test.completed_letters || 0,
            }));
          } catch (error) {
            console.error('Error parsing localStorage tests:', error);
          }
        }
        
        // Combine both sources and sort by date
        const allTests = [...supabaseTests, ...localStorageTests];
        allTests.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Sanitize final data
        const sanitizedTests = allTests.map(test => ({
          ...test,
          keyboard_layout: test.keyboard_layout || 'unknown',
          can_touch_type: test.can_touch_type || 'unknown',
        }));
        setTypingTests(sanitizedTests);
      }
    } catch (error) {
      console.error('Error loading typing test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Flatten sequence data into individual letter data for charts
  const flattenSequenceData = (sequenceData: TypingTestData['typing_data']) => {
    if (!sequenceData || sequenceData.length === 0) {
      return [];
    }

    try {
      // Check if data is in new sequence format or old individual letter format
      const firstItem = sequenceData[0];
      
      if (firstItem && 'sequence' in firstItem && firstItem.letterTimings) {
        // New sequence format
        console.log('Using new sequence format for charts');
        return sequenceData.flatMap(sequence => 
          sequence.letterTimings?.map(letter => ({
            letter: letter?.letter || '',
            reactionTime: letter?.reactionTime || 0,
            timestamp: letter?.timestamp || 0,
            correct: letter?.correct || false
          })) || []
        ).filter(item => item.letter !== '');
      } else if (firstItem && 'letter' in firstItem) {
        // Old individual letter format (for backward compatibility)
        console.log('Using old individual letter format for charts');
        return sequenceData.map(letter => ({
          letter: letter.letter || '',
          reactionTime: letter.reactionTime || 0,
          timestamp: letter.timestamp || 0,
          correct: letter.correct || false
        })).filter(item => item.letter !== '');
      } else {
        console.warn('Unknown data format, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Error flattening sequence data:', error);
      return [];
    }
  };

  // Aggregate all typing data from all tests
  const getAllTimeTypingData = () => {
    return typingTests.flatMap(test => flattenSequenceData(test.typing_data || []));
  };

  const getLatestTest = () => {
    return typingTests.length > 0 ? typingTests[0] : null;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    return `${seconds}s`;
  };

  const getPerformanceLevel = (accuracy: number, avgReactionTime: number) => {
    // Add defensive checks for NaN, null, or undefined values
    const safeAccuracy = isNaN(accuracy) || accuracy == null ? 0 : accuracy;
    const safeAvgReactionTime = isNaN(avgReactionTime) || avgReactionTime == null ? 1000 : avgReactionTime;
    
    if (safeAccuracy >= 95 && safeAvgReactionTime <= 300) return { level: t('results.levels.expert'), color: "text-green-500" };
    if (safeAccuracy >= 90 && safeAvgReactionTime <= 500) return { level: t('results.levels.advanced'), color: "text-blue-500" };
    if (safeAccuracy >= 80 && safeAvgReactionTime <= 800) return { level: t('results.levels.intermediate'), color: "text-yellow-500" };
    return { level: t('results.levels.beginner'), color: "text-orange-500" };
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
                {t('results.title')}
              </h1>
              <p className="text-2xl text-aqua-light">
                {t('results.loading')}
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
                {t('results.title')}
              </h1>
              <p className="text-2xl text-aqua-light">
                {t('results.noData')}
              </p>
              <Button 
                onClick={() => navigate(`/${lang}/collect`)}
                className="mt-8"
              >
                {t('results.takeTest')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get numeric values with fallbacks for safety
  const accuracy = latestTest.accuracy_percentage != null && !isNaN(latestTest.accuracy_percentage) 
    ? latestTest.accuracy_percentage : 0;
  const avgReactionTime = latestTest.average_reaction_time_ms != null && !isNaN(latestTest.average_reaction_time_ms)
    ? latestTest.average_reaction_time_ms : 0;
  
  const performance = getPerformanceLevel(accuracy, avgReactionTime);

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
              {t('results.title')}
            </h1>
            <p className="text-2xl text-aqua-light">
              {t('results.description')}
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
                  <p className="text-muted-foreground">{t('results.performanceLevel')}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {accuracy}%
                    </div>
                    <p className="text-sm text-muted-foreground">{t('results.accuracy')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">
                      {avgReactionTime}ms
                    </div>
                    <p className="text-sm text-muted-foreground">{t('results.avgReaction')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Test Details Card */}
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent">{t('results.testDetails')}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('results.duration')}</span>
                    <span className="font-semibold">{formatDuration(latestTest.test_duration_ms || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('results.lettersTyped')}</span>
                    <span className="font-semibold">{latestTest.completed_letters || 0}/{latestTest.total_letters || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('results.keyboard')}</span>
                    <span className="font-semibold capitalize">{latestTest.keyboard_layout || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('results.touchTyping')}</span>
                    <span className="font-semibold">
                      {latestTest.can_touch_type ? t(`results.touchTypingValues.${latestTest.can_touch_type}`) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(`/${lang}/collect`)}
              className="flex-1 sm:flex-none"
            >
              {t('results.takeAnotherTest')}
            </Button>
            <Button 
              onClick={() => navigate(`/${lang}`)}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {t('results.backToHome')}
            </Button>
          </div>

          {/* Letter Performance Chart */}
          <LetterPerformanceChart typingData={getAllTimeTypingData()} />

          {/* Test History */}
          {typingTests.length > 1 && (
            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-accent">{t('results.testHistory')}</h3>
                  <div className="text-sm text-muted-foreground">
                    {t('results.showing')} {startIndex + 1}-{Math.min(endIndex, typingTests.length)} {t('results.of')} {typingTests.length} {t('results.tests')}
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
                          <span>{test.accuracy_percentage != null ? test.accuracy_percentage : 0}% {t('results.accuracyLabel')}</span>
                          <span>{test.average_reaction_time_ms != null ? test.average_reaction_time_ms : 0}ms {t('results.avgLabel')}</span>
                        </div>
                      </div>

                      {/* Expanded Chart */}
                      {expandedTestId === test.id && (
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <HorizontalLetterChart typingData={flattenSequenceData(test.typing_data)} />
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
                      {t('results.previous')}
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
                      {t('results.next')}
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
