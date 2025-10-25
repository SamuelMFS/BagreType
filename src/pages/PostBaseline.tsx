import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LightRays from "@/components/LightRays";
import Bubbles from "@/components/Bubbles";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingDown, Brain, Rocket, Zap, Target } from "lucide-react";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useLocalization } from "@/hooks/useLocalization";

const PostBaseline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useParams();
  const { t } = useLocalization();
  const [isVisible, setIsVisible] = useState(false);
  const [baselineResults, setBaselineResults] = useState<{ wpm: number; accuracy: number } | null>(null);

  useEffect(() => {
    // Get baseline results from location state or localStorage
    const results = location.state?.baselineResults || {
      wpm: parseInt(localStorage.getItem('baseline_wpm') || '0'),
      accuracy: parseInt(localStorage.getItem('baseline_accuracy') || '0')
    };
    
    if (results.wpm > 0 && results.accuracy > 0) {
      setBaselineResults(results);
    }
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [location.state]);

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

  const expectations = [
    {
      icon: TrendingDown,
      title: t('postBaseline.expectations.speedDrop.title'),
      description: t('postBaseline.expectations.speedDrop.description'),
      color: "text-orange-400"
    },
    {
      icon: Brain,
      title: t('postBaseline.expectations.neuralRewiring.title'),
      description: t('postBaseline.expectations.neuralRewiring.description'),
      color: "text-purple-400"
    },
    {
      icon: Rocket,
      title: t('postBaseline.expectations.skyrocketSpeed.title'),
      description: t('postBaseline.expectations.skyrocketSpeed.description'),
      color: "text-green-400"
    }
  ];

  const handleContinue = () => {
    // Mark that user has seen this page
    localStorage.setItem('bagre-post-baseline-seen', 'true');
    navigate(`/${language}/lessons`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 max-w-6xl relative" style={{ zIndex: 10 }}>
        <div className={`animate-fade-in space-y-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-primary animate-float drop-shadow-[0_2px_10px_hsl(var(--primary)/0.5)]">
                {t('postBaseline.title')}
              </h1>
              <p className="text-2xl text-aqua-light font-light max-w-4xl mx-auto leading-relaxed">
                {t('postBaseline.subtitle')}
              </p>
            </div>
          </div>

          {/* Baseline Results Section */}
          {baselineResults && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-accent mb-4">{t('postBaseline.baselineResults.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t('postBaseline.baselineResults.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card3D>
                  <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{t('postBaseline.baselineResults.typingSpeed')}</h3>
                        <p className="text-3xl font-bold text-primary">{baselineResults.wpm}</p>
                        <p className="text-muted-foreground">{t('postBaseline.baselineResults.wordsPerMinute')}</p>
                      </div>
                    </div>
                  </Card>
                </Card3D>

                <Card3D>
                  <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{t('postBaseline.baselineResults.accuracy')}</h3>
                        <p className="text-3xl font-bold text-primary">{baselineResults.accuracy}%</p>
                        <p className="text-muted-foreground">{t('postBaseline.baselineResults.characterAccuracy')}</p>
                      </div>
                    </div>
                  </Card>
                </Card3D>
              </div>
            </div>
          )}

          {/* Touch Typing Introduction */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">{t('postBaseline.touchTyping.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('postBaseline.touchTyping.description')}
              </p>
            </div>

            {/* Hand GIF Section */}
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-card/20 backdrop-blur-md rounded-2xl border border-border/30 flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-bounce">👋</div>
                  <p className="text-lg text-muted-foreground">{t('postBaseline.handGifPlaceholder')}</p>
                  <p className="text-sm text-muted-foreground/70">{t('postBaseline.handGifNote')}</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6 text-xl leading-relaxed">
                <p className="text-foreground">
                  {t('postBaseline.touchTyping.bumpExplanation')}
                </p>
                <p className="text-foreground">
                  {t('postBaseline.touchTyping.gamerJoke')}
                </p>
                <p className="text-foreground/90">
                  {t('postBaseline.touchTyping.choreography')}
                </p>
              </div>
            </div>
          </div>

          {/* Expectations Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-accent mb-4">{t('postBaseline.expectations.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('postBaseline.expectations.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {expectations.map((expectation, index) => {
                const Icon = expectation.icon;
                return (
                  <Card3D key={index}>
                    <Card className="p-6 bg-card/90 backdrop-blur-md border-border/50 hover:bg-card/95 transition-all duration-300 group h-full shadow-lg hover:shadow-2xl">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${expectation.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">{expectation.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{expectation.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Card3D>
                );
              })}
            </div>
          </div>

          {/* Final Encouragement */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <p className="text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                {t('postBaseline.encouragement.piano')}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('postBaseline.encouragement.expert')}
              </p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '0ms' }}>
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-accent/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '150ms' }}>
                <div className="w-4 h-4 bg-accent rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-bounce flex items-center justify-center" style={{ animationDelay: '300ms' }}>
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="pt-8">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="group text-xl px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
              >
                {t('postBaseline.encouragement.button')}
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

export default PostBaseline;
