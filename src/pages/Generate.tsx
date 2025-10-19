import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";

const Generate = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-float">
              Generate Keyboard Layout
            </h1>
            <p className="text-2xl text-aqua-light">
              Create optimized layouts tailored to your needs
            </p>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-semibold text-accent">Custom Layout Generation</h2>
              <p className="text-lg text-muted-foreground">
                Coming soon - ML-powered keyboard layout optimization
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground/90">
                Generate custom keyboard layouts optimized for:
              </p>
              <ul className="space-y-3 text-lg text-foreground/80 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Specific programming languages (C, Python, JavaScript, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Natural languages (English, Portuguese, Spanish, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Your own custom text or documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>Universal layouts that work across multiple languages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
