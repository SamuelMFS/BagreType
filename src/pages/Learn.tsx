import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";

const Learn = () => {
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
              Learn Touch Typing
            </h1>
            <p className="text-2xl text-aqua-light">
              Master the art of typing without looking at the keyboard
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-accent text-center">Why Learn Touch Typing?</h2>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Touch typing is a skill that dramatically improves your typing speed and accuracy. 
                With just <span className="text-primary font-semibold">30 minutes of practice per day</span>, 
                you can increase your WPM (words per minute) from 30-40 to 60-100+.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">2-3x</p>
                <p className="text-base text-foreground/80">Typing speed increase</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">30min</p>
                <p className="text-base text-foreground/80">Daily practice needed</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">2-4wk</p>
                <p className="text-base text-foreground/80">To become proficient</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground italic text-center">
              Many people find the learning process enjoyable through gamified typing practice, 
              similar to Monkeytype or TypeRacer.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-accent">Get Started</h2>
              <p className="text-lg text-muted-foreground">
                First, let's see your current typing speed
              </p>
            </div>

            <p className="text-lg text-foreground/90 text-center">
              Before we begin our learning journey, we'll test your current typing speed. 
              This baseline will help track your progress as you learn.
            </p>

            <div className="text-center space-y-6 py-8">
              <p className="text-2xl font-semibold text-accent">Baseline Test</p>
              <p className="text-lg text-muted-foreground">
                Type a 30-word passage as quickly and accurately as you can
              </p>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater text-lg px-8 py-6"
              >
                Start Baseline Test
              </Button>
            </div>

            <div className="text-center text-base text-muted-foreground">
              <p>After the test, you'll begin your personalized learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
