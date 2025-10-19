import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";

const Practice = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <Bubbles />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Typing Practice
            </h1>
            <p className="text-2xl text-aqua-light">
              Improve your skills with free practice sessions
            </p>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-accent">Practice Mode</h2>
              <p className="text-lg text-muted-foreground">
                Coming soon - A Monkeytype-style practice environment with BagreType's underwater theme
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground/90">
                Practice mode will include:
              </p>
              <ul className="space-y-3 text-lg text-foreground/80 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Real-time WPM and accuracy tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Various text options (quotes, code, custom text)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Upload your own documents to practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Beautiful underwater-themed interface</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
