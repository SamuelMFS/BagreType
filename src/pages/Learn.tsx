import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Learn = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <Bubbles />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
              Learn Touch Typing
            </h1>
            <p className="text-xl text-aqua-light">
              Master the art of typing without looking at the keyboard
            </p>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-border shadow-underwater mb-8">
            <CardHeader>
              <CardTitle className="text-accent">Why Learn Touch Typing?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Touch typing is a skill that dramatically improves your typing speed and accuracy. 
                With just <strong className="text-primary">30 minutes of practice per day</strong>, 
                you can increase your WPM (words per minute) from 30-40 to 60-100+.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary mb-2">2-3x</p>
                  <p className="text-sm text-foreground/80">Typing speed increase</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary mb-2">30min</p>
                  <p className="text-sm text-foreground/80">Daily practice needed</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary mb-2">2-4wk</p>
                  <p className="text-sm text-foreground/80">To become proficient</p>
                </div>
              </div>

              <p className="text-muted-foreground italic">
                Many people find the learning process enjoyable through gamified typing practice, 
                similar to Monkeytype or TypeRacer.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border shadow-underwater">
            <CardHeader>
              <CardTitle className="text-accent">Get Started</CardTitle>
              <CardDescription className="text-muted-foreground">
                First, let's see your current typing speed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground/90">
                Before we begin our learning journey, we'll test your current typing speed. 
                This baseline will help track your progress as you learn.
              </p>

              <div className="bg-secondary/20 p-6 rounded-lg border border-border text-center">
                <p className="text-lg font-semibold text-accent mb-4">Baseline Test</p>
                <p className="text-muted-foreground mb-6">
                  Type a 30-word passage as quickly and accurately as you can
                </p>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-underwater"
                >
                  Start Baseline Test
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>After the test, you'll begin your personalized learning journey</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Learn;
