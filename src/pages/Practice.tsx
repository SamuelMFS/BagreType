import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import TypingTest from "@/components/TypingTest";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

type Mode = "words" | "time" | "quote" | "zen" | "custom";

const Practice = () => {
  const [mode, setMode] = useState<Mode>("words");
  const [wordCount, setWordCount] = useState(25);
  const [timeLimit, setTimeLimit] = useState(30);
  const [quoteLength, setQuoteLength] = useState(100);
  const [customText, setCustomText] = useState("");
  const [savedTexts, setSavedTexts] = useState<string[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  // Load saved custom texts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customTexts");
    if (saved) {
      setSavedTexts(JSON.parse(saved));
    }
  }, []);

  const handleSaveCustomText = () => {
    if (customText.trim()) {
      const newTexts = [...savedTexts, customText];
      setSavedTexts(newTexts);
      localStorage.setItem("customTexts", JSON.stringify(newTexts));
    }
  };

  const handleStartTest = () => {
    setShowTest(true);
    setShowSettings(false);
  };

  const handleResetTest = () => {
    setShowTest(false);
    setShowSettings(true);
  };

  const getTestProps = () => {
    switch (mode) {
      case "words":
        return { wordCount };
      case "custom":
        return { customText };
      default:
        return { wordCount: 30 };
    }
  };

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
            <h1 className="text-5xl font-bold text-primary animate-float">
              Typing Practice
            </h1>
            <p className="text-lg text-muted-foreground">
              Improve your skills with customizable practice sessions
            </p>
          </div>

          {showSettings && (
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Practice Settings</h2>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Mode</label>
                <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
                  <SelectTrigger className="bg-background/80 border-border z-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="zen">Zen</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mode-specific configurations */}
              {mode === "words" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Word Count</label>
                  <div className="flex gap-2 flex-wrap">
                    {[10, 25, 50, 100, 250].map((count) => (
                      <Button
                        key={count}
                        variant={wordCount === count ? "ocean" : "outline"}
                        size="sm"
                        onClick={() => setWordCount(count)}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "time" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Time (seconds)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[15, 30, 60, 120].map((time) => (
                      <Button
                        key={time}
                        variant={timeLimit === time ? "ocean" : "outline"}
                        size="sm"
                        onClick={() => setTimeLimit(time)}
                      >
                        {time}s
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "quote" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Quote Length</label>
                  <div className="flex gap-2 flex-wrap">
                    {[50, 100, 200, 500].map((length) => (
                      <Button
                        key={length}
                        variant={quoteLength === length ? "ocean" : "outline"}
                        size="sm"
                        onClick={() => setQuoteLength(length)}
                      >
                        {length}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "zen" && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Zen mode - Type as long as you want with no limits
                  </p>
                </div>
              )}

              {mode === "custom" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Custom Text</label>
                  
                  {savedTexts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Previously saved:</p>
                      <Select onValueChange={(value) => setCustomText(value)}>
                        <SelectTrigger className="bg-background/80 border-border z-50">
                          <SelectValue placeholder="Select a saved text" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          {savedTexts.map((text, index) => (
                            <SelectItem key={index} value={text}>
                              {text.slice(0, 50)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Textarea
                    placeholder="Enter your custom text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[120px] bg-background/80 border-border"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveCustomText}
                    disabled={!customText.trim()}
                  >
                    Save Text for Later
                  </Button>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant="ocean"
                  size="lg"
                  className="w-full"
                  onClick={handleStartTest}
                  disabled={mode === "custom" && !customText.trim()}
                >
                  Start Practice
                </Button>
              </div>
            </div>
          )}

          {showTest && (
            <TypingTest 
              {...getTestProps()}
              onComplete={handleResetTest}
              onRestart={handleResetTest}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
