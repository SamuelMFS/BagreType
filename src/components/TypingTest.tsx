import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface TypingTestProps {
  wordCount?: number;
  customText?: string;
  timeLimit?: number; // in seconds
  zenMode?: boolean; // for zen mode
  onComplete?: (wpm: number, accuracy: number) => void;
  onRestart?: () => void;
  hideCompletionScreen?: boolean; // New prop to hide completion screen
  onCurrentCharChange?: (char: string) => void; // New prop to track current character
  cheatMode?: boolean; // Cheat mode where all keys are correct
}

const commonWordsEnglish = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

const commonWordsPortuguese = [
  'o', 'a', 'de', 'e', 'do', 'da', 'em', 'um', 'para', 'e',
  'com', 'nao', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as',
  'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'a', 'seu',
  'sua', 'ou', 'ser', 'quando', 'muito', 'ha', 'nos', 'ja', 'esta', 'eu',
  'também', 'so', 'pelo', 'pela', 'ate', 'isso', 'ela', 'entre', 'era', 'depois',
  'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'numa', 'pelos', 'pelas', 'esse',
  'eles', 'estava', 'foram', 'essa', 'num', 'nem', 'meu', 'minha', 'tem', 'todo',
  'toda', 'todos', 'todas', 'pode', 'poder', 'fazer', 'feito', 'feita', 'feitos', 'feitas',
  'vida', 'pessoa', 'homem', 'mulher', 'casa', 'trabalho', 'tempo', 'dia', 'noite', 'ano',
  'mes', 'semana', 'hora', 'minuto', 'segundo', 'agora', 'hoje', 'ontem', 'amanha', 'sempre',
  'nunca', 'talvez', 'quase', 'junto', 'sozinho', 'sozinha', 'grande', 'pequeno', 'pequena', 'novo',
  'nova', 'velho', 'velha', 'bom', 'boa', 'ruim', 'melhor', 'pior', 'primeiro', 'primeira',
  'ultimo', 'ultima', 'proximo', 'proxima', 'outro', 'outra', 'diferente', 'igual', 'facil', 'dificil',
  'importante', 'necessario', 'possivel', 'impossivel', 'certo', 'errado', 'verdade', 'mentira', 'coisa', 'lugar'
];

