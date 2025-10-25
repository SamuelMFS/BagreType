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
import { LAYOUT_STRINGS, getLayoutName } from "@/lib/layoutMapper";
import { useLocalization } from "@/hooks/useLocalization";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentLayout, setLayoutName } = useLayout();

  useEffect(() => {
    // Load saved manual layout from localStorage and switch to manual tab
    const savedLayout = localStorage.getItem('persistent_layout');
    if (savedLayout && savedLayout.length === 45) {
      setManualLayoutString(savedLayout);
      // Only switch to manual tab if it's a custom layout (not QWERTY)
      if (savedLayout !== LAYOUT_STRINGS.qwerty) {
        setSelectedType("manual");
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: t('generate.toasts.fileUploaded'),
        description: t('generate.toasts.fileReady', { filename: file.name }),
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a custom layout string based on the selected language
    // For now, we'll use Dvorak as an example of a different layout
    // In a real implementation, this would be generated based on the text analysis
    let layoutString: string;
    
    if (selectedLanguage === "Python" || selectedLanguage === "JavaScript") {
      // Use Dvorak for programming languages
      layoutString = LAYOUT_STRINGS.dvorak;
    } else {
      // Use QWERTY for other cases
      layoutString = LAYOUT_STRINGS.qwerty;
    }
    
    const layout = `${layoutString}`;
    setGeneratedLayout(layout);
    setIsGenerating(false);
    
    toast({
      title: t('generate.toasts.layoutGenerated'),
      description: t('generate.toasts.layoutReady'),
    });
  };

  const handleLearnLayout = async () => {
    let layoutToUse: string;
    
    if (selectedType === "manual") {
      layoutToUse = manualLayoutString;
    } else if (generatedLayout) {
      const lines = generatedLayout.split('\n');
      layoutToUse = lines[lines.length - 1]; // Get the last line which contains the layout string
    } else {
      return;
    }
    
    if (layoutToUse.length === 45) {
      try {
        // Check if this is a different layout than the current one
        const currentLayout = localStorage.getItem('persistent_layout');
        const isDifferentLayout = currentLayout && currentLayout !== layoutToUse;
        
        // Always reset progress when switching layouts (or starting fresh)
        if (isDifferentLayout) {
          if (user) {
            // Delete all lesson progress from Supabase
            const { error } = await supabase
              .from('lesson_progress')
              .delete()
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error deleting lesson progress:', error);
            }
          } else {
            // Clear lesson progress from localStorage for anonymous users
            localStorage.removeItem('lesson_progress');
          }
          
          toast({
            title: t('generate.toasts.layoutSwitched'),
            description: t('generate.toasts.progressReset'),
          });
        } else if (!currentLayout) {
          // First time setting a layout, clear any existing progress just in case
          if (user) {
            // Delete all lesson progress from Supabase
            const { error } = await supabase
              .from('lesson_progress')
              .delete()
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error deleting lesson progress:', error);
            }
          } else {
            // Clear lesson progress from localStorage for anonymous users
            localStorage.removeItem('lesson_progress');
          }
        }
        
        // Store the layout in context
        setCurrentLayout(layoutToUse);
        setLayoutName(getLayoutName(layoutToUse));
        
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
                        ) : (
                          generatedLayout.split('\n').map((line, index) => (
                            <div key={index} className="mb-1">
                              {line}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedType !== "manual" && (
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">42%</p>
                      <p className="text-sm text-muted-foreground">{t('generate.results.efficiencyGain')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">65%</p>
                      <p className="text-sm text-muted-foreground">{t('generate.results.homeRowUsage')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">28%</p>
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

                  <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as "programming" | "human")}>
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
                    <Textarea
                      placeholder={t('generate.manual.placeholder')}
                      value={manualLayoutString}
                      onChange={(e) => setManualLayoutString(e.target.value)}
                      maxLength={45}
                      className="min-h-[100px] bg-background/80 border-border font-mono"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {t('generate.manual.length', { current: manualLayoutString.length })}
                        {manualLayoutString.length !== 45 && t('generate.manual.mustBe45')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setManualLayoutString(LAYOUT_STRINGS.qwerty);
                          }}
                        >
                          {t('generate.manual.setQwerty')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setManualLayoutString("");
                            localStorage.removeItem('persistent_layout');
                          }}
                          disabled={!manualLayoutString}
                        >
                          {t('generate.manual.clear')}
                        </Button>
                      </div>
                    </div>
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
                    />
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
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className="w-full gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadedFile ? uploadedFile.name : t('generate.custom.chooseFile')}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('generate.custom.supportedFormats')}
                    </p>
                  </div>
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
                {selectedType === 'manual' 
                  ? t('generate.actions.learnLayout')
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
