import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TypingTestProps {
  wordCount?: number;
  onComplete?: () => void;
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

const TypingTest = ({ wordCount = 30, onComplete }: TypingTestProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    resetTest();
  }, [wordCount]);

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

        if (currentIndex === fullText.length - 1) {
          finishTest();
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userInput, words, startTime, isComplete, errors]);

  const resetTest = () => {
    setWords(generateWords(wordCount));
    setUserInput('');
    setCurrentIndex(0);
    setErrors(new Set());
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
  };


  const finishTest = async () => {
    const end = Date.now();
    setEndTime(end);
    setIsComplete(true);

    if (user && startTime) {
      const timeSeconds = Math.floor((end - startTime) / 1000);
      const fullText = words.join(' ');
      const correctChars = fullText.length - errors.size;
      const totalChars = fullText.length;
      const wpm = Math.round(((correctChars / 5) / timeSeconds) * 60);
      const rawWpm = Math.round(((totalChars / 5) / timeSeconds) * 60);
      const accuracy = Math.round((correctChars / totalChars) * 100);

      try {
        const { error } = await supabase.from('typing_sessions').insert({
          user_id: user.id,
          wpm,
          raw_wpm: rawWpm,
          accuracy,
          consistency: 0,
          time_seconds: timeSeconds,
          mode: `words-${wordCount}`
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
              onClick={onComplete}
              variant="outline"
              size="lg"
            >
              Continue to Lessons
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
          <div className="text-3xl leading-relaxed font-mono select-none">
            {words.join(' ').split('').map((char, index) => {
              let className = 'transition-wave ';
              const isSpace = char === ' ';
              
              if (index < currentIndex) {
                // Already typed
                if (errors.has(index)) {
                  className += 'text-destructive font-bold';
                } else {
                  className += 'text-primary font-semibold';
                }
              } else if (index === currentIndex) {
                // Current character - show underscore
                className += 'text-foreground border-b-2 border-primary';
              } else {
                // Not yet typed
                className += 'text-foreground/40';
              }

              // Show space character as a visible dot when it's current or has error
              const displayChar = isSpace && (index === currentIndex || (index < currentIndex && errors.has(index)))
                ? '·'
                : char;

              return (
                <span key={index} className={className}>
                  {displayChar}
                </span>
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
};

export default TypingTest;