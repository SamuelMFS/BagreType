import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Bubbles from "@/components/Bubbles";
import FloatingParticles from "@/components/FloatingParticles";
import OceanDepthBackground from "@/components/OceanDepthBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Target, Brain, Keyboard, GraduationCap, Database, Zap } from "lucide-react";
import ScrollIndicator from "@/components/ScrollIndicator";

const Intro = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Data Collection",
      description: "We measure your typing patterns and reaction times to understand your unique typing behavior.",
      color: "text-blue-400"
    },
    {
      icon: Brain,
      title: "ML Analysis",
      description: "Our algorithm analyzes linguistic patterns across languages to optimize layout efficiency.",
      color: "text-purple-400"
    },
    {
      icon: Keyboard,
      title: "Custom Layouts",
      description: "Generate universal or language-specific keyboards tailored to your specific needs.",
      color: "text-green-400"
    },
    {
      icon: GraduationCap,
      title: "Learn & Practice",
      description: "Master new layouts through gamified lessons and interactive practice sessions.",
      color: "text-orange-400"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Faster Typing",
      description: "Increase your typing speed by up to 40% with optimized layouts"
    },
    {
      icon: Database,
      title: "Contribute to Science",
      description: "Help build better models for everyone with anonymized data"
    }
  ];

  // 3D Card Component
  const Card3D = ({ children, className = "" }) => {
    const [transform, setTransform] = useState("");
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
    };

    const handleMouseLeave = () => {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    };

    return (
      <div
        ref={cardRef}
        className={`transition-transform duration-300 ease-out ${className}`}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <OceanDepthBackground />
      <Bubbles />
      <FloatingParticles />
      
      <div className="container mx-auto px-4 max-w-6xl relative" style={{ zIndex: 10 }}>
        <div className="animate-fade-in space-y-16">
          
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-8xl font-bold text-primary animate-float">
                BagreType
              </h1>
              <p className="text-3xl text-aqua-light font-light max-w-4xl mx-auto leading-relaxed">
                Discover the most efficient keyboard layouts through 
                <span className="text-primary font-semibold"> machine learning</span> and 
                <span className="text-primary font-semibold"> human data</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="ocean"
                size="lg"
                onClick={() => navigate("/collect")}
                className="group text-lg px-8 py-6 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/learn")}
                className="text-lg px-8 py-6"
              >
                Learn Touch Typing
              </Button>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our four-step process transforms your typing experience through data-driven optimization
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card3D key={index}>
                    <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Card3D>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">Why Choose BagreType?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're a programmer, multilingual writer, or just curious about typing efficiency
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="p-8 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 h-full shadow-lg hover:shadow-2xl">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-primary mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-accent">Ready to Transform Your Typing?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who have already optimized their typing experience
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="ocean"
                size="lg"
                onClick={() => navigate("/collect")}
                className="group text-lg px-8 py-6 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/learn")}
                className="text-lg px-8 py-6"
              >
                Learn First
              </Button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default Intro;
