import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import TypingTest from "@/components/TypingTest";
import SegmentedProgressBar from "@/components/SegmentedProgressBar";
import { KeyboardImage } from "@/components/KeyboardImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { LessonGenerator, getLessonConfig } from "@/lib/lessonGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type PracticeRound = "lesson" | "chapter" | "all" | "complete";

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId, chapterId } = useParams();
  const { user } = useAuth();
  const [currentRound, setCurrentRound] = useState<PracticeRound>("lesson");
  const typingTestRef = useRef<{ reset: () => void }>(null);
  
  // Debug current round changes
  useEffect(() => {
    console.log('Current round changed to:', currentRound);
  }, [currentRound]);
  const [results, setResults] = useState<Array<{
    round: string;
    wpm: number;
    accuracy: number;
  }>>([]);
  const [lessonGenerator, setLessonGenerator] = useState<LessonGenerator | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentChar, setCurrentChar] = useState<string>("");

  // Get lesson configuration
  const lessonConfig = getLessonConfig(lessonId || "f", chapterId || "1");
  
  const lessonData = {
    key: lessonId?.toUpperCase() || "F",
    chapter: chapterId || "1",
    chapterName: getChapterName(chapterId || "1"),
    gif: "/placeholder.svg", // Placeholder
  };

  // Initialize lesson generator and session ID
  useEffect(() => {
    const generator = new LessonGenerator(lessonConfig);
    setLessonGenerator(generator);
    
    // Generate session ID for anonymous users
    if (!user) {
      let storedSessionId = localStorage.getItem('session_id');
      if (!storedSessionId) {
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('session_id', storedSessionId);
      }
      setSessionId(storedSessionId);
    }
  }, [lessonId, chapterId, user]);

  function getChapterName(chapterId: string): string {
    const chapterNames: Record<string, string> = {
      '1': 'Index Fingers',
      '2': 'Middle Fingers', 
      '3': 'Ring Fingers',
      '4': 'Pinky Fingers',
      '5': 'Numbers & Symbols'
    };
    return chapterNames[chapterId] || 'Unknown Chapter';
  }

  function getLessonNumber(chapterId: string, lessonId: string): number {
    // Define the lesson order across all chapters
    const lessonOrder = [
      // Chapter 1: Index Fingers
      { chapterId: '1', lessonId: 'f' },
      { chapterId: '1', lessonId: 'j' },
      { chapterId: '1', lessonId: 'r' },
      { chapterId: '1', lessonId: 'u' },
      { chapterId: '1', lessonId: 'n' },
      { chapterId: '1', lessonId: 'v' },
      { chapterId: '1', lessonId: 't' },
      { chapterId: '1', lessonId: 'y' },
      { chapterId: '1', lessonId: 'g' },
      { chapterId: '1', lessonId: 'h' },
      { chapterId: '1', lessonId: 'b' },
      { chapterId: '1', lessonId: 'm' },
      // Chapter 2: Middle Fingers
      { chapterId: '2', lessonId: 'd' },
      { chapterId: '2', lessonId: 'k' },
      { chapterId: '2', lessonId: 'e' },
      { chapterId: '2', lessonId: 'i' },
      { chapterId: '2', lessonId: 'c' },
      { chapterId: '2', lessonId: 'comma' },
      // Chapter 3: Ring Fingers
      { chapterId: '3', lessonId: 's' },
      { chapterId: '3', lessonId: 'l' },
      { chapterId: '3', lessonId: 'w' },
      { chapterId: '3', lessonId: 'o' },
      { chapterId: '3', lessonId: 'x' },
      { chapterId: '3', lessonId: 'period' },
      // Chapter 4: Pinky Fingers
      { chapterId: '4', lessonId: 'a' },
      { chapterId: '4', lessonId: 'semicolon' },
      { chapterId: '4', lessonId: 'q' },
      { chapterId: '4', lessonId: 'p' },
      { chapterId: '4', lessonId: 'z' },
      { chapterId: '4', lessonId: 'slash' },
      // Chapter 5: Numbers & Symbols
      { chapterId: '5', lessonId: '1' },
      { chapterId: '5', lessonId: '2' },
      { chapterId: '5', lessonId: '3' },
      { chapterId: '5', lessonId: '4' },
      { chapterId: '5', lessonId: '5' },
      { chapterId: '5', lessonId: '6' },
      { chapterId: '5', lessonId: '7' },
      { chapterId: '5', lessonId: '8' },
      { chapterId: '5', lessonId: '9' },
      { chapterId: '5', lessonId: '0' },
      { chapterId: '5', lessonId: 'minus' },
      { chapterId: '5', lessonId: 'equals' },
      { chapterId: '5', lessonId: 'bracket-left' },
      { chapterId: '5', lessonId: 'bracket-right' },
      { chapterId: '5', lessonId: 'backslash' },
      { chapterId: '5', lessonId: 'semicolon' },
      { chapterId: '5', lessonId: 'quote' },
      { chapterId: '5', lessonId: 'asterisk' },
      { chapterId: '5', lessonId: 'dollar' },
      { chapterId: '5', lessonId: 'ampersand' },
      { chapterId: '5', lessonId: 'percent' },
      { chapterId: '5', lessonId: 'caret' },
    ];

    const index = lessonOrder.findIndex(lesson => 
      lesson.chapterId === chapterId && lesson.lessonId === lessonId
    );
    
    return index + 1; // Return 1-based lesson number
  }

  // Save lesson progress
  const saveLessonProgress = async (resultsToSave?: Array<{ round: string; wpm: number; accuracy: number; }>) => {
    const resultsData = resultsToSave || results;
    console.log('saveLessonProgress called, results length:', resultsData.length);
    if (resultsData.length < 3) {
      console.log('Not saving - need all 3 parts completed');
      return; // Only save if all 3 parts completed
    }
    
    setIsSaving(true);
    try {
      const part1Result = resultsData.find(r => r.round.includes('Part 1'));
      const part2Result = resultsData.find(r => r.round.includes('Part 2'));
      const part3Result = resultsData.find(r => r.round.includes('Part 3'));
      
      console.log('Found results:', { part1Result, part2Result, part3Result });
      
      const averageWpm = Math.round(resultsData.reduce((sum, r) => sum + r.wpm, 0) / resultsData.length);
      const averageAccuracy = Math.round(resultsData.reduce((sum, r) => sum + r.accuracy, 0) / resultsData.length);
      
      const progressData = {
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        chapter_id: parseInt(chapterId || "1"),
        lesson_id: lessonId || "f",
        part1_wpm: part1Result?.wpm || null,
        part1_accuracy: part1Result?.accuracy || null,
        part2_wpm: part2Result?.wpm || null,
        part2_accuracy: part2Result?.accuracy || null,
        part3_wpm: part3Result?.wpm || null,
        part3_accuracy: part3Result?.accuracy || null,
        average_wpm: averageWpm,
        average_accuracy: averageAccuracy,
      };
      
      console.log('Progress data to save:', progressData);
      console.log('User:', user);
      console.log('Session ID:', sessionId);
      
      if (user) {
        // Save to Supabase for logged-in users
        console.log('Saving to Supabase:', progressData);
        
        // First check if a record already exists
        const { data: existingData, error: checkError } = await supabase
          .from('lesson_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('chapter_id', progressData.chapter_id)
          .eq('lesson_id', progressData.lesson_id)
          .single();
        
        let result;
        if (existingData && !checkError) {
          // Update existing record
          console.log('Updating existing record:', existingData.id);
          result = await supabase
            .from('lesson_progress')
            .update(progressData)
            .eq('id', existingData.id)
            .select();
        } else {
          // Insert new record
          console.log('Inserting new record');
          result = await supabase
            .from('lesson_progress')
            .insert(progressData)
            .select();
        }
        
        if (result.error) {
          console.error('Supabase error:', result.error);
          throw result.error;
        }
        console.log('Supabase save result:', result.data);
      } else {
        // Save to localStorage for anonymous users
        console.log('Saving to localStorage:', progressData);
        const existingProgress = JSON.parse(localStorage.getItem('lesson_progress') || '[]');
        existingProgress.push(progressData);
        localStorage.setItem('lesson_progress', JSON.stringify(existingProgress));
        console.log('localStorage save complete');
      }
      
      console.log('Lesson progress saved successfully');
    } catch (error) {
      console.error('Error saving lesson progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoundTitle = () => {
    const lessonNumber = getLessonNumber(chapterId || "1", lessonId || "f");
    const lessonTitle = `Lesson ${lessonNumber}: Key ${lessonData.key}`;
    
    switch (currentRound) {
      case "lesson":
        return `${lessonTitle}`;
      case "chapter":
        return `${lessonTitle}`;
      case "all":
        return `${lessonTitle}`;
      case "complete":
        return "Lesson Complete!";
    }
  };

  const getRoundWords = useMemo(() => {
    if (!lessonGenerator) return "";
    
    switch (currentRound) {
      case "lesson":
        return lessonGenerator.generatePart1();
      case "chapter":
        return lessonGenerator.generatePart2();
      case "all":
        return lessonGenerator.generatePart3();
      default:
        return "";
    }
  }, [lessonGenerator, currentRound]);

  const handleRoundComplete = (wpm: number, accuracy: number) => {
    console.log('handleRoundComplete called:', { currentRound, wpm, accuracy });
    
    const roundName = currentRound === "lesson" 
      ? `Part 1: ${lessonData.key} Only` 
      : currentRound === "chapter" 
      ? `Part 2: ${lessonData.key} + Chapter` 
      : `Part 3: ${lessonData.key} + All`;

    const newResults = [...results, { round: roundName, wpm, accuracy }];
    setResults(newResults);
    
    console.log('Updated results:', newResults);

    // Move to next round
    if (currentRound === "lesson") {
      console.log('Moving from lesson to chapter');
      setCurrentRound("chapter");
    } else if (currentRound === "chapter") {
      console.log('Moving from chapter to all');
      setCurrentRound("all");
    } else if (currentRound === "all") {
      console.log('Moving from all to complete - saving progress');
      setCurrentRound("complete");
      // Save progress when all parts are completed - pass the new results directly
      saveLessonProgress(newResults);
    }
  };

  // Show loading state if lesson generator isn't ready
  if (!lessonGenerator) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-primary">
                Loading Lesson...
              </h1>
              <p className="text-lg text-muted-foreground">
                Preparing your {lessonData.key} key practice
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentRound === "complete") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-primary animate-glow">
                Lesson Complete! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                You've mastered the {lessonData.key} key
              </p>
            </div>

            <Card className="p-8 space-y-6 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-semibold text-center text-accent">
                Your Performance
              </h2>

              <div className="space-y-4">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-lg bg-muted/30 border border-primary/20"
                  >
                    <span className="font-medium text-foreground">
                      {result.round}
                    </span>
                    <div className="flex gap-6 text-sm">
                      <span className="text-primary font-semibold">
                        {result.wpm} WPM
                      </span>
                      <span className="text-accent font-semibold">
                        {result.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <p className="text-lg font-semibold text-foreground mb-2">
                  Average WPM: {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length) : 0}
                </p>
                <p className="text-muted-foreground">
                  Keep practicing to improve your speed!
                </p>
                {isSaving && (
                  <p className="text-sm text-primary mt-2">
                    Saving your progress...
                  </p>
                )}
              </div>
            </Card>

            <div className="text-center pt-4 space-y-4">
              
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
                
                {/* Show Compare Progress button only for final test (test5) */}
                {lessonId?.toLowerCase() === "test5" && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/compare-progress")}
                    className="gap-2"
                  >
                    <BarChart3 size={20} />
                     Continue
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="flex-1 container mx-auto px-4 pt-24 pb-12 max-w-4xl flex flex-col">
        <div className="animate-fade-in space-y-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/lessons")}
                className="text-muted-foreground hover:text-foreground"
                size="sm"
              >
                <ArrowLeft size={100} />
              </Button>
              <h1 className="text-4xl font-bold text-primary">
                {getRoundTitle()}
              </h1>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <SegmentedProgressBar 
                currentStep={results.length + 1} 
                totalSteps={3}
              />
              <p className="text-sm text-muted-foreground">
                Part {results.length + 1} of 3 • 30 letters each
              </p>
            </div>
          </div>

          {/* Practice Area */}
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Focus on accuracy over speed
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <TypingTest 
                ref={typingTestRef}
                customText={getRoundWords}
                onComplete={(wpm, accuracy) => handleRoundComplete(wpm, accuracy)}
                hideCompletionScreen={true}
                onCurrentCharChange={setCurrentChar}
              />
            </div>
          </div>

          {/* Keyboard Image */}
          <div className="aspect-video w-full max-w-md mx-auto flex items-center justify-center">
            <KeyboardImage 
              lessonKey={lessonData.key}
              currentChar={currentChar}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
