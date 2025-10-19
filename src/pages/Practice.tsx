import { useState, useEffect, useRef } from "react";
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

  const testRef = useRef<{ reset: () => void }>(null);

  const handleResetTest = () => {
    if (testRef.current) {
      testRef.current.reset();
    }
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
          {/* Settings bar above typing test */}
          <div className="flex items-center justify-center gap-4 flex-wrap text-muted-foreground">
            {/* Mode Selection */}
            <Select value={mode} onValueChange={(value) => {
              setMode(value as Mode);
              handleResetTest();
            }}>
              <SelectTrigger className="w-32 bg-transparent border-none text-foreground/70 hover:text-foreground focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="words">words</SelectItem>
                <SelectItem value="time">time</SelectItem>
                <SelectItem value="quote">quote</SelectItem>
                <SelectItem value="zen">zen</SelectItem>
                <SelectItem value="custom">custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Mode-specific configurations */}
            {mode === "words" && (
              <>
                {[10, 25, 50, 100, 250].map((count) => (
                  <button
                    key={count}
                    className={`text-sm transition-colors ${
                      wordCount === count
                        ? "text-primary font-semibold"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                    onClick={() => {
                      setWordCount(count);
                      handleResetTest();
                    }}
                  >
                    {count}
                  </button>
                ))}
              </>
            )}

            {mode === "time" && (
              <>
                {[15, 30, 60, 120].map((time) => (
                  <button
                    key={time}
                    className={`text-sm transition-colors ${
                      timeLimit === time
                        ? "text-primary font-semibold"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                    onClick={() => {
                      setTimeLimit(time);
                      handleResetTest();
                    }}
                  >
                    {time}
                  </button>
                ))}
              </>
            )}

            {mode === "quote" && (
              <>
                {[50, 100, 200, 500].map((length) => (
                  <button
                    key={length}
                    className={`text-sm transition-colors ${
                      quoteLength === length
                        ? "text-primary font-semibold"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                    onClick={() => {
                      setQuoteLength(length);
                      handleResetTest();
                    }}
                  >
                    {length}
                  </button>
                ))}
              </>
            )}

            {mode === "custom" && (
              <div className="flex items-center gap-2">
                {savedTexts.length > 0 && (
                  <Select onValueChange={(value) => {
                    setCustomText(value);
                    handleResetTest();
                  }}>
                    <SelectTrigger className="w-40 bg-transparent border-none text-foreground/70 hover:text-foreground focus:ring-0">
                      <SelectValue placeholder="saved texts" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      {savedTexts.map((text, index) => (
                        <SelectItem key={index} value={text}>
                          {text.slice(0, 30)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <button
                  className="text-sm text-foreground/50 hover:text-foreground"
                  onClick={() => {
                    const text = prompt("Enter your custom text:");
                    if (text?.trim()) {
                      setCustomText(text);
                      const newTexts = [...savedTexts, text];
                      setSavedTexts(newTexts);
                      localStorage.setItem("customTexts", JSON.stringify(newTexts));
                      handleResetTest();
                    }
                  }}
                >
                  + new text
                </button>
              </div>
            )}
          </div>

          {/* Typing Test */}
          <TypingTest 
            ref={testRef}
            {...getTestProps()}
            onComplete={handleResetTest}
            onRestart={handleResetTest}
          />
        </div>
      </div>
    </div>
  );
};

export default Practice;
