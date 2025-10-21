import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import SegmentedProgressBar from "@/components/SegmentedProgressBar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type KeyboardLayout = "ortholinear" | "staggered" | null;
type TouchTyper = "yes" | "no" | null;
type WantToLearn = "yes" | "no" | null;
type ShareData = "yes" | "no" | null;

const DataCollection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"layout" | "touch-type" | "want-to-learn" | "share" | "test">("layout");
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>(null);
  const [canTouchType, setCanTouchType] = useState<TouchTyper>(null);
  const [wantToLearn, setWantToLearn] = useState<WantToLearn>(null);
  const [shareData, setShareData] = useState<ShareData>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Typing test state
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [letterSequence, setLetterSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingData, setTypingData] = useState<Array<{letter: string, reactionTime: number, timestamp: number, correct: boolean}>>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [questionnaireResponseId, setQuestionnaireResponseId] = useState<string | null>(null);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [lastTypedCorrect, setLastTypedCorrect] = useState<boolean | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  // Generate or retrieve session ID for anonymous users
  useEffect(() => {
    const getOrCreateSessionId = () => {
      const existingSessionId = localStorage.getItem('bagre-questionnaire-session');
      if (existingSessionId) {
        return existingSessionId;
      }
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('bagre-questionnaire-session', newSessionId);
      return newSessionId;
    };

    setSessionId(getOrCreateSessionId());
  }, []);

  // Load saved questionnaire data
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        if (user) {
          // Load from Supabase for logged-in users
          const { data, error } = await supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          if (data && !error) {
            setKeyboardLayout(data.keyboard_layout as KeyboardLayout);
            setCanTouchType(data.can_touch_type as TouchTyper);
            setWantToLearn(data.want_to_learn as WantToLearn);
            setShareData(data.share_data as ShareData);
            setStep(data.current_step as any);
          }
        } else {
          // Load from localStorage for anonymous users
          const savedData = localStorage.getItem('bagre-questionnaire-data');
          if (savedData) {
            const data = JSON.parse(savedData);
            setKeyboardLayout(data.keyboardLayout);
            setCanTouchType(data.canTouchType);
            setWantToLearn(data.wantToLearn);
            setShareData(data.shareData);
            setStep(data.step);
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, [user]);

  // Save questionnaire data
  const saveQuestionnaireData = async () => {
    try {
      const dataToSave = {
        keyboard_layout: keyboardLayout,
        can_touch_type: canTouchType,
        want_to_learn: wantToLearn,
        share_data: shareData,
        current_step: step,
      };

      if (user) {
        // Save to Supabase for logged-in users
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .upsert({
            user_id: user.id,
            ...dataToSave,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setQuestionnaireResponseId(data.id);
      } else {
        // Save to localStorage for anonymous users
        localStorage.setItem('bagre-questionnaire-data', JSON.stringify({
          keyboardLayout,
          canTouchType,
          wantToLearn,
          shareData,
          step,
        }));
      }
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
    }
  };

  // Auto-save when data changes
  useEffect(() => {
    if (!isLoading && (keyboardLayout || canTouchType || wantToLearn || shareData)) {
      saveQuestionnaireData();
    }
  }, [keyboardLayout, canTouchType, wantToLearn, shareData, step, isLoading]);

  // Generate letter sequence for typing test
  useEffect(() => {
    if (step === "test") {
      const letters = "abcdefghijklmnopqrstuvwxyz";
      const sequence = Array.from({ length: 30 }, () => 
        letters[Math.floor(Math.random() * letters.length)]
      );
      setLetterSequence(sequence);
      setCurrentLetter(sequence[0]);
      setCurrentIndex(0);
      setTypingData([]);
      setTestCompleted(false);
      setIsTestActive(false);
      setLastTypedCorrect(null);
      setIsBouncing(false);
    }
  }, [step]);

  // Typing test keyboard handler
  useEffect(() => {
    if (step !== "test") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for space and escape
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (!isTestActive && !testCompleted) {
          setIsTestActive(true);
          setTestStartTime(Date.now());
        } else if (testCompleted) {
          restartTest();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (isTestActive) {
          setIsTestActive(false);
          setTestStartTime(null);
        }
        return;
      }

      // Handle letter input
      if (e.key.length === 1 && isTestActive && testStartTime && !testCompleted) {
        const now = Date.now();
        const reactionTime = now - testStartTime;
        const isCorrect = e.key.toLowerCase() === currentLetter.toLowerCase();
        
        // Set feedback state and trigger bounce animation
        setLastTypedCorrect(isCorrect);
        setIsBouncing(true);
        
        // Reset bounce animation after a short delay
        setTimeout(() => {
          setIsBouncing(false);
          setLastTypedCorrect(null);
        }, 200);
        
        setTypingData(prev => [...prev, {
          letter: currentLetter,
          reactionTime,
          timestamp: now,
          correct: isCorrect
        }]);

        // Move to next letter
        const nextIndex = currentIndex + 1;
        if (nextIndex < letterSequence.length) {
          setCurrentIndex(nextIndex);
          setCurrentLetter(letterSequence[nextIndex]);
          setTestStartTime(now); // Reset timer for next letter
        } else {
          // Test completed
          setIsTestActive(false);
          setTestCompleted(true);
          setShowResultsButton(true);
          saveTypingTestData();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTestActive, testStartTime, currentLetter, currentIndex, letterSequence, typingData, testCompleted, step]);

  // Restart typing test
  const restartTest = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const sequence = Array.from({ length: 30 }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    );
    setLetterSequence(sequence);
    setCurrentLetter(sequence[0]);
    setCurrentIndex(0);
    setTypingData([]);
    setTestCompleted(false);
    setIsTestActive(false);
    setTestStartTime(null);
    setLastTypedCorrect(null);
    setIsBouncing(false);
  };

  // Save typing test data to Supabase
  const saveTypingTestData = async () => {
    try {
      if (typingData.length === 0) return;

      const totalDuration = typingData[typingData.length - 1].timestamp - typingData[0].timestamp;
      const correctAnswers = typingData.filter(d => d.correct).length;
      const accuracy = (correctAnswers / typingData.length) * 100;
      const averageReactionTime = typingData.reduce((sum, d) => sum + d.reactionTime, 0) / typingData.length;

      const testData = {
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        questionnaire_response_id: questionnaireResponseId,
        keyboard_layout: keyboardLayout!,
        can_touch_type: canTouchType!,
        test_duration_ms: totalDuration,
        total_letters: letterSequence.length,
        completed_letters: typingData.length,
        typing_data: typingData,
        average_reaction_time_ms: Math.round(averageReactionTime),
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        completed_at: new Date().toISOString(),
      };

      if (user) {
        // Save to Supabase for logged-in users
        const { error } = await supabase
          .from('typing_test_data')
          .insert(testData);

        if (error) throw error;
        console.log('Typing test data saved to Supabase:', testData);
      } else {
        // Save to localStorage for anonymous users
        const existingData = localStorage.getItem('bagre-typing-tests') || '[]';
        const tests = JSON.parse(existingData);
        tests.push(testData);
        localStorage.setItem('bagre-typing-tests', JSON.stringify(tests));
        console.log('Typing test data saved to localStorage:', testData);
      }
    } catch (error) {
      console.error('Error saving typing test data:', error);
    }
  };

  // Auto-advance functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (keyboardLayout && step === "layout") {
      timeoutId = setTimeout(() => {
        setStep("touch-type");
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [keyboardLayout, step]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (canTouchType && step === "touch-type") {
      timeoutId = setTimeout(() => {
    if (canTouchType === "yes") {
      setStep("share");
    } else if (canTouchType === "no") {
          setStep("want-to-learn");
        }
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [canTouchType, step]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (wantToLearn && step === "want-to-learn") {
      timeoutId = setTimeout(() => {
        if (wantToLearn === "yes") {
          navigate("/learn");
        } else if (wantToLearn === "no") {
      setStep("share");
        }
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [wantToLearn, step, navigate]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (shareData && step === "share") {
      timeoutId = setTimeout(() => {
        setStep("test");
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shareData, step]);

  // Calculate current step number for progress bar
  const getCurrentStepNumber = () => {
    switch (step) {
      case "layout": return 1;
      case "touch-type": return 2;
      case "want-to-learn": return 3;
      case "share": return 3; // Same as want-to-learn since they're parallel paths
      case "test": return 4;
      default: return 1;
    }
  };

  // Total steps in the questionnaire
  const totalSteps = 4;

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
                Data Collection
              </h1>
              <p className="text-2xl text-aqua-light">
                Loading your progress...
              </p>
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
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Data Collection
            </h1>
            <p className="text-2xl text-aqua-light">
              Help us build the future of keyboard layouts
            </p>
          </div>

          {step !== "test" && (
            <div className="flex flex-col items-center space-y-2 mb-8">
              <SegmentedProgressBar 
                currentStep={getCurrentStepNumber()} 
                totalSteps={totalSteps}
              />
              <p className="text-sm text-muted-foreground">
                Step {getCurrentStepNumber()} of {totalSteps}
              </p>
            </div>
          )}

          {step === "layout" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">What type of keyboard do you use?</h2>
                <p className="text-lg text-muted-foreground">
                  This helps us understand the physical layout you're typing on
                </p>
              </div>
              
              <div className="space-y-6">
                <RadioGroup value={keyboardLayout || ""} onValueChange={(v) => setKeyboardLayout(v as KeyboardLayout)}>
                  <Label htmlFor="staggered" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="staggered" id="staggered" className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="space-y-1">
                        <p className="text-xl font-semibold text-foreground">Staggered</p>
                        <p className="text-base text-muted-foreground">Traditional keyboard with offset rows (most common)</p>
                      </div>
                      </div>
                    </Label>
                  
                  <Label htmlFor="ortholinear" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="ortholinear" id="ortholinear" className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="space-y-1">
                        <p className="text-xl font-semibold text-foreground">Ortholinear</p>
                        <p className="text-base text-muted-foreground">Keys arranged in a perfect grid (mechanical keyboards)</p>
                      </div>
                      </div>
                    </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === "touch-type" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Can you touch type?</h2>
                <p className="text-lg text-muted-foreground">
                  Touch typing means typing without looking at the keyboard
                </p>
              </div>

              <div className="space-y-6">
                <RadioGroup value={canTouchType || ""} onValueChange={(v) => setCanTouchType(v as TouchTyper)}>
                  <Label htmlFor="yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="yes" id="yes" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">Yes, I can touch type</p>
                    </div>
                    </Label>
                  
                  <Label htmlFor="no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="no" id="no" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">No, I look at the keyboard</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === "want-to-learn" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Do you want to learn touch typing?</h2>
                <p className="text-lg text-muted-foreground">
                  We can help you master touch typing in just a few weeks
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-3">
                  <h3 className="text-xl font-semibold text-accent">Why Learn Touch Typing?</h3>
                  <ul className="space-y-2 text-base text-foreground/80">
                    <li>• <span className="font-semibold">2-3x faster typing</span> - Increase from 30-40 WPM to 60-100+ WPM</li>
                    <li>• <span className="font-semibold">Better accuracy</span> - Type without looking at the keyboard</li>
                    <li>• <span className="font-semibold">Less fatigue</span> - Proper technique reduces strain</li>
                    <li>• <span className="font-semibold">Professional skill</span> - Essential for many careers</li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic pt-2">
                    Our gamified learning system makes it fun and engaging, similar to Duolingo!
                  </p>
                </div>

                <RadioGroup value={wantToLearn || ""} onValueChange={(v) => setWantToLearn(v as WantToLearn)}>
                  <Label htmlFor="learn-yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="yes" id="learn-yes" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">Yes, I want to learn touch typing</p>
                    </div>
                    </Label>
                  
                  <Label htmlFor="learn-no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="no" id="learn-no" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">No, I'll continue with my current method</p>
                  </div>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === "share" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Share Your Data?</h2>
                <p className="text-lg text-muted-foreground">
                  Help improve keyboard layouts for everyone
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="text-xl font-semibold text-accent">What Data We Collect:</h3>
                  <ul className="space-y-2 text-base text-foreground/80">
                    <li>• Reaction times for each key press</li>
                    <li>• Time between consecutive keys in sequences</li>
                    <li>• Typing accuracy metrics</li>
                    <li>• Keyboard layout type</li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic pt-2">
                    All data is anonymized and used solely for research purposes. 
                    No personal information is stored.
                  </p>
                </div>

                <RadioGroup value={shareData || ""} onValueChange={(v) => setShareData(v as ShareData)}>
                  <Label htmlFor="share-yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="yes" id="share-yes" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">Yes, share my data with the project</p>
                    </div>
                    </Label>
                  
                  <Label htmlFor="share-no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="no" id="share-no" className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">No, keep data locally (I can export it later)</p>
                    </div>
                    </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === "test" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Typing Test</h2>
              </div>

              <div className="space-y-8">
                <div className="text-center space-y-6">
                  <Card className={`p-12 bg-card/90 backdrop-blur-md border-border/50 max-w-md mx-auto relative transition-all duration-200 ${
                    !isTestActive && !testCompleted ? 'blur-sm' : ''
                  }`}>
                    <div className="absolute top-4 right-4 text-sm text-muted-foreground">
                      {testCompleted ? `${letterSequence.length} of ${letterSequence.length}` : `${currentIndex + 1} of ${letterSequence.length}`}
                    </div>
                    <div className="text-center">
                      {testCompleted ? (
                        <div className="space-y-6">
                          <div className="text-6xl">↻</div>
                          <div className="text-lg text-muted-foreground">
                            Press Space to play again
                          </div>
                        </div>
                      ) : (
                        <div className={`text-6xl font-bold transition-all duration-150 ${
                          lastTypedCorrect === true ? 'text-green-500' :
                          lastTypedCorrect === false ? 'text-red-500' :
                          'text-primary'
                        } ${isBouncing ? 'scale-125' : 'scale-100'}`}>
                          {currentLetter}
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  {!testCompleted && (
                  <p className="text-base text-muted-foreground">
                    Press <kbd className="px-3 py-1.5 bg-card rounded border-2 border-border text-foreground font-mono">Space</kbd> to start • 
                    Press <kbd className="px-3 py-1.5 bg-card rounded border-2 border-border text-foreground font-mono ml-1">Esc</kbd> to stop
                  </p>
                  )}
                  
                  <div className="text-lg text-muted-foreground space-y-1">
                    <p>Type each letter as quickly and accurately as possible</p>
                    <p>This will take only 15-30 secs</p>
                  </div>
                  
                  {showResultsButton && (
                    <div className={`transition-opacity duration-1000 ${showResultsButton ? 'opacity-100' : 'opacity-0'}`}>
                      <button 
                        onClick={() => navigate('/results')}
                        className="text-lg font-semibold text-primary hover:text-accent transition-colors"
                      >
                        Results →
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-center text-base text-muted-foreground">
                  <p>Focus on accuracy first, then speed will follow naturally</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCollection;
