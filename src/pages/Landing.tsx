import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "@/components/SplitText";

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
      
      <div
        className={`text-center transition-all duration-1000 ${
          showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative">
          <SplitText 
            className="text-8xl font-bold text-primary mb-4"
            animation="fadeInUp"
            delay={500}
            stagger={0.08}
            duration={0.8}
          >
            BagreType
          </SplitText>
          <SplitText 
            className="text-2xl text-aqua-light"
            animation="fadeInUp"
            delay={1200}
            stagger={0.05}
            duration={0.6}
          >
            Discover Your Perfect Keyboard
          </SplitText>
        </div>
      </div>
    </div>
  );
};

export default Landing;
