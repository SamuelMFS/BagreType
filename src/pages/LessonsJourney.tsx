import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import LessonRoadmap from "@/components/LessonRoadmap";

const LessonsJourney = () => {
  useEffect(() => {
    // Ensure we start at the top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="animate-fade-in space-y-12">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Your Typing Journey
            </h1>
            <p className="text-lg text-muted-foreground">
              Descend into the depths and master each key
            </p>
          </div>

          {/* Roadmap */}
          <LessonRoadmap />
        </div>
      </div>
    </div>
  );
};

export default LessonsJourney;
