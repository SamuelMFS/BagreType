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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [incorrectWords, setIncorrectWords] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    resetTest();
  }, [wordCount]);

  useEffect(() => {
    if (inputRef.current && !isComplete) {
      inputRef.current.focus();
    }
  }, [isComplete]);

  const resetTest = () => {
    setWords(generateWords(wordCount));
    setCurrentWordIndex(0);
    setCurrentInput('');
    setCompletedWords([]);
    setIncorrectWords(new Set());
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];
      
      setCompletedWords([...completedWords, typedWord]);
      
      if (typedWord !== currentWord) {
        setIncorrectWords(new Set([...incorrectWords, currentWordIndex]));
      }
      
      if (currentWordIndex === words.length - 1) {
        finishTest();
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentInput('');
      }
    } else {
      setCurrentInput(value);
    }
  };

  const finishTest = async () => {
    const end = Date.now();
    setEndTime(end);
    setIsComplete(true);

    if (user && startTime) {
      const timeSeconds = Math.floor((end - startTime) / 1000);
      const correctWords = completedWords.filter((_, i) => !incorrectWords.has(i)).length + 
                          (currentInput === words[currentWordIndex] ? 1 : 0);
      const totalWords = words.length;
      const wpm = Math.round((correctWords / timeSeconds) * 60);
      const rawWpm = Math.round((totalWords / timeSeconds) * 60);
      const accuracy = Math.round((correctWords / totalWords) * 100);

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
    const correctWords = completedWords.filter((_, i) => !incorrectWords.has(i)).length;
    const totalWords = words.length;
    const wpm = Math.round((correctWords / timeSeconds) * 60);
    const rawWpm = Math.round((totalWords / timeSeconds) * 60);
    const accuracy = Math.round((correctWords / totalWords) * 100);

    return { wpm, rawWpm, accuracy, timeSeconds: Math.round(timeSeconds) };
  };

  const getCurrentWPM = () => {
    if (!startTime) return 0;
    const timeSeconds = (Date.now() - startTime) / 1000;
    const correctWords = completedWords.filter((_, i) => !incorrectWords.has(i)).length;
    return Math.round((correctWords / timeSeconds) * 60);
  };

  const getCurrentAccuracy = () => {
    if (completedWords.length === 0) return 100;
    const correctWords = completedWords.filter((_, i) => !incorrectWords.has(i)).length;
    return Math.round((correctWords / completedWords.length) * 100);
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
        <div className="text-center space-y-6">
          <div className="text-2xl leading-relaxed font-mono">
            {words.map((word, index) => {
              let className = 'inline-block mx-1 transition-wave ';
              
              if (index < currentWordIndex) {
                className += incorrectWords.has(index)
                  ? 'text-destructive line-through'
                  : 'text-muted-foreground';
              } else if (index === currentWordIndex) {
                className += 'text-primary font-bold border-b-2 border-primary';
              } else {
                className += 'text-foreground';
              }

              return (
                <span key={index} className={className}>
                  {word}
                </span>
              );
            })}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            className="w-full max-w-md mx-auto px-6 py-4 text-2xl text-center bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-wave font-mono"
            placeholder={startTime ? "Type here..." : "Start typing to begin..."}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />

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