import { useNavigate } from "react-router-dom";
import Bubbles from "@/components/Bubbles";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <Bubbles />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary animate-float">
              Welcome to BagreType
            </h1>
            <p className="text-xl text-aqua-light">
              A machine learning system to discover the most efficient keyboard layouts
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 shadow-underwater space-y-6 border border-border">
            <h2 className="text-3xl font-semibold text-accent">What is BagreType?</h2>
            
            <div className="space-y-4 text-lg text-foreground/90">
              <p>
                BagreType combines <strong className="text-primary">machine learning</strong>, 
                <strong className="text-primary"> linguistic analysis</strong>, and 
                <strong className="text-primary"> human data collection</strong> to create keyboard 
                layouts that maximize typing speed and comfort.
              </p>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-accent">How It Works:</h3>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">🎯</span>
                    <span><strong>Data Collection:</strong> We measure typing costs by recording your reaction times for different keys and sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">🧠</span>
                    <span><strong>ML Analysis:</strong> Our algorithm analyzes linguistic patterns across languages to optimize layout efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">⌨️</span>
                    <span><strong>Custom Layouts:</strong> Generate universal or language-specific keyboards tailored to your needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📚</span>
                    <span><strong>Learn & Practice:</strong> Master new layouts through gamified lessons and practice sessions</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground italic">
                Whether you're a programmer, multilingual writer, or just curious about typing efficiency, 
                BagreType adapts to your unique needs.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/collect")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary transition-wave">
              <h3 className="text-xl font-semibold text-accent mb-3">🎓 Learn Touch Typing</h3>
              <p className="text-foreground/80">
                Master touch typing through our gamified Duolingo-style learning path. 
                Progress through lessons finger by finger, key by key.
              </p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary transition-wave">
              <h3 className="text-xl font-semibold text-accent mb-3">🔬 Contribute to Science</h3>
              <p className="text-foreground/80">
                Your typing data helps us build better models. All data is anonymized 
                and used to improve keyboard efficiency for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
