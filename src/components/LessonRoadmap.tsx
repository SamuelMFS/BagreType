import { useScrollProgress } from "@/contexts/ScrollContext";

interface LessonNode {
  id: string;
  key: string;
  chapter: number;
  completed: boolean;
}

const LessonRoadmap = () => {
  const scrollProgress = useScrollProgress();

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
          <div className="space-y-6">
            {chapter.nodes.map((node, nodeIdx) => {
              // Create smooth sine wave pattern
              const totalNodes = chapter.nodes.length;
              const progress = nodeIdx / Math.max(totalNodes - 1, 1);
              const xOffset = Math.sin(progress * Math.PI * 2) * 120; // Wider curve
              
              return (
                <div
                  key={node.id}
                  className="relative animate-fade-in"
                  style={{ 
                    animationDelay: `${nodeIdx * 0.1}s`,
                    marginLeft: `calc(50% + ${xOffset}px)`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Curved connecting line to next node */}
                  {nodeIdx < chapter.nodes.length - 1 && (
                    <svg
                      className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none"
                      width="200"
                      height="80"
                      style={{
                        overflow: 'visible',
                      }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${chapter.id}-${nodeIdx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M 100 0 Q 100 40, ${100 + (Math.sin((progress + 0.05) * Math.PI * 2) - Math.sin(progress * Math.PI * 2)) * 120} 80`}
                        stroke={`url(#gradient-${chapter.id}-${nodeIdx})`}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* Node circle */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-700" 
                      style={{
                        animation: 'glow-pulse 3s ease-in-out infinite',
                      }}
                    />
                    <div 
                      className="relative w-20 h-20 rounded-full gradient-aqua flex items-center justify-center text-2xl font-bold text-primary-foreground border-2 border-primary/40 shadow-underwater group-hover:scale-110 transition-all duration-700"
                      style={{
                        boxShadow: 'var(--shadow-underwater)',
                        opacity: 1 - scrollProgress * 0.4,
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
