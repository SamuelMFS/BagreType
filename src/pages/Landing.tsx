import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bubbles from "@/components/Bubbles";
import LightRays from "@/components/LightRays";
import FloatingParticles from "@/components/FloatingParticles";
import SwimmingFish from "@/components/SwimmingFish";

const Landing = () => {
  const [showLogo, setShowLogo] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
      setTimeout(() => {
        navigate("/intro");
      }, 600);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div
        className={`text-center transition-all duration-1000 ${
          showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative">
          <h1 className="text-8xl font-bold text-primary animate-glow mb-4">
            BagreType
          </h1>
          <p className="text-2xl text-aqua-light animate-float">
            🐟 Discover Your Perfect Keyboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
