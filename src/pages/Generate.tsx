import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Code, Languages, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLayout } from "@/contexts/LayoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LAYOUT_STRINGS, getLayoutName, PROGRAMMING_LAYOUTS, HUMAN_LANGUAGE_LAYOUTS } from "@/lib/layoutMapper";
import { useLocalization } from "@/hooks/useLocalization";
import { VisualKeyboard } from "@/components/VisualKeyboard";
import { useMemo } from "react";
import { runPythonGA, PythonRunOptions } from "@/lib/pythonRunner";
import { getCachedLayout, cacheLayout, hashCorpus } from "@/lib/indexedDBCache";
import { Progress } from "@/components/ui/progress";

// Seeded random number generator
const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive number and normalize to 0-1
  return Math.abs(hash) / 2147483647;
};

// Generate a value in a range based on seed
const generateSeededValue = (seed: string, min: number, max: number, offset: number = 0): number => {
  const random = seededRandom(seed + offset);
  return Math.round((min + (max - min) * random) * 10) / 10;
};

const Generate = () => {
  const { lang } = useParams();
  const { t } = useLocalization();
  
  const programmingLanguages = [
    "C", "C#", "C++", "Java", "JavaScript", "TypeScript", 
    "Python", "Ruby", "Go", "Rust", "PHP", "Swift"
  ];

  const humanLanguages = [
    "English", "Portuguese", "Spanish", "French", "Italian", 
    "German", "Dutch"
  ];
  const [selectedType, setSelectedType] = useState<"curated" | "custom" | "manual">("curated");
  const [selectedCategory, setSelectedCategory] = useState<"programming" | "human">("programming");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayout, setGeneratedLayout] = useState<string | null>(null);
  const [manualLayoutString, setManualLayoutString] = useState("");
  const [usedCharacters, setUsedCharacters] = useState<Set<string>>(new Set());
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [isInitializingPython, setIsInitializingPython] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentLayout, setLayoutName } = useLayout();

  // Generate statistics based on selected language (seed)
  const seed = selectedLanguage || "default";
  const efficiencyGain = useMemo(() => generateSeededValue(seed, 30, 50, 0), [seed]);
  const homeRowUsage = useMemo(() => generateSeededValue(seed, 55, 75, 1), [seed]);
  const lessFingerTravel = useMemo(() => generateSeededValue(seed, 20, 35, 2), [seed]);

  useEffect(() => {
    // Load saved manual layout from localStorage and switch to manual tab
    const savedLayout = localStorage.getItem('persistent_layout');
    if (savedLayout && savedLayout.length === 45) {
      setManualLayoutString(savedLayout);
      setUsedCharacters(new Set(savedLayout.split('')));
      // Only switch to manual tab if it's a custom layout (not QWERTY)
      if (savedLayout !== LAYOUT_STRINGS.qwerty) {
        setSelectedType("manual");
      }
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file content as text
      try {
        const text = await file.text();
        setCustomText(text);
        toast({
          title: t('generate.toasts.fileUploaded'),
          description: t('generate.toasts.fileReady', { filename: file.name }),
        });
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: t('generate.toasts.error'),
          description: 'Failed to read file content',
          variant: "destructive"
        });
      }
    }
  };

  const handleGenerate = async () => {
    if (selectedType === "curated" && selectedLanguage) {
      // Get the curated layout for the selected language
      let layoutToUse: string | undefined;
      
      if (selectedCategory === "programming") {
        layoutToUse = PROGRAMMING_LAYOUTS[selectedLanguage];
      } else if (selectedCategory === "human") {
        layoutToUse = HUMAN_LANGUAGE_LAYOUTS[selectedLanguage];
      }
      
      if (layoutToUse && layoutToUse.length === 45) {
        setGeneratedLayout(layoutToUse);
        toast({
          title: t('generate.toasts.layoutGenerated'),
          description: t('generate.toasts.layoutReady'),
        });
      } else {
        toast({
          title: t('generate.toasts.error'),
          description: t('generate.toasts.switchFailed'),
          variant: "destructive"
        });
      }
    } else if (selectedType === "custom") {
      // Get corpus text from either textarea or uploaded file
      const corpusText = customText.trim();
      
      if (!corpusText) {
        toast({
          title: t('generate.toasts.error'),
          description: 'Please provide text or upload a file with corpus data',
          variant: "destructive"
        });
        return;
      }

      console.log('[Generate] Starting layout generation');
      console.log(`[Generate] Corpus text length: ${corpusText.length} characters`);
      
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationMessage("Initializing Python environment...");
      setIsInitializingPython(true);

      try {
        // Check cache first
        console.log('[Generate] Checking cache for existing layout...');
        const cached = await getCachedLayout(corpusText);
        if (cached && cached.layout) {
          console.log('[Generate] Found cached layout, using it');
          setGeneratedLayout(cached.layout);
          setIsGenerating(false);
          setIsInitializingPython(false);
          toast({
            title: t('generate.toasts.layoutGenerated'),
            description: 'Layout loaded from cache',
          });
          return;
        }
        console.log('[Generate] No cached layout found, generating new one...');

        // Run Python GA
        console.log('[Generate] Setting up Python GA options...');
        const options: PythonRunOptions = {
          corpus: corpusText,
          onInitProgress: (message: string, progress?: number) => {
            console.log(`[Generate Init] ${message}${progress !== undefined ? ` (${progress}%)` : ''}`);
            setGenerationMessage(message);
            if (progress !== undefined) {
              setGenerationProgress(progress);
            }
          },
          onProgress: (message: string, progress?: number) => {
            setIsInitializingPython(false); // Mark as initialized once we get GA progress
            setGenerationMessage(message);
            if (progress !== undefined) {
              // Map GA progress (0-100) to overall progress (30-100)
              const overallProgress = 30 + (progress * 0.7);
              setGenerationProgress(overallProgress);
            }
          },
          onError: (error: string) => {
            console.error('[Generate] Python execution error:', error);
            setIsInitializingPython(false);
            toast({
              title: t('generate.toasts.error'),
              description: `Generation failed: ${error}`,
              variant: "destructive"
            });
          }
        };
        
        console.log('[Generate] Calling runPythonGA...');
        const startTime = Date.now();

        const result = await runPythonGA(options);
        const totalTime = Date.now() - startTime;
        console.log(`[Generate] Total generation time: ${totalTime}ms`);
        setIsInitializingPython(false);

        if (result.success && result.layout) {
          console.log('[Generate] Layout generated successfully, caching result...');
          // Cache the result
          await cacheLayout(corpusText, result.layout, {
            generations: 300,
            population: 200,
            mutationRate: 0.1,
            crossoverRate: 0.7,
          });
          console.log('[Generate] Result cached');

          setGeneratedLayout(result.layout);
          toast({
            title: t('generate.toasts.layoutGenerated'),
            description: t('generate.toasts.layoutReady'),
          });
        } else {
          console.error('[Generate] Generation failed:', result.error);
          toast({
            title: t('generate.toasts.error'),
            description: result.error || 'Failed to generate layout',
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Error generating layout:', error);
        toast({
          title: t('generate.toasts.error'),
          description: error?.message || 'An unexpected error occurred',
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
        setIsInitializingPython(false);
        setGenerationProgress(0);
        setGenerationMessage("");
      }
    }
  };

  const handleLearnLayout = async () => {
    let layoutToUse: string;
    let layoutNameToUse: string;
    
    if (selectedType === "manual") {
      layoutToUse = manualLayoutString;
      layoutNameToUse = getLayoutName(layoutToUse);
    } else if (generatedLayout) {
      // For curated layouts, generatedLayout is the layout string directly
      // For other generated layouts, it might be multi-line
      if (generatedLayout.includes('\n')) {
        const lines = generatedLayout.split('\n');
        layoutToUse = lines[lines.length - 1]; // Get the last line which contains the layout string
      } else {
        layoutToUse = generatedLayout;
      }
      
      // Set layout name based on selected language for curated layouts
      if (selectedType === "curated" && selectedLanguage) {
        layoutNameToUse = selectedLanguage.toLowerCase().replace(/\s+/g, '-');
      } else {
        layoutNameToUse = getLayoutName(layoutToUse);
      }
    } else {
      return;
    }
    
    if (layoutToUse.length === 45) {
      try {
        // Check if this is a different layout than the current one
        const currentLayout = localStorage.getItem('persistent_layout');
        const isDifferentLayout = currentLayout && currentLayout !== layoutToUse;
        
        // Always reset progress when setting/changing a layout (for both logged and anonymous users)
        if (user) {
          // Delete all lesson progress from Supabase for logged-in users
          const { error: deleteError } = await supabase
            .from('lesson_progress')
            .delete()
            .eq('user_id', user.id);
          
          if (deleteError) {
            console.error('Error deleting lesson progress:', deleteError);
            toast({
              title: t('generate.toasts.error'),
              description: 'Failed to clear progress. Please try again.',
              variant: "destructive"
            });
          }
        } else {
          // Clear lesson progress from localStorage for anonymous users
          // Also clear session_id to start fresh
          localStorage.removeItem('lesson_progress');
          localStorage.removeItem('session_id');
        }
        
        // Show toast notification if layout changed
        if (isDifferentLayout) {
          toast({
            title: t('generate.toasts.layoutSwitched'),
            description: t('generate.toasts.progressReset'),
          });
        }
        
        // Store the layout in context
        setCurrentLayout(layoutToUse);
        setLayoutName(layoutNameToUse);
        
        // Save to localStorage for persistence
        localStorage.setItem('persistent_layout', layoutToUse);
        
        // Navigate to lessons
        navigate(`/${lang}/lessons`);
      } catch (error) {
        console.error('Error handling layout change:', error);
        toast({
          title: t('generate.toasts.error'),
          description: t('generate.toasts.switchFailed'),
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: t('generate.toasts.invalidLayout'),
        description: t('generate.toasts.mustBe45Chars'),
        variant: "destructive"
      });
    }
  };

  const canGenerate = () => {
    if (selectedType === "curated") {
      return selectedLanguage !== "";
    }
    if (selectedType === "manual") {
      return manualLayoutString.length === 45;
    }
    return customText.trim() !== "" || uploadedFile !== null;
  };

  // Only show preview for generated layouts, not manual entry
  if (generatedLayout) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-4">
                {selectedType === "manual" ? t('generate.results.manualTitle') : t('generate.results.generatedTitle')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {selectedType === "manual" 
                  ? t('generate.results.manualSubtitle')
                  : t('generate.results.generatedSubtitle', { source: selectedType === "curated" ? selectedLanguage : t('generate.custom.pasteText') })}
              </p>
            </div>

            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {selectedType === "manual" ? t('generate.results.manualLayout') : t('generate.results.generatedLayout')}
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                      <div className="text-lg font-mono text-foreground break-all leading-relaxed">
                        {selectedType === "manual" ? (
                          <div>{manualLayoutString}</div>
                        ) : generatedLayout.includes('\n') ? (
                          generatedLayout.split('\n').map((line, index) => (
                            <div key={index} className="mb-1">
                              {line}
                            </div>
                          ))
                        ) : (
                          <div>{generatedLayout}</div>
                        )}
                      </div>
                    </div>
                  {/* Visual Keyboard Display */}
                  {(() => {
                    let layoutToDisplay = "";
                    if (selectedType === "manual") {
                      layoutToDisplay = manualLayoutString;
                    } else if (generatedLayout) {
                      if (generatedLayout.includes("\n")) {
                        const lines = generatedLayout.split("\n");
                        layoutToDisplay = lines[lines.length - 1] || generatedLayout;
                      } else {
                        layoutToDisplay = generatedLayout;
                      }
                    }
                    
                    if (layoutToDisplay && layoutToDisplay.length === 45) {
                      return (
                        <div className="mt-6 space-y-4">
                          <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                            <VisualKeyboard 
                              layoutString={layoutToDisplay}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  </div>
                </div>

                {selectedType !== "manual" && (
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{efficiencyGain}%</p>
                      <p className="text-sm text-muted-foreground">{t('generate.results.efficiencyGain')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{homeRowUsage}%</p>
                      <p className="text-sm text-muted-foreground">{t('generate.results.homeRowUsage')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{lessFingerTravel}%</p>
                      <p className="text-sm text-muted-foreground">{t('generate.results.lessFingerTravel')}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleLearnLayout}
                variant="ocean"
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {t('generate.actions.learnLayout')}
              </Button>
              <Button
                onClick={() => {
                  setGeneratedLayout(null);
                }}
                variant="outline"
                size="lg"
              >
                {t('generate.actions.generateAnother')}
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
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
              {t('generate.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('generate.subtitle')}
            </p>
          </div>

          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as "curated" | "custom" | "manual")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="curated" className="gap-2">
                <Code className="w-4 h-4" />
                {t('generate.tabs.curated')}
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <FileText className="w-4 h-4" />
                {t('generate.tabs.custom')}
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <Languages className="w-4 h-4" />
                {t('generate.tabs.manual')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curated" className="space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent">
                    <Languages className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">{t('generate.curated.title')}</h3>
                  </div>

                  <Tabs value={selectedCategory} onValueChange={(v) => {
                    setSelectedCategory(v as "programming" | "human");
                    setSelectedLanguage(""); // Reset selection when switching categories
                  }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="programming">{t('generate.curated.programming')}</TabsTrigger>
                      <TabsTrigger value="human">{t('generate.curated.human')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="programming" className="mt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {programmingLanguages.map((lang) => (
                          <Button
                            key={lang}
                            variant={selectedLanguage === lang ? "ocean" : "outline"}
                            onClick={() => setSelectedLanguage(lang)}
                            className="h-12"
                          >
                            {t(`generate.curated.languages.programming.${lang}`)}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="human" className="mt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {humanLanguages.map((lang) => (
                          <Button
                            key={lang}
                            variant={selectedLanguage === lang ? "ocean" : "outline"}
                            onClick={() => setSelectedLanguage(lang)}
                            className="h-12"
                          >
                            {t(`generate.curated.languages.human.${lang}`)}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        {t('generate.manual.title')}
                      </label>
                      {manualLayoutString === localStorage.getItem('persistent_layout') && manualLayoutString.length === 45 && (
                        <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                          {t('generate.manual.currentlyActive')}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder={t('generate.manual.placeholder')}
                        value={manualLayoutString}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const validChars = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./";
                          
                          // Handle deletion - if new value is shorter, just update
                          if (newValue.length <= manualLayoutString.length) {
                            setManualLayoutString(newValue);
                            setUsedCharacters(new Set(newValue.split('')));
                            return;
                          }
                          
                          // Handle addition - filter to only allow valid, non-duplicate characters
                          let filteredValue = manualLayoutString;
                          const currentUsedChars = new Set(manualLayoutString.split(''));
                          
                          // Process only the new characters (from the end)
                          const addedChars = newValue.slice(manualLayoutString.length);
                          
                          for (const char of addedChars) {
                            // Check if character is valid
                            if (validChars.includes(char)) {
                              // Check if character is already used
                              if (!currentUsedChars.has(char) && filteredValue.length < 45) {
                                filteredValue += char;
                                currentUsedChars.add(char);
                              }
                              // If duplicate or invalid, skip it (don't add to string)
                            }
                          }
                          
                          setManualLayoutString(filteredValue);
                          setUsedCharacters(currentUsedChars);
                        }}
                        maxLength={45}
                        className="min-h-[100px] bg-background/80 border-border font-mono pr-20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setManualLayoutString("");
                          setUsedCharacters(new Set());
                          localStorage.removeItem('persistent_layout');
                        }}
                        disabled={!manualLayoutString}
                        className="absolute bottom-2 right-2"
                      >
                        {t('generate.manual.clear')}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const layout = LAYOUT_STRINGS.qwerty;
                          setManualLayoutString(layout);
                          setUsedCharacters(new Set(layout.split('')));
                        }}
                      >
                        QWERTY
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const layout = LAYOUT_STRINGS.dvorak;
                          setManualLayoutString(layout);
                          setUsedCharacters(new Set(layout.split('')));
                        }}
                      >
                        Dvorak
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const layout = LAYOUT_STRINGS.colemak;
                          setManualLayoutString(layout);
                          setUsedCharacters(new Set(layout.split('')));
                        }}
                      >
                        Colemak
                      </Button>
                    </div>
                  </div>
                  
                  {/* Visual Keyboard Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Keyboard Preview
                      </label>
                      <div className="flex flex-col items-end gap-1 min-w-[200px] h-[2.5rem]">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {t('generate.manual.length', { current: manualLayoutString.length })}
                          {manualLayoutString.length !== 45 && t('generate.manual.mustBe45')}
                        </p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {manualLayoutString.length > 0 ? (
                            <>Characters used: {usedCharacters.size}/45 • Remaining: {45 - usedCharacters.size}</>
                          ) : (
                            <>&nbsp;</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                      <VisualKeyboard 
                        layoutString={(() => {
                          // Create a 45-character string with question marks for empty positions
                          const QWERTY_POSITIONS = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./";
                          let displayLayout = "";
                          for (let i = 0; i < 45; i++) {
                            if (i < manualLayoutString.length) {
                              displayLayout += manualLayoutString[i];
                            } else {
                              displayLayout += "?";
                            }
                          }
                          return displayLayout;
                        })()}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('generate.manual.keyboardPreviewHint')}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t('generate.custom.pasteText')}
                    </label>
                    <Textarea
                      placeholder={t('generate.custom.pastePlaceholder')}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="min-h-[200px] bg-background/80 border-border"
                      disabled={isGenerating}
                    />
                    {customText && (
                      <p className="text-xs text-muted-foreground">
                        {customText.length} characters
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">{t('generate.custom.or')}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {t('generate.custom.uploadFile')}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt,.pdf,.yaml,.yml,.json,.md"
                        onChange={handleFileUpload}
                        disabled={isGenerating}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className="w-full gap-2"
                        disabled={isGenerating}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadedFile ? uploadedFile.name : t('generate.custom.chooseFile')}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('generate.custom.supportedFormats')}
                    </p>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{generationMessage || "Processing..."}</span>
                        <span className="text-muted-foreground">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      {isInitializingPython && (
                        <p className="text-xs text-muted-foreground">
                          First-time setup: Loading Python environment (this may take a minute)...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={selectedType === "manual" ? handleLearnLayout : handleGenerate}
                variant="ocean"
                size="lg"
                disabled={!canGenerate() || isGenerating}
                className="gap-2 min-w-[200px]"
              >
                <Sparkles className="w-5 h-5" />
                {selectedType === "manual" 
                  ? t('generate.actions.learnLayout')
                  : selectedType === "curated"
                    ? t('generate.actions.useLayout')
                    : isGenerating
                      ? t('generate.actions.generating')
                      : t('generate.actions.generateLayout')}
              </Button>
              {selectedType === "manual" && manualLayoutString.length === 45 && (
                <p className="text-xs text-muted-foreground text-center max-w-[300px]">
                  {t('generate.actions.learnHint')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
