import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import TypingTest from "@/components/TypingTest";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { LessonGenerator, getLessonConfig } from "@/lib/lessonGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type PracticeRound = "lesson" | "chapter" | "all" | "complete";

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId, chapterId } = useParams();
  const { user } = useAuth();
  const [currentRound, setCurrentRound] = useState<PracticeRound>("lesson");
  
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
        const { data, error } = await supabase
          .from('lesson_progress')
          .insert(progressData)
          .select();
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Supabase save result:', data);
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
    switch (currentRound) {
      case "lesson":
        return `Part 1: ${lessonData.key} Key Only`;
      case "chapter":
        return `Part 2: ${lessonData.key} + ${lessonData.chapterName}`;
      case "all":
        return `Part 3: ${lessonData.key} + All Learned Keys`;
      case "complete":
        return "Lesson Complete!";
    }
  };

  const getRoundWords = () => {
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
  };

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
                  Average WPM: {Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)}
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

            <div className="text-center pt-4">
              <Button
                size="lg"
                variant="ocean"
                onClick={() => navigate("/lessons")}
                className="gap-2"
              >
                <ArrowLeft size={20} />
                Back to Roadmap
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
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              {getRoundTitle()}
            </h1>
            <p className="text-lg text-muted-foreground">
              Part {results.length + 1} of 3 • 30 letters each
            </p>
            <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {currentRound === "lesson" && `Focus on the ${lessonData.key} key with spaces for rhythm`}
              {currentRound === "chapter" && `Practice ${lessonData.key} with other ${lessonData.chapterName.toLowerCase()} letters`}
              {currentRound === "all" && `Combine ${lessonData.key} with all previously learned letters`}
            </div>
          </div>

          {/* GIF Placeholder */}
          <Card className="p-8 bg-card/50 backdrop-blur">
            <div className="aspect-video w-full max-w-md mx-auto rounded-lg bg-muted/30 border border-primary/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-6xl">🎬</div>
                <p className="text-muted-foreground">
                  Hand position GIF placeholder
                </p>
                <p className="text-sm text-primary font-semibold">
                  Demonstrating: {lessonData.key} key
                </p>
              </div>
            </div>
          </Card>

          {/* Practice Area */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Focus on accuracy over speed
              </p>
            </div>
            
            <TypingTest 
              customText={getRoundWords()}
              onComplete={(wpm, accuracy) => handleRoundComplete(wpm, accuracy)}
            />
          </div>

          {/* Back button */}
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/lessons")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to Roadmap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
