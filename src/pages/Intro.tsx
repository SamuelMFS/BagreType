import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Target, Brain, Keyboard, GraduationCap, Database, Zap } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";
import ScrollIndicator from "@/components/ScrollIndicator";

const Intro = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useLocalization();

  const features = [
    {
      icon: Target,
      title: t('intro.features.dataCollection.title'),
      description: t('intro.features.dataCollection.description'),
      color: "text-blue-400"
    },
    {
      icon: Brain,
      title: t('intro.features.mlAnalysis.title'),
      description: t('intro.features.mlAnalysis.description'),
      color: "text-purple-400"
    },
    {
      icon: Keyboard,
      title: t('intro.features.customLayouts.title'),
      description: t('intro.features.customLayouts.description'),
      color: "text-green-400"
    },
    {
      icon: GraduationCap,
      title: t('intro.features.learnPractice.title'),
      description: t('intro.features.learnPractice.description'),
      color: "text-orange-400"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: t('intro.benefits.fasterTyping.title'),
      description: t('intro.benefits.fasterTyping.description')
    },
    {
      icon: Database,
      title: t('intro.benefits.contributeToScience.title'),
      description: t('intro.benefits.contributeToScience.description')
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
      
      <div className="container mx-auto px-4 max-w-6xl relative" style={{ zIndex: 10 }}>
        <div className="animate-fade-in space-y-16">
          
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-8xl font-bold text-primary animate-float">
                {t('intro.title')}
              </h1>
              <p className="text-3xl text-aqua-light font-light max-w-4xl mx-auto leading-relaxed">
                {t('intro.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="ocean"
                size="lg"
                onClick={() => navigate(`/${lang}/collect`)}
                className="group text-lg px-8 py-6 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                {t('intro.startJourney')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(`/${lang}/learn`)}
                className="text-lg px-8 py-6"
              >
                {t('intro.learnTouchTyping')}
              </Button>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">{t('intro.howItWorks')}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('intro.howItWorksDescription')}
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
              <h2 className="text-4xl font-bold text-accent mb-4">{t('intro.whyChoose')}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('intro.whyChooseDescription')}
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
              <h2 className="text-3xl font-bold text-accent">{t('intro.readyToTransform')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('intro.readyToTransformDescription')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="ocean"
                size="lg"
                onClick={() => navigate(`/${lang}/collect`)}
                className="group text-lg px-8 py-6 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                {t('intro.getStartedNow')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-wave" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(`/${lang}/learn`)}
                className="text-lg px-8 py-6"
              >
                {t('intro.learnFirst')}
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
