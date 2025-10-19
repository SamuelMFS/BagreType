import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Practice = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <Bubbles />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
              Typing Practice
            </h1>
            <p className="text-xl text-aqua-light">
              Improve your skills with free practice sessions
            </p>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-border shadow-underwater">
            <CardHeader>
              <CardTitle className="text-accent">Practice Mode</CardTitle>
              <CardDescription className="text-muted-foreground">
                Coming soon - A Monkeytype-style practice environment with BagreType's underwater theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Practice mode will include:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Real-time WPM and accuracy tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Various text options (quotes, code, custom text)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Upload your own documents to practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Beautiful underwater-themed interface</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;
