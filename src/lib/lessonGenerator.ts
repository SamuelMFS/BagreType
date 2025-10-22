// Lesson text generator for typing practice
export interface LessonConfig {
  lessonLetter: string;
  chapterLetters: string[];
  allLearnedLetters: string[];
}

export class LessonGenerator {
  private lessonLetter: string;
  private chapterLetters: string[];
  private allLearnedLetters: string[];

  constructor(config: LessonConfig) {
    this.lessonLetter = config.lessonLetter.toLowerCase();
    this.chapterLetters = config.chapterLetters.map(l => l.toLowerCase());
    this.allLearnedLetters = config.allLearnedLetters.map(l => l.toLowerCase());
  }

  // Generate text for part 1: only lesson letter and spaces
  generatePart1(): string {
    const words: string[] = [];
    let letterCount = 0;
    
    // Generate words until we have 30 letters total
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount); // 1-3 letters, max 30 total
      const word = this.lessonLetter.repeat(wordLength);
      words.push(word);
      letterCount += wordLength;
      
      // Add space if we haven't reached 30 letters yet
      if (letterCount < 30) {
        words.push(' ');
      }
    }
    
    return words.join('');
  }

  // Generate text for part 2: lesson letter + chapter letters
  generatePart2(): string {
    // If no chapter letters available, fall back to part 1
    if (this.chapterLetters.length === 0) {
      return this.generatePart1();
    }
    
    const words: string[] = [];
    let letterCount = 0;
    
    // Generate words until we have 30 letters total
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount); // 1-3 letters, max 30 total
      const word: string[] = [];
      
      // Generate word with lesson letter having higher weight
      for (let i = 0; i < wordLength; i++) {
        const rand = Math.random();
        
        if (rand < 0.5) {
          // 50% chance for lesson letter
          word.push(this.lessonLetter);
        } else {
          // 50% chance for chapter letters
          const randomChapterLetter = this.chapterLetters[Math.floor(Math.random() * this.chapterLetters.length)];
          word.push(randomChapterLetter);
        }
      }
      
      words.push(word.join(''));
      letterCount += wordLength;
      
      // Add space if we haven't reached 30 letters yet
      if (letterCount < 30) {
        words.push(' ');
      }
    }
    
    return words.join('');
  }

  // Generate text for part 3: lesson letter + all learned letters
  generatePart3(): string {
    // If no learned letters available, fall back to part 1
    if (this.allLearnedLetters.length === 0) {
      return this.generatePart1();
    }
    
    const words: string[] = [];
    let letterCount = 0;
    
    // Generate words until we have 30 letters total
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount); // 1-3 letters, max 30 total
      const word: string[] = [];
      
      // Generate word with lesson letter having higher weight
      for (let i = 0; i < wordLength; i++) {
        const rand = Math.random();
        
        if (rand < 0.4) {
          // 40% chance for lesson letter
          word.push(this.lessonLetter);
        } else {
          // 60% chance for all learned letters
          const randomLearnedLetter = this.allLearnedLetters[Math.floor(Math.random() * this.allLearnedLetters.length)];
          word.push(randomLearnedLetter);
        }
      }
      
      words.push(word.join(''));
      letterCount += wordLength;
      
      // Add space if we haven't reached 30 letters yet
      if (letterCount < 30) {
        words.push(' ');
      }
    }
    
    return words.join('');
  }

  // Get all three parts
  generateAllParts(): { part1: string; part2: string; part3: string } {
    return {
      part1: this.generatePart1(),
      part2: this.generatePart2(),
      part3: this.generatePart3()
    };
  }
}

// Helper function to get lesson configuration based on lesson ID and chapter
export function getLessonConfig(lessonId: string, chapterId: string): LessonConfig {
  const lessonLetter = lessonId.toLowerCase();
  
  // Define chapters and their letters in order
  const chapters: Record<string, string[]> = {
    '1': ['f', 'j', 'r', 'u', 'n', 'v', 't', 'y', 'g', 'h', 'b', 'm'], // Index Fingers
    '2': ['d', 'k', 'e', 'i', 'c', ','], // Middle Fingers
    '3': ['s', 'l', 'w', 'o', 'x', '.'], // Ring Fingers
    '4': ['a', ';', 'q', 'p', 'z', '/'], // Pinky Fingers
    '5': ['1', '0', '2', '9', '3', '8', '4', '7', '5', '6', '!', ')', '@', '(', '#', '*', '$', '&', '%', '^'] // Numbers & Symbols
  };

  const currentChapterLetters = chapters[chapterId] || [];
  
  // Find the position of the current lesson in its chapter
  const lessonIndex = currentChapterLetters.indexOf(lessonLetter);
  
  // Get letters from the same chapter that come BEFORE the current lesson
  const chapterLetters = lessonIndex > 0 ? currentChapterLetters.slice(0, lessonIndex) : [];
  
  // Get all learned letters from previous chapters + letters learned before current lesson in current chapter
  const allLearnedLetters: string[] = [];
  const chapterNumbers = Object.keys(chapters).map(Number).sort((a, b) => a - b);
  
  for (const chapterNum of chapterNumbers) {
    if (chapterNum < parseInt(chapterId)) {
      // Add all letters from previous chapters
      allLearnedLetters.push(...chapters[chapterNum.toString()]);
    } else if (chapterNum === parseInt(chapterId)) {
      // Add letters from current chapter that come before the current lesson
      allLearnedLetters.push(...chapterLetters);
    }
  }
  
  return {
    lessonLetter,
    chapterLetters,
    allLearnedLetters
  };
}
