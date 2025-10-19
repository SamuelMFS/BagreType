import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TypingTestProps {
  wordCount?: number;
  customText?: string;
  onComplete?: (wpm: number, accuracy: number) => void;
  onRestart?: () => void;
}

const commonWords = [
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

const generateWords = (count: number): string[] => {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words;
};

const TypingTest = forwardRef<{ reset: () => void }, TypingTestProps>(({ wordCount = 30, customText, onComplete, onRestart }, ref) => {
  const [words, setWords] = useState<string[]>(() => {
    // Initialize words on first render
    if (customText) {
      return customText.trim().split(/\s+/);
    }
    return generateWords(wordCount);
  });
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [displayOffset, setDisplayOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetTest = () => {
    if (customText) {
      setWords(customText.trim().split(/\s+/));
    } else {
      setWords(generateWords(wordCount));
    }
    setUserInput('');
    setCurrentIndex(0);
    setErrors(new Set());
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setDisplayOffset(0);
  };

  // Expose reset method via ref
  useImperativeHandle(ref, () => ({
    reset: resetTest
  }));

  useEffect(() => {
    resetTest();
  }, [wordCount, customText]);

  useEffect(() => {
    if (isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for space to avoid page scroll
      if (e.key === ' ') {
        e.preventDefault();
      }

      // Start timer on first keypress
      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
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

        setUserInput(userInput + typedChar);

        if (typedChar !== expectedChar) {
          setErrors(new Set([...errors, currentIndex]));
        }

        const newIndex = currentIndex + 1;
        
        if (newIndex === fullText.length) {
          finishTest();
        } else {
          setCurrentIndex(newIndex);
          
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
  }, [currentIndex, userInput, words, startTime, isComplete, errors]);


  // Build rows of words that fit within a reasonable character limit
  const buildRows = () => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentRowLength = 0;
    const maxRowLength = 50; // Characters per row

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
      const accuracy = Math.round((correctChars / totalChars) * 100);

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(wpm, accuracy);
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
    const fullText = words.join(' ');
    const correctChars = fullText.length - errors.size;
    const totalChars = fullText.length;
    const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
    const rawWpm = Math.round(((totalChars / 5) / timeSeconds) * 60);
    const accuracy = Math.round((correctChars / totalChars) * 100);

    return { wpm, rawWpm, accuracy, timeSeconds: Math.round(timeSeconds) };
  };

  const getCurrentWPM = () => {
    if (!startTime || currentIndex === 0) return 0;
    const timeSeconds = (Date.now() - startTime) / 1000;
    const correctChars = currentIndex - errors.size;
    return Math.round(((correctChars / 5) / timeSeconds) * 60);
  };

  const getCurrentAccuracy = () => {
    if (currentIndex === 0) return 100;
    const correctChars = currentIndex - errors.size;
    return Math.round((correctChars / currentIndex) * 100);
  };

  const stats = calculateStats();

  if (isComplete && stats) {
    return (
      <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-primary animate-float" />
          </div>
          
          <h2 className="text-4xl font-bold text-primary">Test Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="space-y-2">
              <p className="text-5xl font-bold text-primary">{stats.wpm}</p>
              <p className="text-sm text-muted-foreground">WPM</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-accent">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground">{stats.rawWpm}</p>
              <p className="text-sm text-muted-foreground">Raw WPM</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground">{stats.timeSeconds}s</p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>

          <Button
            onClick={resetTest}
            variant="ocean"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>

          {onComplete && (
            <Button
              onClick={() => onComplete(stats.wpm, stats.accuracy)}
              variant="outline"
              size="lg"
            >
              Continue
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="flex justify-center gap-8 text-center">
        <div className="space-y-1">
          <p className="text-3xl font-bold text-primary">{getCurrentWPM()}</p>
          <p className="text-sm text-muted-foreground">WPM</p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-accent">{getCurrentAccuracy()}%</p>
          <p className="text-sm text-muted-foreground">Accuracy</p>
        </div>
      </div>

      {/* Words Display */}
      <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
        <div ref={containerRef} tabIndex={0} className="text-center space-y-6 focus:outline-none">
          <div className="text-3xl leading-[3rem] font-mono select-none overflow-hidden h-[6rem]">
            {rows.slice(displayOffset, displayOffset + 2).map((row, rowIndex) => {
              const actualRowIndex = displayOffset + rowIndex;
              let charIndex = 0;
              
              // Calculate starting character index for this row
              for (let r = 0; r < actualRowIndex; r++) {
                charIndex += rows[r].join(' ').length + 1;
              }

              return (
                <div key={actualRowIndex} className="whitespace-nowrap">
                  {row.map((word, wordIndex) => {
                    const wordChars = word.split('');
                    const wordStartIndex = charIndex;
                    
                    const wordElement = wordChars.map((char, charOffset) => {
                      const index = charIndex + charOffset;
                      let className = 'transition-wave ';
                      
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
                    let spaceClassName = 'transition-wave ';
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

          <div className="text-center text-muted-foreground text-sm">
            {!startTime && "Start typing to begin..."}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={resetTest}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>
          </div>
        </div>
      </Card>

      {!user && (
        <p className="text-center text-sm text-muted-foreground">
          Sign in to save your progress and track your improvement over time
        </p>
      )}
    </div>
  );
});

export default TypingTest;