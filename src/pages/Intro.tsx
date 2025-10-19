import { useNavigate } from "react-router-dom";
import Bubbles from "@/components/Bubbles";
import FloatingParticles from "@/components/FloatingParticles";
import OceanDepthBackground from "@/components/OceanDepthBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <OceanDepthBackground />
      <Bubbles />
      <FloatingParticles />
      
      <div className="container mx-auto px-4 max-w-3xl relative" style={{ zIndex: 10 }}>
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-7xl font-bold text-primary animate-float">
              Welcome to BagreType
            </h1>
            <p className="text-2xl text-aqua-light">
              A machine learning system to discover the most efficient keyboard layouts
            </p>
          </div>

          <div className="space-y-8 text-foreground/90 text-lg">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-accent">What is BagreType?</h2>
              <p>
                BagreType combines <span className="text-primary font-semibold">machine learning</span>, 
                <span className="text-primary font-semibold"> linguistic analysis</span>, and 
                <span className="text-primary font-semibold"> human data collection</span> to create keyboard 
                layouts that maximize typing speed and comfort.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-accent">How It Works:</h3>
              <div className="space-y-3 pl-4">
                <p>
                  <span className="text-primary font-semibold">🎯 Data Collection:</span> We measure typing costs by recording your reaction times for different keys and sequences
                </p>
                <p>
                  <span className="text-primary font-semibold">🧠 ML Analysis:</span> Our algorithm analyzes linguistic patterns across languages to optimize layout efficiency
                </p>
                <p>
                  <span className="text-primary font-semibold">⌨️ Custom Layouts:</span> Generate universal or language-specific keyboards tailored to your needs
                </p>
                <p>
                  <span className="text-primary font-semibold">📚 Learn & Practice:</span> Master new layouts through gamified lessons and practice sessions
                </p>
              </div>
            </div>

            <p className="text-muted-foreground italic text-center text-xl">
              Whether you're a programmer, multilingual writer, or just curious about typing efficiency, 
              BagreType adapts to your unique needs.
            </p>

            <div className="flex justify-center pt-8">
              <Button
                variant="ocean"
                size="lg"
                onClick={() => navigate("/collect")}
                className="group text-lg px-8 py-6 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-accent">🎓 Learn Touch Typing</h3>
                <p className="text-foreground/80">
                  Master touch typing through our gamified Duolingo-style learning path. 
                  Progress through lessons finger by finger, key by key.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-accent">🔬 Contribute to Science</h3>
                <p className="text-foreground/80">
                  Your typing data helps us build better models. All data is anonymized 
                  and used to improve keyboard efficiency for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
