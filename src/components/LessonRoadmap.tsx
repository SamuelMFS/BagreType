import { useScrollProgress } from "@/contexts/ScrollContext";

interface LessonNode {
  id: string;
  key: string;
  chapter: number;
  completed: boolean;
}

const LessonRoadmap = () => {
  const scrollProgress = useScrollProgress();
  
  // Calculate color values based on scroll depth
  const hue = 200; // Blue hue
  const saturation = Math.max(40, 90 - scrollProgress * 50); // Less saturated as we go deeper
  const lightness = Math.max(35, 65 - scrollProgress * 30); // Darker as we go deeper

  // Sample data - will be replaced with actual lesson data
  const chapters = [
    {
      id: 1,
      name: "Index Finger",
      depth: "100m",
      nodes: [
        { id: "f", key: "F", chapter: 1, completed: false },
        { id: "j", key: "J", chapter: 1, completed: false },
        { id: "r", key: "R", chapter: 1, completed: false },
        { id: "u", key: "U", chapter: 1, completed: false },
      ]
    },
    {
      id: 2,
      name: "Middle Finger",
      depth: "200m",
      nodes: [
        { id: "d", key: "D", chapter: 2, completed: false },
        { id: "k", key: "K", chapter: 2, completed: false },
        { id: "e", key: "E", chapter: 2, completed: false },
        { id: "i", key: "I", chapter: 2, completed: false },
      ]
    },
    {
      id: 3,
      name: "Ring Finger",
      depth: "300m",
      nodes: [
        { id: "s", key: "S", chapter: 3, completed: false },
        { id: "l", key: "L", chapter: 3, completed: false },
        { id: "w", key: "W", chapter: 3, completed: false },
        { id: "o", key: "O", chapter: 3, completed: false },
      ]
    },
    {
      id: 4,
      name: "Pinky Finger",
      depth: "400m",
      nodes: [
        { id: "a", key: "A", chapter: 4, completed: false },
        { id: "semicolon", key: ";", chapter: 4, completed: false },
        { id: "q", key: "Q", chapter: 4, completed: false },
        { id: "p", key: "P", chapter: 4, completed: false },
      ]
    },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12">
      {chapters.map((chapter, chapterIdx) => (
        <div key={chapter.id} className="relative mb-20">
          {/* Chapter Divider */}
          {chapterIdx > 0 && (
            <div className="mb-12 animate-fade-in">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-2" />
              <p className="text-center text-sm text-primary/70 font-medium">
                Depth: {chapter.depth} — {chapter.name} Chapter
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-2" />
            </div>
          )}

          {/* Nodes in zigzag pattern */}
          <div className="space-y-8">
            {chapter.nodes.map((node, nodeIdx) => {
              const isLeft = nodeIdx % 2 === 0;
              const offsetClass = isLeft ? "mr-auto ml-8" : "ml-auto mr-8";
              
              return (
                <div
                  key={node.id}
                  className={`relative ${offsetClass} w-fit animate-fade-in`}
                  style={{ animationDelay: `${nodeIdx * 0.1}s` }}
                >
                  {/* Connecting line to next node */}
                  {nodeIdx < chapter.nodes.length - 1 && (
                    <div
                      className="absolute top-1/2 h-20 w-px bg-gradient-to-b from-primary/40 to-accent/40"
                      style={{
                        left: isLeft ? "50%" : "50%",
                        transform: `translateX(-50%) translateY(50%) rotate(${isLeft ? "15deg" : "-15deg"})`,
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <div
                    className="relative group cursor-pointer"
                  >
                    <div 
                      className="absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-glow-pulse"
                      style={{
                        background: `hsl(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
                      }}
                    />
                    <div 
                      className="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-2 shadow-underwater group-hover:scale-110 transition-all duration-700"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness + 5}%) 0%, hsl(${hue + 20}, ${saturation - 10}%, ${lightness - 5}%) 100%)`,
                        borderColor: `hsl(${hue}, ${saturation}%, ${lightness - 10}%, 0.5)`,
                        color: lightness > 50 ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
                        boxShadow: `0 0 20px hsl(${hue}, ${saturation}%, ${lightness}%, 0.4), inset 0 2px 8px hsl(${hue}, ${saturation}%, ${lightness + 10}%, 0.3)`,
                      }}
                    >
                      {node.key}
                    </div>
                  </div>

                  {/* Optional label */}
                  <p className="text-center text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn {node.key}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Connecting line to next chapter */}
          {chapterIdx < chapters.length - 1 && (
            <div className="h-16 w-px bg-gradient-to-b from-accent/40 to-transparent mx-auto mt-8" />
          )}
        </div>
      ))}

      {/* Ocean floor indicator */}
      <div className="text-center mt-20 animate-fade-in">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-4" />
        <p className="text-accent/80 text-lg font-semibold">Ocean Floor Reached</p>
        <p className="text-muted-foreground text-sm">You've completed the journey!</p>
      </div>
    </div>
  );
};

export default LessonRoadmap;