const generateWords = (count: number, language: string = 'en'): string[] => {
  const words: string[] = [];
  const wordList = language === 'pt-BR' ? commonWordsPortuguese : commonWordsEnglish;
  
  for (let i = 0; i < count; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words;
};

const TypingTest = forwardRef<{ reset: () => void }, TypingTestProps>(({ wordCount = 30, customText, timeLimit, zenMode = false, onComplete, onRestart, hideCompletionScreen = false, onCurrentCharChange, cheatMode = false }, ref) => {
  const { i18n, t } = useTranslation();
  const [words, setWords] = useState<string[]>(() => {
    // Initialize words on first render
    if (customText && typeof customText === 'string') {
      return customText.trim().split(/\s+/);
    } else if (timeLimit) {
      // For time mode, generate a large initial set of words
      return generateWords(200, i18n.language);
    }
    return generateWords(wordCount, i18n.language);
  });
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [completionHandled, setCompletionHandled] = useState(false);
  const [displayOffset, setDisplayOffset] = useState(0);
  const [zenText, setZenText] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to add more words when needed (for time mode)
  const addMoreWords = () => {
    if (timeLimit && !customText) {
      const additionalWords = generateWords(100, i18n.language);
      setWords(prevWords => [...prevWords, ...additionalWords]);
    }
  };

  const resetTest = () => {
    if (customText && typeof customText === 'string') {
      setWords(customText.trim().split(/\s+/));
    } else if (zenMode) {
      setWords([]);
      setZenText('');
    } else if (timeLimit) {
      // For time mode, generate a large initial set of words
      setWords(generateWords(200, i18n.language));
    } else {
      setWords(generateWords(wordCount, i18n.language));
    }
    setUserInput('');
    setCurrentIndex(0);
    setErrors(new Set());
    setTotalKeystrokes(0);
    setTotalErrors(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setCompletionHandled(false);
    setDisplayOffset(0);
    setTimeRemaining(timeLimit || null);
    setLastKeystrokeTime(null);
  };

  // Expose reset method via ref
  useImperativeHandle(ref, () => ({
    reset: resetTest
  }));

  // Time limit countdown
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && startTime && !isComplete) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, startTime, isComplete]);

  // Handle customText changes (including when it loads async)
  useEffect(() => {
    if (customText && typeof customText === 'string') {
      setWords(customText.trim().split(/\s+/));
      setUserInput('');
      setCurrentIndex(0);
      setErrors(new Set());
      setIsComplete(false);
      setCompletionHandled(false);
    }
  }, [customText]);
  
  useEffect(() => {
    resetTest();
  }, [wordCount, zenMode, timeLimit]);

  // Notify parent component of current character changes (not for zen mode, handled in key handler)
  useEffect(() => {
    if (zenMode) return; // Zen mode handles currentChar in keydown handler
    
    if (onCurrentCharChange && words.length > 0 && !isComplete) {
      const fullText = words.join(' ');
      const currentChar = fullText[currentIndex] || '';
      onCurrentCharChange(currentChar);
    } else if (onCurrentCharChange && isComplete) {
      // Clear current char when test is complete
      onCurrentCharChange('');
    }
  }, [currentIndex, words, onCurrentCharChange, isComplete, zenMode]);

  useEffect(() => {
    if (isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key - restart test for all modes, complete for zen mode
      if (e.key === 'Escape') {
        e.preventDefault();
        if (zenMode) {
          setIsComplete(true);
          // Clear current char when zen mode completes
          if (onCurrentCharChange) {
            onCurrentCharChange('');
          }
        } else {
          resetTest();
        }
        return;
      }

      // Prevent default for space to avoid page scroll
      if (e.key === ' ') {
        e.preventDefault();
      }

      // Start timer on first keypress
      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
      }

      // Handle zen mode - just track typing without specific text
      if (zenMode) {
        if (e.key.length === 1) {
          setTotalKeystrokes(prev => prev + 1);
          setZenText(prev => prev + e.key);
          setLastKeystrokeTime(Date.now());
          // Notify parent of the key that was just typed
          if (onCurrentCharChange) {
            onCurrentCharChange(e.key);
          }
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setZenText(prev => {
            const updated = prev.slice(0, -1);
            // Get the last character or clear if empty
            if (onCurrentCharChange) {
              onCurrentCharChange(updated.slice(-1) || '');
            }
            return updated;
          });
          setLastKeystrokeTime(Date.now());
        }
        return;
      }

      const fullText = words.join(' ');

      // Handle backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setUserInput(userInput.slice(0, -1));
          const newErrors = new Set(errors);
          newErrors.delete(currentIndex - 1);
          setErrors(newErrors);
        }
        return;
      }

      // Handle regular character input
      if (e.key.length === 1) {
        const expectedChar = fullText[currentIndex];
        const typedChar = e.key;

        // Track every keystroke
        setTotalKeystrokes(prev => prev + 1);

        setUserInput(userInput + typedChar);

        // In cheat mode, all keys are correct except backslash (unless expected is backslash)
        const isCheatModeCorrect = cheatMode && !(typedChar === '\\' && expectedChar !== '\\');
        if (!isCheatModeCorrect && typedChar !== expectedChar) {
          // Track every error, regardless of correction
          setTotalErrors(prev => prev + 1);
          setErrors(new Set([...errors, currentIndex]));
        }

        const newIndex = currentIndex + 1;
        
        if (newIndex === fullText.length) {
          // For time mode, add more words instead of completing
          if (timeLimit && !customText) {
            addMoreWords();
            setCurrentIndex(newIndex);
          } else {
            console.log('Test completed! Setting completion flag');
            setIsComplete(true);
          }
        } else {
          setCurrentIndex(newIndex);
          
          // Proactively add more words when we're getting close to the end (for time mode)
          if (timeLimit && !customText && newIndex > fullText.length - 50) {
            addMoreWords();
          }
          
          // Update display offset - show current row and next row
          const currentRow = getCurrentRow();
          if (currentRow > displayOffset) {
            setDisplayOffset(currentRow);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userInput, words, startTime, isComplete, errors, zenMode, zenText, onCurrentCharChange, cheatMode]);

  // Handle keyboard input when test is complete (escape to restart)
  useEffect(() => {
    if (!isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete]);

  // Handle test completion
  useEffect(() => {
    if (isComplete && !endTime && !completionHandled) {
      console.log('Test completed! Calling finishTest()');
      setCompletionHandled(true);
      // Use requestAnimationFrame to defer to the next frame
      requestAnimationFrame(() => {
        finishTest();
      });
    }
  }, [isComplete, endTime, completionHandled]);

  // Build rows of words that fit within a reasonable character limit
  const buildRows = () => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentRowLength = 0;
    const maxRowLength = 40; // Reduced characters per row for better fit

    words.forEach(word => {
      const wordWithSpace = word + ' ';
      if (currentRowLength + wordWithSpace.length > maxRowLength && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [word];
        currentRowLength = word.length + 1;
      } else {
        currentRow.push(word);
        currentRowLength += wordWithSpace.length;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const rows = buildRows();
  
  // Get character index for a specific row and word position
  const getCharIndex = (rowIndex: number, wordIndex: number, charOffset: number = 0): number => {
    let index = 0;
    for (let r = 0; r < rowIndex; r++) {
      index += rows[r].join(' ').length + 1; // +1 for space after row
    }
    for (let w = 0; w < wordIndex; w++) {
      index += rows[rowIndex][w].length + 1; // +1 for space
    }
    return index + charOffset;
  };

  // Find which row the current character index is in
  const getCurrentRow = (): number => {
    const fullText = words.join(' ');
    let charCount = 0;
    for (let r = 0; r < rows.length; r++) {
      const rowText = rows[r].join(' ');
      if (currentIndex < charCount + rowText.length + 1) {
        return r;
      }
      charCount += rowText.length + 1;
    }
    return rows.length - 1;
  };


  const finishTest = async () => {
    console.log('finishTest called');
    const end = Date.now();
    setEndTime(end);
    setIsComplete(true);

    if (startTime) {
      const timeSeconds = Math.floor((end - startTime) / 1000);
      const fullText = words.join(' ');
      const correctChars = fullText.length - errors.size;
      const totalChars = fullText.length;
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      const rawWpm = Math.round(((totalChars / 5) / timeSeconds) * 60);
      
      // Use the same accuracy calculation as during the test (counts all keystrokes including corrections)
      const accuracy = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100) : 100;

      console.log('Test stats:', { wpm, accuracy, timeSeconds, correctChars, totalChars, totalKeystrokes, totalErrors });

      // Call onComplete callback if provided
      if (onComplete) {
        console.log('Calling onComplete with:', { wpm, accuracy });
        // Defer the callback to prevent state updates during render
        setTimeout(() => {
          onComplete(wpm, accuracy);
        }, 0);
      } else {
        console.log('No onComplete callback provided');
      }

      if (user) {
        try {
          const { error } = await supabase.from('typing_sessions').insert({
            user_id: user.id,
            wpm,
            raw_wpm: rawWpm,
            accuracy,
            consistency: 0,
            time_seconds: timeSeconds,
            mode: customText ? 'lesson' : `words-${wordCount}`
          });

          if (error) throw error;

          toast({
            title: 'Progress Saved!',
            description: 'Your typing session has been recorded.',
          });
        } catch (error) {
          console.error('Error saving session:', error);
        }
      }
    }
  };

  const calculateStats = () => {
    if (!startTime || !endTime) return null;

    const timeSeconds = (endTime - startTime) / 1000;
    if (timeSeconds === 0) return null;
    
    if (zenMode) {
      // For zen mode, use zenText length and last keystroke time
      const correctChars = zenText.length;
      const totalChars = zenText.length;
      
      // Use lastKeystrokeTime if available, otherwise use endTime
      const actualEndTime = lastKeystrokeTime || endTime;
      const timeSeconds = (actualEndTime - startTime) / 1000;
      
      if (timeSeconds <= 0) return null;
      
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      const rawWpm = Math.round(((totalChars / 5) / timeSeconds) * 60);
      
      // Calculate accuracy based on total keystrokes vs total errors
      const accuracy = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100) : 100;

      return { 
        wpm: isNaN(wpm) ? 0 : wpm, 
        rawWpm: isNaN(rawWpm) ? 0 : rawWpm, 
        accuracy: isNaN(accuracy) ? 0 : accuracy, 
        timeSeconds: Math.round(timeSeconds) 
      };
    } else {
      // For other modes, use words array
      const fullText = words.join(' ');
      const correctChars = fullText.length - errors.size;
      const totalChars = fullText.length;
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      const rawWpm = Math.round(((totalChars / 5) / timeSeconds) * 60);
      
      // Calculate accuracy based on total keystrokes vs total errors
      const accuracy = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100) : 100;

      return { 
        wpm: isNaN(wpm) ? 0 : wpm, 
        rawWpm: isNaN(rawWpm) ? 0 : rawWpm, 
        accuracy: isNaN(accuracy) ? 0 : accuracy, 
        timeSeconds: Math.round(timeSeconds) 
      };
    }
  };

  const getCurrentWPM = () => {
    if (!startTime) return 0;
    const timeSeconds = (Date.now() - startTime) / 1000;
    if (timeSeconds <= 0) return 0;
    
    if (zenMode) {
      // For zen mode, use zenText length and last keystroke time
      const correctChars = Math.max(0, zenText.length);
      
      // Use lastKeystrokeTime if available, otherwise use current time
      const actualEndTime = lastKeystrokeTime || Date.now();
      const timeSeconds = (actualEndTime - startTime) / 1000;
      
      if (timeSeconds <= 0) return 0;
      
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      return isNaN(wpm) ? 0 : wpm;
    } else {
      // For other modes, use currentIndex
      if (currentIndex === 0) return 0;
      const correctChars = Math.max(0, currentIndex - errors.size);
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      return isNaN(wpm) ? 0 : wpm;
    }
  };

  const getCurrentAccuracy = () => {
    if (totalKeystrokes === 0) return 100;
    if (totalKeystrokes < totalErrors) return 0; // Prevent negative accuracy
    const accuracy = Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100);
    return isNaN(accuracy) ? 0 : accuracy;
  };

  const stats = calculateStats();

  // If completion screen is hidden, automatically call onComplete and reset
  if (isComplete && stats && hideCompletionScreen) {
    // Call onComplete callback if provided
    if (onComplete) {
      // Defer the callback to prevent state updates during render
      setTimeout(() => {
        onComplete(stats.wpm, stats.accuracy);
      }, 0);
    }
    // Reset the test
    resetTest();
    return null; // Don't render anything while resetting
  }

  if (isComplete && stats && !hideCompletionScreen) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center space-y-8">
          {/* Celebration Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-20 h-20 text-primary animate-float" />
            </div>
            <h2 className="text-5xl font-bold text-primary">{t('testResults.title')}</h2>
            <p className="text-lg text-muted-foreground">{t('testResults.subtitle')}</p>
          </div>
          
          {/* Results Card */}
          <Card className="p-8 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md border-border/30 shadow-lg">
            <div className="grid grid-cols-2 gap-8">
              {/* Primary Stats */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-6xl font-bold text-primary">{stats.wpm}</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('testResults.metrics.wordsPerMinute')}</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold text-foreground">{stats.rawWpm}</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('testResults.metrics.rawWpm')}</p>
                </div>
              </div>
              
              {/* Secondary Stats */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-6xl font-bold text-accent">{stats.accuracy}%</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('testResults.metrics.accuracy')}</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold text-foreground">{stats.timeSeconds}s</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('testResults.metrics.time')}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetTest}
                variant="ocean"
                size="lg"
                className="gap-2 px-8 py-3 text-lg font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                {t('testResults.actions.tryAgain')}
              </Button>

              {onComplete && (
                <Button
                  onClick={() => onComplete(stats.wpm, stats.accuracy)}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold"
                >
                  {t('testResults.actions.continue')}
                </Button>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('testResults.actions.escapeHint')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      {/* Stats Bar - only show during active test, not on completion */}
      {!isComplete && (
        <div className="flex justify-center gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">{getCurrentWPM()}</p>
            <p className="text-sm text-muted-foreground">{t('testResults.metrics.wordsPerMinute')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-accent">{getCurrentAccuracy()}%</p>
            <p className="text-sm text-muted-foreground">{t('testResults.metrics.accuracy')}</p>
          </div>
          {timeRemaining !== null && (
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{timeRemaining}</p>
              <p className="text-sm text-muted-foreground">{t('testResults.metrics.seconds')}</p>
            </div>
          )}
        </div>
      )}

      {/* Words Display */}
      <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 w-full h-[16rem] flex flex-col justify-center relative">
        {/* Progress Indicator */}
        <div className="absolute top-4 right-4 text-xs text-muted-foreground">
          {zenMode ? (
            `${zenText.split(/\s+/).filter(word => word.length > 0).length} words`
          ) : timeRemaining !== null ? (
            `${Math.max(0, (timeLimit || 0) - (timeRemaining || 0))}/${timeLimit}s`
          ) : (
            `${userInput.split(/\s+/).filter(word => word.length > 0).length}/${words.length}`
          )}
        </div>
        
        <div ref={containerRef} tabIndex={0} className="text-center focus:outline-none w-full flex-1 flex flex-col justify-center">
          {zenMode ? (
            <div className="text-3xl leading-[3rem] font-mono select-none w-full overflow-hidden text-foreground/40">
              {zenText}
            </div>
          ) : (
            <div className="text-3xl leading-[3rem] font-mono select-none w-full overflow-hidden">
            {rows.slice(displayOffset, displayOffset + 2).map((row, rowIndex) => {
              const actualRowIndex = displayOffset + rowIndex;
              let charIndex = 0;
              
              // Calculate starting character index for this row
              for (let r = 0; r < actualRowIndex; r++) {
                charIndex += rows[r].join(' ').length + 1;
              }

              return (
                <div key={actualRowIndex} className="break-words hyphens-auto">
                  {row.map((word, wordIndex) => {
                    const wordChars = word.split('');
                    const wordStartIndex = charIndex;
                    
                    const wordElement = wordChars.map((char, charOffset) => {
                      const index = charIndex + charOffset;
                      let className = '';
                      
                      if (index < currentIndex) {
                        // Already typed
                        if (errors.has(index)) {
                          className += 'text-destructive font-bold';
                        } else {
                          className += 'text-primary font-semibold';
                        }
                      } else if (index === currentIndex) {
                        // Current character
                        className += 'text-foreground border-b-2 border-primary';
                      } else {
                        // Not yet typed
                        className += 'text-foreground/40';
                      }

                      return (
                        <span key={charOffset} className={className}>
                          {char}
                        </span>
                      );
                    });

                    charIndex += word.length;

                    // Handle space after word
                    const spaceIndex = charIndex;
                    let spaceClassName = '';
                    const isLastWordInRow = wordIndex === row.length - 1;
                    
                    if (!isLastWordInRow) {
                      if (spaceIndex < currentIndex) {
                        if (errors.has(spaceIndex)) {
                          spaceClassName += 'text-destructive font-bold';
                        } else {
                          spaceClassName += 'text-primary font-semibold';
                        }
                      } else if (spaceIndex === currentIndex) {
                        spaceClassName += 'text-foreground border-b-2 border-primary';
                      } else {
                        spaceClassName += 'text-foreground/40';
                      }

                      charIndex += 1; // Move past the space
                    }

                    return (
                      <span key={wordIndex}>
                        {wordElement}
                        {!isLastWordInRow && (
                          <span className={spaceClassName}>
                            {spaceIndex === currentIndex || (spaceIndex < currentIndex && errors.has(spaceIndex)) ? '·' : ' '}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            })}
            </div>
          )}

          <div className="text-center text-muted-foreground text-sm h-[1.5rem] flex items-center justify-center mt-4">
            {!startTime && (zenMode ? t('learn.testScreen.zenMode') : t('learn.testScreen.startTyping'))}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={resetTest}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('learn.testScreen.restart')}
            </Button>
          </div>
        </div>
      </Card>

      {!user && (
        <p className="text-center text-sm text-muted-foreground">
          {t('learn.testScreen.signInPrompt')}
        </p>
      )}
    </div>
  );
});

export default TypingTest;