import { useState } from "react";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type KeyboardLayout = "ortholinear" | "staggered" | null;
type TouchTyper = "yes" | "no" | null;
type ShareData = "yes" | "no" | null;

const DataCollection = () => {
  const [step, setStep] = useState<"layout" | "touch-type" | "share" | "test">("layout");
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>(null);
  const [canTouchType, setCanTouchType] = useState<TouchTyper>(null);
  const [shareData, setShareData] = useState<ShareData>(null);

  const handleLayoutSubmit = () => {
    if (keyboardLayout) setStep("touch-type");
  };

  const handleTouchTypeSubmit = () => {
    if (canTouchType === "yes") {
      setStep("share");
    } else if (canTouchType === "no") {
      setStep("share");
    }
  };

  const handleShareSubmit = () => {
    if (shareData) setStep("test");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <Bubbles />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Data Collection
            </h1>
            <p className="text-2xl text-aqua-light">
              Help us build the future of keyboard layouts
            </p>
          </div>

          {step === "layout" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">What type of keyboard do you use?</h2>
                <p className="text-lg text-muted-foreground">
                  This helps us understand the physical layout you're typing on
                </p>
              </div>
              
              <div className="space-y-6">
                <RadioGroup value={keyboardLayout || ""} onValueChange={(v) => setKeyboardLayout(v as KeyboardLayout)}>
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="staggered" id="staggered" className="w-5 h-5" />
                    <Label htmlFor="staggered" className="flex-1 cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-xl font-semibold text-foreground">Staggered</p>
                        <p className="text-base text-muted-foreground">Traditional keyboard with offset rows (most common)</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="ortholinear" id="ortholinear" className="w-5 h-5" />
                    <Label htmlFor="ortholinear" className="flex-1 cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-xl font-semibold text-foreground">Ortholinear</p>
                        <p className="text-base text-muted-foreground">Keys arranged in a perfect grid (mechanical keyboards)</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handleLayoutSubmit} 
                  disabled={!keyboardLayout}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater text-lg py-6"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "touch-type" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Can you touch type?</h2>
                <p className="text-lg text-muted-foreground">
                  Touch typing means typing without looking at the keyboard
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-3">
                  <h3 className="text-xl font-semibold text-accent">What is Touch Typing?</h3>
                  <p className="text-base text-foreground/80 leading-relaxed">
                    Touch typing is a method where you type using muscle memory without looking at the keys. 
                    This technique dramatically increases typing speed and accuracy. Professional touch typists 
                    often reach 60-100+ WPM (words per minute).
                  </p>
                </div>

                <RadioGroup value={canTouchType || ""} onValueChange={(v) => setCanTouchType(v as TouchTyper)}>
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="yes" id="yes" className="w-5 h-5" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer">
                      <p className="text-xl font-semibold text-foreground">Yes, I can touch type</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="no" id="no" className="w-5 h-5" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer">
                      <p className="text-xl font-semibold text-foreground">No, I look at the keyboard</p>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handleTouchTypeSubmit} 
                  disabled={!canTouchType}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater text-lg py-6"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "share" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Share Your Data?</h2>
                <p className="text-lg text-muted-foreground">
                  Help improve keyboard layouts for everyone
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="text-xl font-semibold text-accent">What Data We Collect:</h3>
                  <ul className="space-y-2 text-base text-foreground/80">
                    <li>• Reaction times for each key press</li>
                    <li>• Time between consecutive keys in sequences</li>
                    <li>• Typing accuracy metrics</li>
                    <li>• Keyboard layout type</li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic pt-2">
                    All data is anonymized and used solely for research purposes. 
                    No personal information is stored.
                  </p>
                </div>

                <RadioGroup value={shareData || ""} onValueChange={(v) => setShareData(v as ShareData)}>
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="yes" id="share-yes" className="w-5 h-5" />
                    <Label htmlFor="share-yes" className="flex-1 cursor-pointer">
                      <p className="text-xl font-semibold text-foreground">Yes, share my data with the project</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-wave cursor-pointer">
                    <RadioGroupItem value="no" id="share-no" className="w-5 h-5" />
                    <Label htmlFor="share-no" className="flex-1 cursor-pointer">
                      <p className="text-xl font-semibold text-foreground">No, keep data locally (I can export it later)</p>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handleShareSubmit} 
                  disabled={!shareData}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater text-lg py-6"
                >
                  Start Typing Test
                </Button>
              </div>
            </div>
          )}

          {step === "test" && (
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-accent">Typing Test</h2>
                <p className="text-lg text-muted-foreground">
                  Type the characters as quickly and accurately as possible
                </p>
              </div>

              <div className="space-y-8">
                <div className="text-center space-y-6">
                  <p className="text-base text-muted-foreground">
                    Press <kbd className="px-3 py-1.5 bg-card rounded border-2 border-border text-foreground font-mono">Space</kbd> to start • 
                    Press <kbd className="px-3 py-1.5 bg-card rounded border-2 border-border text-foreground font-mono ml-1">Esc</kbd> to stop
                  </p>
                  
                  <div className="text-9xl font-bold text-primary my-16 animate-glow">
                    A
                  </div>
                  
                  <p className="text-lg text-muted-foreground">
                    The test will run for approximately 30 seconds
                  </p>
                </div>

                <div className="text-center text-base text-muted-foreground">
                  <p>Focus on accuracy first, then speed will follow naturally</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCollection;
