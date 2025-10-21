import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in space-y-12">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-primary mb-4 animate-float">
                404
              </h1>
              <h2 className="text-4xl font-semibold text-accent">
                Page Not Found
              </h2>
              <p className="text-xl text-aqua-light max-w-2xl mx-auto">
                The page you're looking for seems to have drifted away into the digital depths. 
                Don't worry, we'll help you navigate back to calmer waters.
              </p>
            </div>

            <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐟</div>
                  <h3 className="text-xl font-semibold text-accent mb-2">
                    Lost in the Digital Ocean
                  </h3>
                  <p className="text-muted-foreground">
                    This feature is still swimming in development waters. 
                    Check back soon as we continue building the perfect typing experience!
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Return to Home
                  </Button>
                  <Button 
                    onClick={() => navigate('/collect')}
                    variant="outline"
                    className="w-full"
                  >
                    Take a Test
                  </Button>
                </div>
              </div>
            </Card>

            <div className="text-sm text-muted-foreground">
              <p>If you believe this is an error, please let us know!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;