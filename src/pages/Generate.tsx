import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const programmingLanguages = [
  "C", "C#", "C++", "Java", "JavaScript", "TypeScript", 
  "Python", "Ruby", "Go", "Rust", "PHP", "Swift"
];

const humanLanguages = [
  "English", "Portuguese", "Spanish", "French", "Italian", 
  "German", "Dutch", "Russian", "Chinese", "Japanese"
];

const Generate = () => {
  const [selectedType, setSelectedType] = useState<"curated" | "custom">("curated");
  const [selectedCategory, setSelectedCategory] = useState<"programming" | "human">("programming");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayout, setGeneratedLayout] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for processing`,
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated layout
    const layout = "QWERTYUIOP\nASDFGHJKL\nZXCVBNM";
    setGeneratedLayout(layout);
    setIsGenerating(false);
    
    toast({
      title: "Layout Generated!",
      description: "Your optimized keyboard layout is ready",
    });
  };

  const handleLearnLayout = () => {
    // TODO: Store the generated layout and navigate to lessons
    navigate("/lessons");
  };

  const canGenerate = () => {
    if (selectedType === "curated") {
      return selectedLanguage !== "";
    }
    return customText.trim() !== "" || uploadedFile !== null;
  };

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
                Your Optimized Layout
              </h1>
              <p className="text-lg text-muted-foreground">
                Generated based on {selectedType === "curated" ? selectedLanguage : "your custom data"}
              </p>
            </div>

            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="text-4xl font-mono tracking-wider text-primary whitespace-pre">
                    {generatedLayout}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent">42%</p>
                    <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent">65%</p>
                    <p className="text-sm text-muted-foreground">Home Row Usage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent">28%</p>
                    <p className="text-sm text-muted-foreground">Less Finger Travel</p>
                  </div>
                </div>
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
                Learn This Layout
              </Button>
              <Button
                onClick={() => setGeneratedLayout(null)}
                variant="outline"
                size="lg"
              >
                Generate Another
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
              Generate Custom Layout
            </h1>
            <p className="text-xl text-muted-foreground">
              Optimize your keyboard layout for your specific needs
            </p>
          </div>

          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as "curated" | "custom")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="curated" className="gap-2">
                <Code className="w-4 h-4" />
                Curated Applications
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <FileText className="w-4 h-4" />
                Custom Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curated" className="space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent">
                    <Languages className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Choose Your Application</h3>
                  </div>

                  <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as "programming" | "human")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="programming">Programming Languages</TabsTrigger>
                      <TabsTrigger value="human">Human Languages</TabsTrigger>
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
                            {lang}
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
                            {lang}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Paste Your Text
                    </label>
                    <Textarea
                      placeholder="Paste text that represents what you'll be typing..."
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
                      <span className="bg-card px-2 text-muted-foreground">OR</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload a File
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
                        {uploadedFile ? uploadedFile.name : "Choose File"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported: TXT, PDF, YAML, JSON, MD
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleGenerate}
              variant="ocean"
              size="lg"
              disabled={!canGenerate() || isGenerating}
              className="gap-2 min-w-[200px]"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Generate Layout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
