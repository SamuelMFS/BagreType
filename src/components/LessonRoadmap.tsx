import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, Lock, BookOpen, Trophy, Star } from "lucide-react";

interface LessonNode {
  id: string;
  type: 'letter' | 'test' | 'special';
  letter?: string;
  title?: string;
  completed: boolean;
  locked: boolean;
  isCurrent: boolean;
}

interface Chapter {
  id: number;
  title: string;
  depth: string;
  description: string;
  lessons: LessonNode[];
}

const LessonRoadmap = () => {
  const navigate = useNavigate();

  // Curve positioning configuration
  const CURVE_POSITIONS = {
    CENTER: 200,
    LEFT: 120,
    RIGHT: 280
  } as const;

  const RIGHT_OFFSET = 245; // Adjust this to move nodes right/left

  // Chapter positioning - each chapter has different lesson counts
  const CHAPTER_OFFSETS = {
    1: 0,    // Index Fingers: 12 lessons
    2: 1500,  // Middle Fingers: 6 lessons (12 * 120 = 1440, but we want overlap)
    3: 2350, // Ring Fingers: 6 lessons  
    4: 3200, // Pinky Fingers: 6 lessons
    5: 4050  // Numbers & Symbols: 22 lessons
  } as const;

  // Duolingo-style learning progression
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Index Fingers",
      depth: "5m",
      description: "Master your index fingers",
      lessons: [
        { id: "f", type: 'letter', letter: 'F', completed: false, locked: false, isCurrent: true },
        { id: "j", type: 'letter', letter: 'J', completed: false, locked: true, isCurrent: false },
        { id: "r", type: 'letter', letter: 'R', completed: false, locked: true, isCurrent: false },
        { id: "u", type: 'letter', letter: 'U', completed: false, locked: true, isCurrent: false },
        { id: "n", type: 'letter', letter: 'N', completed: false, locked: true, isCurrent: false },
        { id: "v", type: 'letter', letter: 'V', completed: false, locked: true, isCurrent: false },
        { id: "t", type: 'letter', letter: 'T', completed: false, locked: true, isCurrent: false },
        { id: "y", type: 'letter', letter: 'Y', completed: false, locked: true, isCurrent: false },
        { id: "g", type: 'letter', letter: 'G', completed: false, locked: true, isCurrent: false },
        { id: "h", type: 'letter', letter: 'H', completed: false, locked: true, isCurrent: false },
        { id: "b", type: 'letter', letter: 'B', completed: false, locked: true, isCurrent: false },
        { id: "m", type: 'letter', letter: 'M', completed: false, locked: true, isCurrent: false },
        { id: "test1", type: 'test', title: 'FJRUNVTYGHBM Final Test', completed: false, locked: true, isCurrent: false }
      ]
    },
    {
      id: 2,
      title: "Middle Fingers",
      depth: "100m",
      description: "Extend your middle fingers",
      lessons: [
        { id: "d", type: 'letter', letter: 'D', completed: false, locked: true, isCurrent: false },
        { id: "k", type: 'letter', letter: 'K', completed: false, locked: true, isCurrent: false },
        { id: "e", type: 'letter', letter: 'E', completed: false, locked: true, isCurrent: false },
        { id: "i", type: 'letter', letter: 'I', completed: false, locked: true, isCurrent: false },
        { id: "c", type: 'letter', letter: 'C', completed: false, locked: true, isCurrent: false },
        { id: "comma", type: 'letter', letter: ',', completed: false, locked: true, isCurrent: false },
        { id: "test2", type: 'test', title: 'DKEIC, Final Test', completed: false, locked: true, isCurrent: false }
      ]
    },
    {
      id: 3,
      title: "Ring Fingers",
      depth: "200m",
      description: "Master your ring fingers",
      lessons: [
        { id: "s", type: 'letter', letter: 'S', completed: false, locked: true, isCurrent: false },
        { id: "l", type: 'letter', letter: 'L', completed: false, locked: true, isCurrent: false },
        { id: "w", type: 'letter', letter: 'W', completed: false, locked: true, isCurrent: false },
        { id: "o", type: 'letter', letter: 'O', completed: false, locked: true, isCurrent: false },
        { id: "x", type: 'letter', letter: 'X', completed: false, locked: true, isCurrent: false },
        { id: "period", type: 'letter', letter: '.', completed: false, locked: true, isCurrent: false },
        { id: "test3", type: 'test', title: 'SLWOX. Final Test', completed: false, locked: true, isCurrent: false }
      ]
    },
    {
      id: 4,
      title: "Pinky Fingers",
      depth: "300m",
      description: "Challenge your pinky fingers",
      lessons: [
        { id: "a", type: 'letter', letter: 'A', completed: false, locked: true, isCurrent: false },
        { id: "semicolon", type: 'letter', letter: ';', completed: false, locked: true, isCurrent: false },
        { id: "q", type: 'letter', letter: 'Q', completed: false, locked: true, isCurrent: false },
        { id: "p", type: 'letter', letter: 'P', completed: false, locked: true, isCurrent: false },
        { id: "z", type: 'letter', letter: 'Z', completed: false, locked: true, isCurrent: false },
        { id: "slash", type: 'letter', letter: '/', completed: false, locked: true, isCurrent: false },
        { id: "test4", type: 'test', title: 'A;QPZ/ Final Test', completed: false, locked: true, isCurrent: false }
      ]
    },
    {
      id: 5,
      title: "Numbers & Symbols",
      depth: "400m",
      description: "Master numbers and symbols",
      lessons: [
        { id: "lshift", type: 'letter', letter: 'L⇧', completed: false, locked: true, isCurrent: false },
        { id: "rshift", type: 'letter', letter: 'R⇧', completed: false, locked: true, isCurrent: false },
        { id: "1", type: 'letter', letter: '1', completed: false, locked: true, isCurrent: false },
        { id: "0", type: 'letter', letter: '0', completed: false, locked: true, isCurrent: false },
        { id: "2", type: 'letter', letter: '2', completed: false, locked: true, isCurrent: false },
        { id: "9", type: 'letter', letter: '9', completed: false, locked: true, isCurrent: false },
        { id: "3", type: 'letter', letter: '3', completed: false, locked: true, isCurrent: false },
        { id: "8", type: 'letter', letter: '8', completed: false, locked: true, isCurrent: false },
        { id: "4", type: 'letter', letter: '4', completed: false, locked: true, isCurrent: false },
        { id: "7", type: 'letter', letter: '7', completed: false, locked: true, isCurrent: false },
        { id: "5", type: 'letter', letter: '5', completed: false, locked: true, isCurrent: false },
        { id: "6", type: 'letter', letter: '6', completed: false, locked: true, isCurrent: false },
        { id: "exclamation", type: 'letter', letter: '!', completed: false, locked: true, isCurrent: false },
        { id: "paren", type: 'letter', letter: ')', completed: false, locked: true, isCurrent: false },
        { id: "at", type: 'letter', letter: '@', completed: false, locked: true, isCurrent: false },
        { id: "paren2", type: 'letter', letter: '(', completed: false, locked: true, isCurrent: false },
        { id: "hash", type: 'letter', letter: '#', completed: false, locked: true, isCurrent: false },
        { id: "asterisk", type: 'letter', letter: '*', completed: false, locked: true, isCurrent: false },
        { id: "dollar", type: 'letter', letter: '$', completed: false, locked: true, isCurrent: false },
        { id: "ampersand", type: 'letter', letter: '&', completed: false, locked: true, isCurrent: false },
        { id: "percent", type: 'letter', letter: '%', completed: false, locked: true, isCurrent: false },
        { id: "caret", type: 'letter', letter: '^', completed: false, locked: true, isCurrent: false },
        { id: "test5", type: 'test', title: 'Numbers & Symbols Final Test', completed: false, locked: true, isCurrent: false }
      ]
    }
  ];

  const getNodeIcon = (node: LessonNode) => {
    if (node.completed) {
      return <CheckCircle className="w-6 h-6" />;
    }
    if (node.locked) {
      return <Lock className="w-4 h-4" />;
    }
    if (node.type === 'test') {
      return <Trophy className="w-5 h-5" />;
    }
    if (node.isCurrent) {
      return <Star className="w-5 h-5" />;
    }
    return <PlayCircle className="w-5 h-5" />;
  };

  const getNodeStyle = (node: LessonNode) => {
    if (node.completed) {
      return 'bg-green-500 border-green-500 text-white shadow-lg';
    }
    if (node.locked) {
      return 'bg-gray-300 border-gray-300 text-gray-500';
    }
    if (node.isCurrent) {
      return 'bg-primary border-primary text-primary-foreground animate-node-glow';
    }
    if (node.type === 'test') {
      return 'bg-purple-500 border-purple-500 text-white shadow-lg';
    }
    return 'bg-blue-400 border-blue-400 text-white shadow-lg';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      {/* Progress Stats - Top */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-accent">{chapters.length}</div>
          <div className="text-xs text-muted-foreground">Chapters</div>
        </Card>
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-primary">~2h</div>
          <div className="text-xs text-muted-foreground">Total Time</div>
        </Card>
            </div>

      {/* Duolingo-style Learning Path */}
      <div className="relative min-h-[6900px]">
        {/* Path SVG */}
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 400 6900"
              preserveAspectRatio="none"
            >
              <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path
            d="M 200 80 Q 120 200 200 320 Q 280 440 200 560 Q 120 680 200 800 Q 280 920 200 1040 Q 120 1160 200 1280 Q 280 1400 200 1520 Q 120 1640 200 1760 Q 280 1880 200 2000 Q 120 2120 200 2240 Q 280 2360 200 2480 Q 120 2600 200 2720 Q 280 2840 200 2960 Q 120 3080 200 3200 Q 280 3320 200 3440 Q 120 3560 200 3680 Q 280 3800 200 3920 Q 120 4040 200 4160 Q 280 4280 200 4400 Q 120 4520 200 4640 Q 280 4760 200 4880 Q 120 5000 200 5120 Q 280 5240 200 5360 Q 120 5480 200 5600 Q 280 5720 200 5840 Q 120 5960 200 6080 Q 280 6200 200 6320 Q 120 6440 200 6560 Q 280 6680 200 6800"
            stroke="url(#path-gradient)"
            strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

        {/* All Lessons in One Path */}
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id}>
            {/* Chapter Header */}
            <div 
              className="absolute left-4 z-10"
              style={{ top: `${80 + CHAPTER_OFFSETS[chapter.id as keyof typeof CHAPTER_OFFSETS] + 20}px` }}
            >
              <Card className="p-4 bg-card/95 backdrop-blur-md border-border/50 shadow-lg w-48">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <h3 className="font-bold text-primary">Chapter {chapter.id}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">Depth: {chapter.depth}</div>
                  <div className="text-lg font-semibold text-accent">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground">{chapter.description}</div>
                </div>
              </Card>
            </div>

            {/* Lesson Nodes for this chapter */}
            {chapter.lessons.map((lesson, lessonIndex) => {
              const totalOffset = chapters.slice(0, chapterIndex).reduce((acc, ch) => acc + ch.lessons.length, 0);
              const nodeIndex = totalOffset + lessonIndex;
              
              // Calculate exact position on the path
              const yPosition = 80 + nodeIndex * 120;
              
              // Get base curve position using pattern: CENTER, LEFT, CENTER, RIGHT, repeat
              const curvePattern = [CURVE_POSITIONS.CENTER, CURVE_POSITIONS.LEFT, CURVE_POSITIONS.CENTER, CURVE_POSITIONS.RIGHT];
              const baseXPosition = curvePattern[nodeIndex % 4];
              
              // Apply right offset to move nodes to the right
              const xPosition = baseXPosition + RIGHT_OFFSET;
              
              return (
                <div
                  key={lesson.id}
                  className="absolute z-20 cursor-pointer group"
                  style={{ 
                    left: `${xPosition}px`,
                    top: `${yPosition}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => !lesson.locked && navigate(`/lesson/${chapter.id}/${lesson.id}`)}
                >
                  {/* Node Circle */}
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${getNodeStyle(lesson)}`}>
                    {lesson.type === 'letter' ? (
                      <span className="text-2xl font-bold">{lesson.letter}</span>
                    ) : (
                      getNodeIcon(lesson)
                    )}
                  </div>

                  {/* Node Label */}
                  {lesson.type === 'test' && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1 text-xs font-medium text-primary whitespace-nowrap">
                        {lesson.title}
                      </div>
                    </div>
                  )}

                  {/* Current Lesson Indicator */}
                  {lesson.isCurrent && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
};

export default LessonRoadmap;
