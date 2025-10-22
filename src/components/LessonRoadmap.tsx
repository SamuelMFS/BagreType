import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, Lock, BookOpen, Trophy, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [skipTarget, setSkipTarget] = useState<{ chapterId: number; lessonId: string } | null>(null);
  const [dailyTimeSpent, setDailyTimeSpent] = useState(0); // in minutes

  // Load lesson progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        let progressData: any[] = [];
        
        if (user) {
          // Load from Supabase for logged-in users
          console.log('Loading progress from Supabase for user:', user.id);
          const { data, error } = await supabase
            .from('lesson_progress')
            .select('chapter_id, lesson_id')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Supabase loading error:', error);
            throw error;
          }
          console.log('Supabase progress data:', data);
          progressData = data || [];
        } else {
          // Load from localStorage for anonymous users
          console.log('Loading progress from localStorage');
          const storedProgress = localStorage.getItem('lesson_progress');
          if (storedProgress) {
            progressData = JSON.parse(storedProgress);
            console.log('localStorage progress data:', progressData);
          }
        }
        
        // Convert to Set of lesson keys
        const completedSet = new Set<string>();
        progressData.forEach(progress => {
          const lessonKey = `${progress.chapter_id}-${progress.lesson_id}`;
          completedSet.add(lessonKey);
          console.log('Added completed lesson:', lessonKey);
        });
        
        console.log('Final completed lessons set:', Array.from(completedSet));
        setCompletedLessons(completedSet);
        
        // Load daily time spent
        await loadDailyTimeSpent();
      } catch (error) {
        console.error('Error loading lesson progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadDailyTimeSpent = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (user) {
          // Load from Supabase for logged-in users
          const { data, error } = await supabase
            .from('lesson_progress')
            .select('created_at')
            .eq('user_id', user.id)
            .gte('created_at', `${today}T00:00:00.000Z`)
            .lt('created_at', `${today}T23:59:59.999Z`);
          
          if (error) throw error;
          
          // Estimate time spent based on completed lessons (assuming ~2 minutes per lesson)
          const timeSpent = (data?.length || 0) * 2;
          setDailyTimeSpent(timeSpent);
        } else {
          // Load from localStorage for anonymous users
          const storedTime = localStorage.getItem(`daily_time_${today}`);
          if (storedTime) {
            setDailyTimeSpent(parseInt(storedTime));
          }
        }
      } catch (error) {
        console.error('Error loading daily time:', error);
      }
    };

    // Function to update daily time when a lesson is completed
    const updateDailyTime = () => {
      const today = new Date().toISOString().split('T')[0];
      const newTime = dailyTimeSpent + 2; // Add 2 minutes for completed lesson
      setDailyTimeSpent(newTime);
      
      // Save to localStorage for anonymous users
      if (!user) {
        localStorage.setItem(`daily_time_${today}`, newTime.toString());
      }
    };
    
    loadProgress();
    
    // Also reload when component becomes visible (user returns from lesson)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, reloading progress...');
        loadProgress();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

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

  // Memoize current lesson to avoid recalculating
  const currentLesson = useMemo(() => {
    // Get all lessons in order
    const allLessons: { chapterId: number; lessonId: string }[] = [];
    chapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        allLessons.push({ chapterId: chapter.id, lessonId: lesson.id });
      });
    });
    
    // Find the furthest completed lesson to determine what's skipped
    let furthestCompletedIndex = -1;
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const lessonKey = `${lesson.chapterId}-${lesson.lessonId}`;
      
      if (completedLessons.has(lessonKey)) {
        furthestCompletedIndex = i;
      }
    }
    
    // Find the first non-completed lesson after the furthest completed one
    for (let i = furthestCompletedIndex + 1; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const lessonKey = `${lesson.chapterId}-${lesson.lessonId}`;
      
      // Check if this lesson's chapter is unlocked
      const lessonChapter = chapters.find(ch => ch.id === lesson.chapterId);
      const lessonPrevChapter = chapters.find(ch => ch.id === lesson.chapterId - 1);
      // Chapter unlocks when the final test is completed, regardless of other lessons
      const prevTestCompleted = lessonPrevChapter ? 
        completedLessons.has(`${lessonPrevChapter.id}-test${lessonPrevChapter.id}`) : true;
      const isLessonChapterUnlocked = !lessonPrevChapter || prevTestCompleted;
      
      if (isLessonChapterUnlocked && !completedLessons.has(lessonKey)) {
        return lesson;
      }
    }
    return null; // All lessons completed
  }, [completedLessons, chapters]);

  // Determine lesson status based on progress - 5 states: Completed, Current, Skipped, Unlocked, Locked
  const getLessonStatus = (chapterId: number, lessonId: string) => {
    const lessonKey = `${chapterId}-${lessonId}`;
    
    // 1. COMPLETED: User did the full lesson
    const isCompleted = completedLessons.has(lessonKey);
    if (isCompleted) {
      return { isCompleted: true, isLocked: false, isCurrent: false, isSkipped: false, isUnlocked: false };
    }
    
    // Find current chapter and previous chapter
    const currentChapter = chapters.find(chapter => chapter.id === chapterId);
    const previousChapter = chapters.find(chapter => chapter.id === chapterId - 1);
    
    if (!currentChapter) {
      return { isCompleted: false, isLocked: true, isCurrent: false, isSkipped: false, isUnlocked: false };
    }
    
    // Check if previous chapter is completed (for chapter unlocking)
    // Chapter unlocks when the final test is completed, regardless of other lessons
    const isPreviousChapterCompleted = !previousChapter || 
      completedLessons.has(`${previousChapter.id}-test${previousChapter.id}`);
    
    // 5. LOCKED: Lessons in chapters ahead of current chapter
    if (!isPreviousChapterCompleted) {
      return { isCompleted: false, isLocked: true, isCurrent: false, isSkipped: false, isUnlocked: false };
    }
    
    const isCurrent = currentLesson && currentLesson.chapterId === chapterId && currentLesson.lessonId === lessonId;
    
    // 2. CURRENT: The next lesson the user should do
    if (isCurrent) {
      return { isCompleted: false, isLocked: false, isCurrent: true, isSkipped: false, isUnlocked: false };
    }
    
    // Check if this lesson is in the current chapter (unlocked)
    const isInCurrentChapter = currentChapter.lessons.some(lesson => lesson.id === lessonId);
    
    // 4. UNLOCKED: Lessons that are available (in current chapter and previous chapters)
    if (isInCurrentChapter) {
      return { isCompleted: false, isLocked: false, isCurrent: false, isSkipped: false, isUnlocked: true };
    }
    
    // 3. SKIPPED: Lessons that are not completed and are behind completed nodes
    // A lesson is skipped if it's between completed lessons
    const isSkipped = () => {
      // Get all lessons in order
      const allLessons: { chapterId: number; lessonId: string }[] = [];
      chapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          allLessons.push({ chapterId: chapter.id, lessonId: lesson.id });
        });
      });
      
      const currentIndex = allLessons.findIndex(l => l.chapterId === chapterId && l.lessonId === lessonId);
      
      // Check if there's a completed lesson after this one
      for (let i = currentIndex + 1; i < allLessons.length; i++) {
        const lesson = allLessons[i];
        const lessonKey = `${lesson.chapterId}-${lesson.lessonId}`;
        if (completedLessons.has(lessonKey)) {
          console.log(`Lesson ${chapterId}-${lessonId} is skipped because ${lessonKey} is completed after it`);
          return true; // This lesson is skipped because there's a completed lesson after it
        }
      }
      
      return false;
    };
    
    if (isSkipped()) {
      console.log(`Marking ${chapterId}-${lessonId} as skipped`);
      return { isCompleted: false, isLocked: false, isCurrent: false, isSkipped: true, isUnlocked: false };
    }
    
    // Default to unlocked for lessons in current chapter
    return { isCompleted: false, isLocked: false, isCurrent: false, isSkipped: false, isUnlocked: true };
  };

  const getNodeIcon = (node: LessonNode, chapterId: number) => {
    const { isCompleted, isLocked, isCurrent, isSkipped, isUnlocked } = getLessonStatus(chapterId, node.id);
    
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6" />;
    }
    if (isLocked) {
      return <Lock className="w-4 h-4" />;
    }
    if (node.type === 'test') {
      return <Trophy className="w-5 h-5" />;
    }
    if (isCurrent) {
      return <PlayCircle className="w-5 h-5" />;
    }
    return <PlayCircle className="w-5 h-5" />;
  };

  const getNodeStyle = (node: LessonNode, chapterId: number) => {
    const { isCompleted, isLocked, isCurrent, isSkipped, isUnlocked } = getLessonStatus(chapterId, node.id);
    
    if (isCompleted) {
      return 'bg-primary border-primary text-primary-foreground shadow-lg'; // Main color for completed
    }
    if (isCurrent) {
      return 'bg-primary border-primary text-primary-foreground animate-node-glow'; // Main color + glow for current
    }
    if (isSkipped) {
      return 'bg-blue-200 border-blue-200 text-blue-600 cursor-pointer'; // Main color (lighter) for skipped
    }
    if (isUnlocked) {
      return 'bg-gray-300 border-gray-300 text-gray-500 cursor-pointer'; // Gray for unlocked
    }
    if (isLocked) {
      return 'bg-gray-300 border-gray-300 text-gray-500'; // Gray for locked
    }
    
    // Default fallback
    return 'bg-gray-300 border-gray-300 text-gray-500';
  };

  // Calculate progress metrics
  const completedCount = completedLessons.size;
  
  // Calculate total number of lessons across all chapters
  const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
  
  // Calculate number of completed chapters (chapters where the final test is completed)
  const completedChapters = chapters.filter(chapter => 
    completedLessons.has(`${chapter.id}-test${chapter.id}`)
  ).length;

  // Find the current lesson position for dynamic line coloring
  const getCurrentLessonPosition = () => {
    // Find the current lesson (the one with glow) across all chapters
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        const { isCurrent } = getLessonStatus(chapter.id, lesson.id);
        if (isCurrent) {
          // Find the index of this lesson in the overall sequence
          let index = 0;
          for (const ch of chapters) {
            for (const l of ch.lessons) {
              if (ch.id === chapter.id && l.id === lesson.id) {
                return index;
              }
              index++;
            }
          }
        }
      }
    }
    return 0;
  };

  const currentLessonPosition = getCurrentLessonPosition();
  const progressPercentage = totalLessons > 0 ? (currentLessonPosition / totalLessons) * 100 : 0;

  const handleSkipConfirm = (confirmed: boolean) => {
    if (confirmed && skipTarget) {
      navigate(`/lesson/${skipTarget.chapterId}/${skipTarget.lessonId}`);
    }
    setShowSkipConfirm(false);
    setSkipTarget(null);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      {/* Progress Stats - Top */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-primary">
            {isLoading ? "..." : `${completedCount}/${totalLessons}`}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-accent">
            {isLoading ? "..." : `${completedChapters}/5`}
          </div>
          <div className="text-xs text-muted-foreground">Chapters</div>
        </Card>
        <Card className="p-4 bg-card/90 backdrop-blur-md border-border/50 text-center">
          <div className="text-2xl font-bold text-primary">
            {isLoading ? "..." : `${dailyTimeSpent}/30`}
          </div>
          <div className="text-xs text-muted-foreground">Minutes Today</div>
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
              <stop offset={`${progressPercentage}%`} stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset={`${progressPercentage}%`} stopColor="hsl(var(--foreground))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.3" />
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
              className={`absolute z-10 ${chapterIndex % 2 === 0 ? 'left-4' : 'right-4'}`}
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
        onClick={() => {
          const { isCompleted, isLocked, isCurrent, isSkipped, isUnlocked } = getLessonStatus(chapter.id, lesson.id);
          
          if (isLocked) {
            return; // Don't allow clicking locked lessons
          }
          
          if (isCompleted || isCurrent || isSkipped) {
            // Direct navigation for completed, current, or skipped lessons
            navigate(`/lesson/${chapter.id}/${lesson.id}`);
          } else if (isUnlocked) {
            // Check if this lesson comes after the current lesson
            const allLessons: { chapterId: number; lessonId: string }[] = [];
            chapters.forEach(chapter => {
              chapter.lessons.forEach(lesson => {
                allLessons.push({ chapterId: chapter.id, lessonId: lesson.id });
              });
            });
            
            const currentLessonIndex = allLessons.findIndex(l => 
              l.chapterId === currentLesson?.chapterId && l.lessonId === currentLesson?.lessonId
            );
            const thisLessonIndex = allLessons.findIndex(l => l.chapterId === chapter.id && l.lessonId === lesson.id);
            
            // Only show skip prompt for lessons that come AFTER the current lesson
            const isAfterCurrent = thisLessonIndex > currentLessonIndex;
            
            if (isAfterCurrent) {
              // Show confirmation for skipping to lessons after current
              setSkipTarget({ chapterId: chapter.id, lessonId: lesson.id });
              setShowSkipConfirm(true);
            } else {
              // Direct navigation for lessons before current (shouldn't happen with current logic, but safety)
              navigate(`/lesson/${chapter.id}/${lesson.id}`);
            }
          }
        }}
                >
                  {/* Node Circle */}
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${getNodeStyle(lesson, chapter.id)}`}>
                    {getLessonStatus(chapter.id, lesson.id).isLocked ? (
                      // Locked lesson: show lock by default, letter on hover
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Lock className="w-6 h-6 group-hover:opacity-0 transition-opacity duration-300" />
                        {lesson.type === 'letter' && (
                          <span className="absolute text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {lesson.letter}
                          </span>
                        )}
                    </div>
                    ) : (
                      // Unlocked lesson: show normal content
                      lesson.type === 'letter' ? (
                        <span className="text-2xl font-bold">{lesson.letter}</span>
                      ) : (
                        getNodeIcon(lesson, chapter.id)
                      )
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

                  {/* Star only on F lesson (first lesson) */}
                  {chapter.id === 1 && lesson.id === 'f' && !getLessonStatus(chapter.id, lesson.id).isCompleted && (
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

      {/* Skip Confirmation Dialog */}
      {showSkipConfirm && skipTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold text-primary mb-4">Skip to Lesson?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to skip to this lesson? You can always come back to previous lessons later.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => handleSkipConfirm(false)}
              >
                No, Continue Sequential
              </Button>
              <Button 
                variant="default" 
                onClick={() => handleSkipConfirm(true)}
              >
                Yes, Skip
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonRoadmap;
