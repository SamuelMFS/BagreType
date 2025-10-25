import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import TypingTest from "@/components/TypingTest";
import CustomTextModal from "@/components/CustomTextModal";
import { KeyboardImage } from "@/components/KeyboardImage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Settings, X, Plus, Keyboard } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";

type Mode = "words" | "time" | "quote" | "zen" | "custom";

const Practice = () => {
  const { lang } = useParams();
  const { t } = useLocalization();
  const [mode, setMode] = useState<Mode>("words");
  const [wordCount, setWordCount] = useState(25);
  const [timeLimit, setTimeLimit] = useState(30);
  const [quoteLength, setQuoteLength] = useState(100);
  const [customText, setCustomText] = useState("");
  const [selectedCustomTextTitle, setSelectedCustomTextTitle] = useState("");
  const [savedTexts, setSavedTexts] = useState<{title: string, text: string}[]>([]);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showKeyboardImage, setShowKeyboardImage] = useState(false);
  const [currentChar, setCurrentChar] = useState<string>("");

  // Load saved custom texts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customTexts");
    if (saved) {
      setSavedTexts(JSON.parse(saved));
    }
  }, []);

  // Load quotes from quotes file based on language
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const quotesFile = lang === 'pt-BR' ? '/quotes-pt-BR.txt' : '/quotes.txt';
        const response = await fetch(quotesFile);
        const text = await response.text();
        const quoteLines = text
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.trim());
        setQuotes(quoteLines);
        
        // Select a random quote based on length
        if (quoteLines.length > 0) {
          const filteredQuotes = quoteLines.filter(quote => {
            const length = quote.length;
            return (
              (quoteLength === 50 && length >= 30 && length <= 80) ||
              (quoteLength === 100 && length >= 80 && length <= 150) ||
              (quoteLength === 200 && length >= 150 && length <= 300) ||
              (quoteLength === 500 && length >= 300)
            );
          });
          
          if (filteredQuotes.length > 0) {
            setSelectedQuote(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]);
          } else {
            setSelectedQuote(quoteLines[Math.floor(Math.random() * quoteLines.length)]);
          }
        }
      } catch (error) {
        console.error('Error loading quotes:', error);
        const fallbackQuote = lang === 'pt-BR' 
          ? "A raposa marrom rápida pula sobre o cão preguiçoso."
          : "The quick brown fox jumps over the lazy dog.";
        setSelectedQuote(fallbackQuote);
      }
    };

    if (mode === "quote") {
      loadQuotes();
    }
  }, [mode, quoteLength]);

  const handleSaveCustomText = (title: string, text: string) => {
    const newTexts = [...savedTexts, { title, text }];
    setSavedTexts(newTexts);
    localStorage.setItem("customTexts", JSON.stringify(newTexts));
    setCustomText(text);
    setSelectedCustomTextTitle(title);
    if (testRef.current) testRef.current.reset();
  };

  const handleRemoveCustomText = (index: number) => {
    const newTexts = savedTexts.filter((_, i) => i !== index);
    setSavedTexts(newTexts);
    localStorage.setItem("customTexts", JSON.stringify(newTexts));
  };

  const testRef = useRef<{ reset: () => void }>(null);

  const getTestProps = () => {
    switch (mode) {
      case "words":
        return { wordCount };
      case "time":
        return { timeLimit };
      case "quote":
        return { customText: selectedQuote };
      case "zen":
        return { zenMode: true };
      case "custom":
        return customText ? { customText } : { disabled: true };
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
              if (testRef.current) testRef.current.reset();
            }}>
              <SelectTrigger className="w-32 bg-transparent border-none text-foreground/70 hover:text-foreground focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="words">{t('practice.modes.words')}</SelectItem>
                <SelectItem value="time">{t('practice.modes.time')}</SelectItem>
                <SelectItem value="quote">{t('practice.modes.quote')}</SelectItem>
                <SelectItem value="zen">{t('practice.modes.zen')}</SelectItem>
                <SelectItem value="custom">{t('practice.modes.custom')}</SelectItem>
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
                      if (testRef.current) testRef.current.reset();
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
                      if (testRef.current) testRef.current.reset();
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
                      if (testRef.current) testRef.current.reset();
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
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(value) => {
                      const selectedItem = savedTexts.find(item => item.text === value);
                      if (selectedItem) {
                        setCustomText(selectedItem.text);
                        setSelectedCustomTextTitle(selectedItem.title);
                        if (testRef.current) testRef.current.reset();
                      }
                    }}>
                      <SelectTrigger className="w-48 bg-transparent border-none text-foreground/70 hover:text-foreground focus:ring-0">
                        <SelectValue placeholder={selectedCustomTextTitle || t('practice.placeholders.savedTexts')} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        {savedTexts.map((item, index) => (
                          <SelectItem key={index} value={item.text}>
                            <span className="truncate">{item.title}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {customText && (
                      <button
                        onClick={() => {
                          const index = savedTexts.findIndex(item => item.text === customText);
                          if (index !== -1) {
                            handleRemoveCustomText(index);
                            // Clear selection when text is deleted
                            setCustomText("");
                            setSelectedCustomTextTitle("");
                          }
                        }}
                        className="text-muted-foreground hover:text-primary p-1 transition-colors"
                        title={t('practice.titles.deleteText')}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                )}
                <button
                  className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={14} />
                  {t('practice.placeholders.newText')}
                </button>
              </div>
            )}

            {/* Keyboard Image Toggle */}
            <button
              className={`text-sm transition-colors flex items-center gap-1 ${
                showKeyboardImage
                  ? "text-primary font-semibold"
                  : "text-foreground/50 hover:text-foreground"
              }`}
              onClick={() => setShowKeyboardImage(!showKeyboardImage)}
              title={showKeyboardImage ? t('practice.titles.hideKeyboard') : t('practice.titles.showKeyboard')}
            >
              <Keyboard size={14} />
              {t('practice.placeholders.keyboard')}
            </button>
          </div>

          {/* Typing Test */}
          {mode === "custom" && !customText ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{t('practice.noCustomText.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('practice.noCustomText.description')}
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('practice.noCustomText.createButton')}
                </Button>
              </div>
            </div>
          ) : (
            <TypingTest 
              ref={testRef}
              {...getTestProps()}
              onCurrentCharChange={setCurrentChar}
            />
          )}

          {/* Keyboard Image */}
          {showKeyboardImage && (
            <div className="aspect-video w-full max-w-md mx-auto flex items-center justify-center">
              <KeyboardImage 
                lessonKey={currentChar || "a"}
                currentChar={currentChar}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomText}
      />
    </div>
  );
};

export default Practice;
