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

type PracticeRound = "lesson" | "chapter" | "all" | "complete";

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId, chapterId } = useParams();
  const [currentRound, setCurrentRound] = useState<PracticeRound>("lesson");
  const [results, setResults] = useState<Array<{
    round: string;
    wpm: number;
    accuracy: number;
  }>>([]);

  // Mock data - will be replaced with actual lesson data
  const lessonData = {
    key: lessonId?.toUpperCase() || "F",
    chapter: chapterId || "1",
    chapterName: "Index Finger",
    gif: "/placeholder.svg", // Placeholder
  };

  const getRoundTitle = () => {
    switch (currentRound) {
      case "lesson":
        return `Practice: ${lessonData.key} Key`;
      case "chapter":
        return `Practice: ${lessonData.chapterName} Keys`;
      case "all":
        return "Practice: All Learned Keys";
      case "complete":
        return "Lesson Complete!";
    }
  };

  const getRoundWords = () => {
    // Mock word generation - will be replaced with actual logic
    switch (currentRound) {
      case "lesson":
        return `${lessonData.key} ${lessonData.key.toLowerCase()} f${lessonData.key} ${lessonData.key}f ff ${lessonData.key}${lessonData.key}`;
      case "chapter":
        return "fj fr ju jf ff jj rf uf";
      case "all":
        return "the quick brown fox jumps over lazy dog";
      default:
        return "";
    }
  };

  const handleRoundComplete = (wpm: number, accuracy: number) => {
    const roundName = currentRound === "lesson" 
      ? "Lesson Keys" 
      : currentRound === "chapter" 
      ? "Chapter Keys" 
      : "All Keys";

    setResults([...results, { round: roundName, wpm, accuracy }]);

    // Move to next round
    if (currentRound === "lesson") {
      setCurrentRound("chapter");
    } else if (currentRound === "chapter") {
      setCurrentRound("all");
    } else if (currentRound === "all") {
      setCurrentRound("complete");
    }
  };

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
              Round {results.length + 1} of 3
            </p>
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
