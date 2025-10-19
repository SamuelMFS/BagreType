import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import TypingTest from "@/components/TypingTest";

const Learn = () => {
  const [showTest, setShowTest] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const navigate = useNavigate();

  if (showResults && testResults) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
          <div className="animate-fade-in space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-4">
                Baseline Test Results
              </h1>
              <p className="text-xl text-muted-foreground">
                Here's how you did!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center space-y-2">
                <p className="text-6xl font-bold text-primary">{testResults.wpm}</p>
                <p className="text-lg text-muted-foreground">Words Per Minute</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 text-center space-y-2">
                <p className="text-6xl font-bold text-accent">{testResults.accuracy}%</p>
                <p className="text-lg text-muted-foreground">Accuracy</p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-lg text-foreground/90">
                Great job! Now let's begin your personalized learning journey.
              </p>
              <Button 
                size="lg"
                variant="ocean"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/lessons")}
              >
                Continue to Lessons
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showTest) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-primary">
                Baseline Test
              </h1>
              <p className="text-lg text-muted-foreground">
                Type the words as quickly and accurately as you can
              </p>
            </div>
            
            <TypingTest 
              wordCount={30}
              onComplete={(wpm, accuracy) => {
                setTestResults({ wpm, accuracy });
                setShowTest(false);
                setShowResults(true);
              }}
            />
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
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Learn Touch Typing
            </h1>
            <p className="text-2xl text-aqua-light">
              Master the art of typing without looking at the keyboard
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-accent text-center">Why Learn Touch Typing?</h2>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Touch typing is a skill that dramatically improves your typing speed and accuracy. 
                With just <span className="text-primary font-semibold">30 minutes of practice per day</span>, 
                you can increase your WPM (words per minute) from 30-40 to 60-100+.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">2-3x</p>
                <p className="text-base text-foreground/80">Typing speed increase</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">30min</p>
                <p className="text-base text-foreground/80">Daily practice needed</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">2-4wk</p>
                <p className="text-base text-foreground/80">To become proficient</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground italic text-center">
              Many people find the learning process enjoyable through gamified typing practice, 
              similar to Monkeytype or TypeRacer.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-accent">Get Started</h2>
              <p className="text-lg text-muted-foreground">
                First, let's see your current typing speed
              </p>
            </div>

            <p className="text-lg text-foreground/90 text-center">
              Before we begin our learning journey, we'll test your current typing speed. 
              This baseline will help track your progress as you learn.
            </p>

            <div className="text-center space-y-6 py-8">
              <p className="text-2xl font-semibold text-accent">Baseline Test</p>
              <p className="text-lg text-muted-foreground">
                Type a 30-word passage as quickly and accurately as you can
              </p>
              <Button 
                size="lg"
                variant="ocean"
                className="text-lg px-8 py-6"
                onClick={() => setShowTest(true)}
              >
                Start Baseline Test
              </Button>
            </div>

            <div className="text-center text-base text-muted-foreground">
              <p>After the test, you'll begin your personalized learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
