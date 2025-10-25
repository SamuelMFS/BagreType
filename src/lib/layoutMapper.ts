/**
 * Layout Mapper - Converts keyboard layout strings to learning roadmap sequences
 */

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

export interface LayoutMapping {
  qwerty: string;
  dvorak: string;
  [key: string]: string;
}

export const LAYOUT_STRINGS: LayoutMapping = {
  qwerty: "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./",
  dvorak: "1234567890[]'./pyfgcrl/=aoeuidhtns-;qjkxbmwvz"
};

// Roadmap with exact positions in layout string (0-indexed from 1-based)
// Format: [position, position, ..., 'test', position, ...]
const ROADMAP_SEQUENCE: (number | string)[] = [
  // Chapter 1: Index Fingers (F J R U N V T Y G H B M)
  28, 31, 16, 19, 41, 39, 17, 18, 29, 30, 40, 42, 'test1',
  // Chapter 2: Middle Fingers (D K E I C ,)
  27, 32, 15, 20, 38, 43, 'test2',
  // Chapter 3: Ring Fingers (S L W O X .)
  26, 33, 14, 21, 37, 44, 'test3',
  // Chapter 4: Pinky Fingers (A ; Q P Z /)
  25, 34, 13, 22, 36, 45, 'test4',
  // Chapter 5: Numbers & Symbols
  // First: numbers without shift (1 0 2 9 3 8 4 7 5 6)
  1, 10, 2, 9, 3, 8, 4, 7, 5, 6,
  // Then: shift keys
  'rshift', 'lshift',
  // Then: symbols with shift (! @ # $ % ^ & * ( ))
  'shift-1', 'shift-10', 'shift-2', 'shift-9', 'shift-3', 'shift-8', 'shift-4', 'shift-7', 'shift-5', 'shift-6', 'test5'
];

export function generateRoadmapNodes(layoutString: string): (LessonNode | { type: 'test'; id: string })[] {
  const nodes: (LessonNode | { type: 'test'; id: string })[] = [];
  let letterIndex = 0;
  
  // Map number positions to their symbol equivalents (shifted)
  const symbolMap: Record<number, string> = {
    1: '!', 2: '@', 3: '#', 4: '$', 5: '%',
    6: '^', 7: '&', 8: '*', 9: '(', 10: ')'
  };
  
  ROADMAP_SEQUENCE.forEach((item) => {
    if (typeof item === 'string' && item.startsWith('test')) {
      // It's a test node
      nodes.push({ type: 'test', id: item });
    } else if (typeof item === 'string' && item === 'rshift') {
      // Right shift key
      nodes.push({
        id: 'rshift',
        type: 'letter',
        letter: 'R⇧',
        completed: false,
        locked: letterIndex > 0,
        isCurrent: letterIndex === 0
      });
      letterIndex++;
    } else if (typeof item === 'string' && item === 'lshift') {
      // Left shift key
      nodes.push({
        id: 'lshift',
        type: 'letter',
        letter: 'L⇧',
        completed: false,
        locked: letterIndex > 0,
        isCurrent: letterIndex === 0
      });
      letterIndex++;
    } else if (typeof item === 'string' && item.startsWith('shift-')) {
      // Shift-symbol: get the number from "shift-1" etc
      const num = parseInt(item.replace('shift-', ''));
      const symbol = symbolMap[num] || '';
      if (symbol) {
        nodes.push({
          id: `shift-${num}`,
          type: 'letter',
          letter: symbol,
          completed: false,
          locked: letterIndex > 0,
          isCurrent: letterIndex === 0
        });
        letterIndex++;
      }
    } else if (typeof item === 'number') {
      // It's a position - get the character from layout string (1-indexed to 0-indexed)
      const char = layoutString[item - 1];
      if (char) {
        nodes.push({
          id: char.toLowerCase(),
          type: 'letter',
          letter: char,
          completed: false,
          locked: letterIndex > 0,
          isCurrent: letterIndex === 0
        });
        letterIndex++;
      }
    }
  });
  
  return nodes;
}

export function createChaptersForLayout(layoutString: string, t?: (key: string) => string): Chapter[] {
  const nodes = generateRoadmapNodes(layoutString);
  
  // Split nodes into chapters based on test markers
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Index Fingers",
      depth: "5m",
      description: "Master your index fingers",
      lessons: []
    },
    {
      id: 2,
      title: "Middle Fingers",
      depth: "100m",
      description: "Extend your middle fingers",
      lessons: []
    },
    {
      id: 3,
      title: "Ring Fingers",
      depth: "200m",
      description: "Master your ring fingers",
      lessons: []
    },
    {
      id: 4,
      title: "Pinky Fingers",
      depth: "300m",
      description: "Challenge your pinky fingers",
      lessons: []
    },
    {
      id: 5,
      title: "Numbers & Symbols",
      depth: "400m",
      description: "Master numbers and symbols",
      lessons: []
    }
  ];
  
  let currentChapterIndex = 0;
  let lessonLetterIndex = 0;
  
  nodes.forEach((node) => {
    if (node.type === 'test') {
      // Add test to current chapter
      const testNumber = node.id.match(/\d+/)?.[0];
      chapters[currentChapterIndex].lessons.push({
        id: node.id,
        type: 'test' as const,
        title: t ? `${t('lessons.lesson.test')} ${testNumber}` : `Test ${testNumber}`,
        completed: false,
        locked: true,
        isCurrent: false
      });
      // Move to next chapter
      if (currentChapterIndex < chapters.length - 1) {
        currentChapterIndex++;
        lessonLetterIndex = 0; // Reset for new chapter
      }
    } else if (node.type === 'letter') {
      // Add letter lesson to current chapter
      chapters[currentChapterIndex].lessons.push({
        ...node,
        locked: lessonLetterIndex > 0,
        isCurrent: lessonLetterIndex === 0
      });
      lessonLetterIndex++;
    }
  });
  
  return chapters;
}

export function getLayoutName(layoutString: string): string {
  if (layoutString === LAYOUT_STRINGS.qwerty) {
    return 'qwerty';
  } else if (layoutString === LAYOUT_STRINGS.dvorak) {
    return 'dvorak';
  } else {
    return 'custom';
  }
}
