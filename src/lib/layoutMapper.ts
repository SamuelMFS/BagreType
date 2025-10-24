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

const QWERTY_SEQUENCE = [
  // Chapter 1: Index Fingers (F J R U N V T Y G H B M)
  28, 31, 16, 19, 41, 39, 17, 18, 29, 30, 40, 42,
  // Chapter 2: Middle Fingers (D K E I C ,)
  27, 32, 15, 20, 38, 43,
  // Chapter 3: Ring Fingers (S L W O X .)
  26, 33, 14, 21, 37, 44,
  // Chapter 4: Pinky Fingers (A ; Q P Z /)
  25, 34, 13, 22, 36, 45,
  // Chapter 5: Numbers (1 0 2 9 3 8 4 7 5 6)
  1, 10, 2, 9, 3, 8, 4, 7, 5, 6,
  // Chapter 5: Symbols (! @ # $ % ^ & * ( ))
  1, 10, 2, 9, 3, 8, 4, 7, 5, 6
];

export function generateLearningSequence(layoutString: string): { char: string; isSymbol: boolean }[] {
  const sequence: { char: string; isSymbol: boolean }[] = [];
  
  QWERTY_SEQUENCE.forEach((position, index) => {
    const char = layoutString[position - 1];
    if (char) {
      // First 30 positions are letters, next 10 are numbers, last 10 are symbols
      const isSymbol = index >= 40; // Positions 40-49 are symbols
      sequence.push({ char, isSymbol });
    }
  });
  
  return sequence;
}

export function createChaptersForLayout(layoutString: string): Chapter[] {
  const sequence = generateLearningSequence(layoutString);
  
  // Helper function to get symbol for a number
  const getSymbolForNumber = (num: string): string => {
    const symbolMap: Record<string, string> = {
      '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
      '6': '^', '7': '&', '8': '*', '9': '(', '0': ')'
    };
    return symbolMap[num] || num;
  };
  
  return [
    {
      id: 1,
      title: "Index Fingers",
      depth: "5m",
      description: "Master your index fingers",
      lessons: [
        ...sequence.slice(0, 12).map((item, index) => ({
          id: item.char.toLowerCase(),
          type: 'letter' as const,
          letter: item.char.toUpperCase(),
          completed: false,
          locked: index > 0,
          isCurrent: index === 0
        })),
        {
          id: "test1",
          type: 'test' as const,
          title: `${sequence.slice(0, 12).map(item => item.char).join('').toUpperCase()} Final Test`,
          completed: false,
          locked: true,
          isCurrent: false
        }
      ]
    },
    {
      id: 2,
      title: "Middle Fingers", 
      depth: "100m",
      description: "Extend your middle fingers",
      lessons: [
        ...sequence.slice(12, 18).map((item, index) => ({
          id: item.char.toLowerCase(),
          type: 'letter' as const,
          letter: item.char.toUpperCase(),
          completed: false,
          locked: true,
          isCurrent: false
        })),
        {
          id: "test2",
          type: 'test' as const,
          title: `${sequence.slice(12, 18).map(item => item.char).join('').toUpperCase()} Final Test`,
          completed: false,
          locked: true,
          isCurrent: false
        }
      ]
    },
    {
      id: 3,
      title: "Ring Fingers",
      depth: "200m", 
      description: "Master your ring fingers",
      lessons: [
        ...sequence.slice(18, 24).map((item, index) => ({
          id: item.char.toLowerCase(),
          type: 'letter' as const,
          letter: item.char.toUpperCase(),
          completed: false,
          locked: true,
          isCurrent: false
        })),
        {
          id: "test3",
          type: 'test' as const,
          title: `${sequence.slice(18, 24).map(item => item.char).join('').toUpperCase()} Final Test`,
          completed: false,
          locked: true,
          isCurrent: false
        }
      ]
    },
    {
      id: 4,
      title: "Pinky Fingers",
      depth: "300m",
      description: "Challenge your pinky fingers", 
      lessons: [
        ...sequence.slice(24, 30).map((item, index) => ({
          id: item.char.toLowerCase(),
          type: 'letter' as const,
          letter: item.char.toUpperCase(),
          completed: false,
          locked: true,
          isCurrent: false
        })),
        {
          id: "test4",
          type: 'test' as const,
          title: `${sequence.slice(24, 30).map(item => item.char).join('').toUpperCase()} Final Test`,
          completed: false,
          locked: true,
          isCurrent: false
        }
      ]
    },
    {
      id: 5,
      title: "Numbers & Symbols",
      depth: "400m",
      description: "Master numbers and symbols",
      lessons: [
        // Always start with shift keys
        { id: "lshift", type: 'letter', letter: 'L⇧', completed: false, locked: true, isCurrent: false },
        { id: "rshift", type: 'letter', letter: 'R⇧', completed: false, locked: true, isCurrent: false },
        // Numbers (positions 30-39)
        ...sequence.slice(30, 40).map((item, index) => ({
          id: `num-${item.char}`,
          type: 'letter' as const,
          letter: item.char,
          completed: false,
          locked: true,
          isCurrent: false
        })),
        // Symbols (positions 40-49)
        ...sequence.slice(40, 50).map((item, index) => ({
          id: `sym-${getSymbolForNumber(item.char)}`,
          type: 'letter' as const,
          letter: getSymbolForNumber(item.char),
          completed: false,
          locked: true,
          isCurrent: false
        })),
        {
          id: "test5",
          type: 'test' as const,
          title: 'Numbers & Symbols Final Test',
          completed: false,
          locked: true,
          isCurrent: false
        }
      ]
    }
  ];
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
