import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Generate = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <Bubbles />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
              Generate Keyboard Layout
            </h1>
            <p className="text-xl text-aqua-light">
              Create optimized layouts tailored to your needs
            </p>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-border shadow-underwater">
            <CardHeader>
              <CardTitle className="text-accent">Custom Layout Generation</CardTitle>
              <CardDescription className="text-muted-foreground">
                Coming soon - ML-powered keyboard layout optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Generate custom keyboard layouts optimized for:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Specific programming languages (C, Python, JavaScript, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Natural languages (English, Portuguese, Spanish, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Your own custom text or documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Universal layouts that work across multiple languages</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generate;
