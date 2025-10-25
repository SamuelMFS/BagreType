import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SegmentedProgressBar from "@/components/SegmentedProgressBar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/hooks/useLocalization";
import { supabase } from "@/integrations/supabase/client";

type KeyboardLayout = "ortholinear" | "staggered" | null;
type TouchTyper = "yes" | "no" | null;
type WantToLearn = "yes" | "no" | null;
type ShareData = "yes" | "no" | null;

const DataCollection = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user } = useAuth();
  const { t } = useLocalization();
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
  const [userJustSelected, setUserJustSelected] = useState(false);
  const [previousStep, setPreviousStep] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

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

  // Reset all questionnaire choices
  const resetQuestionnaire = () => {
    setKeyboardLayout(null);
    setCanTouchType(null);
    setWantToLearn(null);
    setShareData(null);
    setStep("layout");
    setUserJustSelected(false);
    
    // Clear saved data
    if (user) {
      // For logged-in users, we could delete from Supabase, but for now just clear local state
      console.log('Reset questionnaire for logged-in user');
    } else {
      // Clear localStorage for anonymous users
      localStorage.removeItem('bagre-questionnaire-data');
      localStorage.removeItem('bagre-questionnaire-session');
    }
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
        transitionToStep("touch-type");
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
      transitionToStep("share");
    } else if (canTouchType === "no") {
          transitionToStep("want-to-learn");
        }
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [canTouchType, step]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Only auto-advance if user just made a selection (not when loading saved data)
    if (wantToLearn && step === "want-to-learn" && userJustSelected && !isLoading) {
      timeoutId = setTimeout(() => {
        if (wantToLearn === "yes") {
          navigate(`/${lang}/learn`);
        } else if (wantToLearn === "no") {
          transitionToStep("share");
        }
        setUserJustSelected(false); // Reset the flag
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [wantToLearn, step, navigate, isLoading, userJustSelected]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (shareData && step === "share") {
      timeoutId = setTimeout(() => {
        transitionToStep("test");
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shareData, step]);

  // Function to handle step transitions with animation
  const transitionToStep = (newStep: string) => {
    if (step !== newStep) {
      setPreviousStep(step);
      setIsExiting(true);
      
      // After exit animation, change step and start enter animation
      setTimeout(() => {
        setStep(newStep as any);
        setIsExiting(false);
      }, 300);
    }
  };

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
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
                {t('dataCollection.title')}
              </h1>
              <p className="text-2xl text-aqua-light">
                {t('dataCollection.loading')}
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
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              {t('dataCollection.title')}
            </h1>
            <p className="text-2xl text-aqua-light">
              {t('dataCollection.description')}
            </p>
          </div>

          <div className={`transition-all duration-300 ${isExiting ? "animate-slide-out-left" : "animate-slide-in-right"}`}>
            {step === "layout" && (
              <div className="space-y-8">
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-accent">{t('dataCollection.steps.layout.title')}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t('dataCollection.steps.layout.description')}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <RadioGroup value={keyboardLayout || ""} onValueChange={(v) => setKeyboardLayout(v as KeyboardLayout)}>
                    <Label htmlFor="staggered" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="staggered" id="staggered" className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="space-y-1">
                          <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.layout.staggered')}</p>
                          <p className="text-base text-muted-foreground">{t('dataCollection.steps.layout.staggeredDescription')}</p>
                        </div>
                        </div>
                      </Label>
                    
                    <Label htmlFor="ortholinear" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="ortholinear" id="ortholinear" className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="space-y-1">
                          <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.layout.ortholinear')}</p>
                          <p className="text-base text-muted-foreground">{t('dataCollection.steps.layout.ortholinearDescription')}</p>
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
                  <h2 className="text-3xl font-semibold text-accent">{t('dataCollection.steps.touchType.title')}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t('dataCollection.steps.touchType.description')}
                  </p>
                </div>

                <div className="space-y-6">
                  <RadioGroup value={canTouchType || ""} onValueChange={(v) => setCanTouchType(v as TouchTyper)}>
                    <Label htmlFor="yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="yes" id="yes" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.touchType.yes')}</p>
                      </div>
                      </Label>
                    
                    <Label htmlFor="no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="no" id="no" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.touchType.no')}</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === "want-to-learn" && (
              <div className="space-y-8">
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-accent">{t('dataCollection.steps.wantToLearn.title')}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t('dataCollection.steps.wantToLearn.description')}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-lg border border-border/50 space-y-3">
                    <h3 className="text-xl font-semibold text-accent">{t('dataCollection.steps.wantToLearn.whyLearn')}</h3>
                    <ul className="space-y-2 text-base text-foreground/80">
                      <li>• <span className="font-semibold">{t('dataCollection.steps.wantToLearn.benefits.faster')}</span></li>
                      <li>• <span className="font-semibold">{t('dataCollection.steps.wantToLearn.benefits.accuracy')}</span></li>
                      <li>• <span className="font-semibold">{t('dataCollection.steps.wantToLearn.benefits.fatigue')}</span></li>
                      <li>• <span className="font-semibold">{t('dataCollection.steps.wantToLearn.benefits.professional')}</span></li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic pt-2">
                      {t('dataCollection.steps.wantToLearn.gamified')}
                    </p>
                  </div>

                  <RadioGroup value={wantToLearn || ""} onValueChange={(v) => {
                    setWantToLearn(v as WantToLearn);
                    setUserJustSelected(true); // Mark that user just made a selection
                  }}>
                    <Label htmlFor="learn-yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="yes" id="learn-yes" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.wantToLearn.yes')}</p>
                      </div>
                      </Label>
                    
                    <Label htmlFor="learn-no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="no" id="learn-no" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.wantToLearn.no')}</p>
                    </div>
                    </Label>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === "share" && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-semibold text-accent">{t('dataCollection.steps.share.title')}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t('dataCollection.steps.share.description')}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-6 rounded-lg border border-border/50 space-y-4">
                    <h3 className="text-xl font-semibold text-accent">{t('dataCollection.steps.share.whatWeCollect')}</h3>
                    <ul className="space-y-2 text-base text-foreground/80">
                      <li>• {t('dataCollection.steps.share.dataTypes.reactionTimes')}</li>
                      <li>• {t('dataCollection.steps.share.dataTypes.sequences')}</li>
                      <li>• {t('dataCollection.steps.share.dataTypes.accuracy')}</li>
                      <li>• {t('dataCollection.steps.share.dataTypes.layout')}</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic pt-2">
                      {t('dataCollection.steps.share.privacy')}
                    </p>
                  </div>

                  <RadioGroup value={shareData || ""} onValueChange={(v) => setShareData(v as ShareData)}>
                    <Label htmlFor="share-yes" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="yes" id="share-yes" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.share.yes')}</p>
                      </div>
                      </Label>
                    
                    <Label htmlFor="share-no" className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                      <RadioGroupItem value="no" id="share-no" className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-foreground">{t('dataCollection.steps.share.no')}</p>
                      </div>
                      </Label>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === "test" && (
              <div className="space-y-8">
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-accent">{t('dataCollection.steps.test.title')}</h2>
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
                              {t('dataCollection.steps.test.spaceToPlayAgain')}
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
                      {t('dataCollection.steps.test.spaceToStart')} • 
                      {t('dataCollection.steps.test.escToStop')}
                    </p>
                    )}
                    
                    <div className="text-lg text-muted-foreground space-y-1">
                      <p>{t('dataCollection.steps.test.instructions')}</p>
                      <p>{t('dataCollection.steps.test.duration')}</p>
                    </div>
                    
                    {showResultsButton && (
                      <div className={`transition-opacity duration-1000 ${showResultsButton ? 'opacity-100' : 'opacity-0'}`}>
                        <button 
                          onClick={() => navigate(`/${lang}/results`)}
                          className="text-lg font-semibold text-primary hover:text-accent transition-colors"
                        >
                          {t('dataCollection.steps.test.results')}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-base text-muted-foreground">
                    <p>{t('dataCollection.steps.test.focusOnAccuracy')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress bar and Reset button - locked in position */}
          <div className="fixed left-1/2 transform -translate-x-1/2 bottom-16 z-10">
            <div className="flex flex-col items-center space-y-2">
              <SegmentedProgressBar 
                currentStep={getCurrentStepNumber()} 
                totalSteps={totalSteps}
              />
              <p className="text-sm text-muted-foreground">
                {t('dataCollection.steps.test.step')} {getCurrentStepNumber()} {t('dataCollection.steps.test.of')} {totalSteps}
              </p>
              
              {/* Reset Choices button - extra small */}
              {(keyboardLayout || canTouchType || wantToLearn || shareData) && (
                <button
                  onClick={resetQuestionnaire}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  {t('dataCollection.steps.test.resetChoices')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollection;
