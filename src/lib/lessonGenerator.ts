// Lesson text generator for typing practice
import { createChaptersForLayout, LAYOUT_STRINGS } from './layoutMapper';

export interface LessonConfig {
  lessonLetter: string;
  chapterLetters: string[];
  allLearnedLetters: string[];
}

// Word bank organized by letters - real English words
const WORD_BANK: Record<string, string[]> = {
  // Chapter 1: Index Fingers (f, j, r, u, n, v, t, y, g, h, b, m)
  'f': ['fun', 'fast', 'find', 'first', 'friend', 'family', 'fire', 'food', 'face', 'fight', 'feel', 'free', 'full', 'fine', 'form'],
  'j': ['just', 'jump', 'join', 'job', 'joy', 'judge', 'jungle', 'joke', 'jacket', 'journey'],
  'r': ['run', 'right', 'red', 'read', 'road', 'room', 'rain', 'river', 'rock', 'round', 'real', 'reach', 'rest', 'rich', 'rule'],
  'u': ['up', 'use', 'under', 'until', 'upon', 'us', 'unit', 'uncle', 'university', 'understand'],
  'n': ['new', 'now', 'not', 'no', 'name', 'night', 'next', 'need', 'never', 'number', 'near', 'nice', 'north', 'note', 'nothing'],
  'v': ['very', 'visit', 'voice', 'view', 'village', 'value', 'various', 'video', 'vote', 'vital'],
  't': ['the', 'to', 'that', 'this', 'they', 'time', 'two', 'take', 'tell', 'think', 'turn', 'try', 'talk', 'team', 'test'],
  'y': ['you', 'your', 'year', 'yes', 'yet', 'young', 'yellow', 'yesterday', 'yard', 'youth'],
  'g': ['go', 'get', 'good', 'great', 'give', 'group', 'game', 'girl', 'guy', 'government', 'green', 'ground', 'grow', 'general'],
  'h': ['have', 'he', 'his', 'her', 'how', 'here', 'help', 'high', 'home', 'house', 'hand', 'head', 'heart', 'hope', 'human'],
  'b': ['be', 'by', 'but', 'big', 'back', 'book', 'boy', 'bad', 'best', 'better', 'business', 'black', 'blue', 'body', 'build'],
  'm': ['my', 'me', 'make', 'man', 'many', 'much', 'more', 'most', 'money', 'mother', 'mind', 'move', 'must', 'may', 'main'],
  
  // Chapter 2: Middle Fingers (d, k, e, i, c, ,)
  'd': ['do', 'day', 'down', 'did', 'does', 'different', 'during', 'door', 'drive', 'doctor', 'deep', 'dark', 'data', 'deal', 'death'],
  'k': ['know', 'keep', 'kind', 'king', 'key', 'kill', 'kitchen', 'knee', 'knife', 'knock'],
  'e': ['each', 'early', 'earth', 'east', 'easy', 'eat', 'education', 'effect', 'eight', 'either', 'else', 'end', 'energy', 'engine', 'enough'],
  'i': ['in', 'is', 'it', 'if', 'into', 'its', 'important', 'information', 'interest', 'idea', 'include', 'increase', 'indeed', 'inside', 'instead'],
  'c': ['can', 'come', 'could', 'call', 'case', 'change', 'child', 'city', 'close', 'company', 'country', 'course', 'create', 'cut', 'car'],
  
  // Chapter 3: Ring Fingers (s, l, w, o, x, .)
  's': ['so', 'some', 'such', 'say', 'see', 'she', 'should', 'small', 'same', 'seem', 'several', 'side', 'since', 'society', 'system'],
  'l': ['like', 'look', 'long', 'little', 'last', 'live', 'life', 'large', 'law', 'leave', 'let', 'level', 'light', 'line', 'list'],
  'w': ['we', 'will', 'would', 'with', 'what', 'when', 'where', 'why', 'who', 'which', 'water', 'way', 'work', 'world', 'write'],
  'o': ['of', 'on', 'or', 'one', 'only', 'other', 'our', 'out', 'over', 'own', 'open', 'order', 'office', 'often', 'old'],
  'x': ['six', 'box', 'fix', 'mix', 'tax', 'text', 'next', 'complex', 'example', 'experience'],
  
  // Chapter 4: Pinky Fingers (a, ;, q, p, z, /)
  'a': ['and', 'are', 'as', 'at', 'all', 'also', 'any', 'about', 'after', 'again', 'against', 'age', 'ago', 'air', 'already'],
  'q': ['question', 'quick', 'quite', 'quality', 'quarter', 'queen', 'quiet', 'quit', 'quote', 'queue'],
  'p': ['people', 'place', 'part', 'play', 'point', 'put', 'public', 'provide', 'power', 'problem', 'process', 'program', 'present', 'price', 'probably'],
  'z': ['zero', 'zone', 'zoo', 'amazing', 'prize', 'size', 'realize', 'organize', 'recognize', 'analyze'],
  
  // Chapter 5: Numbers & Symbols
  '1': ['one', 'once', 'first', 'someone', 'anyone', 'everyone', 'someone', 'alone', 'done', 'gone'],
  '2': ['two', 'second', 'between', 'twenty', 'twelve', 'twenty', 'together', 'better', 'letter', 'matter'],
  '3': ['three', 'third', 'there', 'where', 'here', 'everywhere', 'somewhere', 'nowhere', 'therefore', 'wherever'],
  '4': ['four', 'fourth', 'before', 'more', 'store', 'door', 'floor', 'poor', 'score', 'ignore'],
  '5': ['five', 'fifth', 'life', 'wife', 'knife', 'strife', 'rife', 'fife', 'strife', 'rife'],
  '6': ['six', 'sixth', 'fix', 'mix', 'six', 'pix', 'nix', 'tix', 'wix', 'bix'],
  '7': ['seven', 'seventh', 'even', 'eleven', 'heaven', 'given', 'driven', 'woven', 'proven', 'shaven'],
  '8': ['eight', 'eighth', 'weight', 'height', 'freight', 'straight', 'bright', 'light', 'night', 'right'],
  '9': ['nine', 'ninth', 'fine', 'line', 'mine', 'pine', 'shine', 'wine', 'define', 'design'],
  '0': ['zero', 'hero', 'nero', 'fero', 'mero', 'sero', 'vero', 'cero', 'dero', 'tero']
};

export class LessonGenerator {
  private lessonLetter: string;
  private chapterLetters: string[];
  private allLearnedLetters: string[];
  private isTest: boolean;

  constructor(config: LessonConfig, isTest: boolean = false) {
    this.lessonLetter = config.lessonLetter.toLowerCase();
    this.chapterLetters = config.chapterLetters.map(l => l.toLowerCase());
    this.allLearnedLetters = config.allLearnedLetters.map(l => l.toLowerCase());
    this.isTest = isTest;
  }

  // Generate text for part 1: only lesson letter and spaces
  async generatePart1(): Promise<string> {
    if (this.isTest) {
      return await this.generateTestWords(1); // Part 1: 30 scrambled letters
    }
    
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

  // Generate text for part 2: lesson letter + chapter letters (letters from same chapter before this lesson)
  async generatePart2(): Promise<string> {
    if (this.isTest) {
      return await this.generateTestWords(2); // Part 2: 15 common words
    }
    
    // If no chapter letters available, fall back to part 1
    if (this.chapterLetters.length === 0) {
      return this.generatePart1();
    }
    
    // Combine lesson letter with chapter letters
    const availableLetters = [this.lessonLetter, ...this.chapterLetters];
    
    const letters: string[] = [];
    let letterCount = 0;
    
    // Generate random sequences of 1-3 letters from lesson + chapter letters
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount);
      const word: string[] = [];
      
      for (let i = 0; i < wordLength; i++) {
        const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        word.push(randomLetter);
      }
      
      if (letters.length > 0) {
        letters.push(' ');
      }
      letters.push(...word);
      letterCount += wordLength;
    }
    
    return letters.join('');
  }

  // Generate text for part 3: lesson letter + all learned letters (letters from previous chapters + current chapter before this lesson)
  async generatePart3(): Promise<string> {
    if (this.isTest) {
      return await this.generateTestWords(3); // Part 3: A quote
    }
    
    // If no learned letters available, fall back to part 1
    if (this.allLearnedLetters.length === 0) {
      return this.generatePart1();
    }
    
    // Combine lesson letter with all learned letters
    const availableLetters = [this.lessonLetter, ...this.allLearnedLetters];
    
    const letters: string[] = [];
    let letterCount = 0;
    
    // Generate random sequences of 1-3 letters from lesson + all learned letters
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount);
      const word: string[] = [];
      
      for (let i = 0; i < wordLength; i++) {
        const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        word.push(randomLetter);
      }
      
      if (letters.length > 0) {
        letters.push(' ');
      }
      letters.push(...word);
      letterCount += wordLength;
    }
    
    return letters.join('');
  }

  // Generate test words with specified chapter letter ratio
  private generateTestPart1(): string {
    // Part 1: 30 letters from the chapter all scrambled (no more than 3 letters before a space)
    const letters: string[] = [];
    let letterCount = 0;
    
    // Generate random sequences of 1-3 letters from chapter letters
    while (letterCount < 30) {
      const wordLength = Math.min(1 + Math.floor(Math.random() * 3), 30 - letterCount);
      const word: string[] = [];
      
      for (let i = 0; i < wordLength; i++) {
        const randomLetter = this.chapterLetters[Math.floor(Math.random() * this.chapterLetters.length)];
        word.push(randomLetter);
      }
      
      if (letters.length > 0) {
        letters.push(' ');
      }
      letters.push(...word);
      letterCount += wordLength;
    }
    
    return letters.join('');
  }

  private generateTestPart2(): string {
    // Part 2: 15 random common words
    const commonWordBank = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
      'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
    ];
    
    const words: string[] = [];
    let wordCount = 0;
    
    while (wordCount < 15) {
      const randomWord = commonWordBank[Math.floor(Math.random() * commonWordBank.length)];
      if (words.length > 0) {
        words.push(' ');
      }
      words.push(randomWord);
      wordCount++;
    }
    
    return words.join('');
  }

  private async generateTestPart3(): Promise<string> {
    // Part 3: A quote from public/quotes.txt
    try {
      const response = await fetch('/quotes.txt');
      const text = await response.text();
      
      // Parse quotes (lines that don't start with #)
      const quotes = text
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .filter(line => line.match(/^".+"$/)); // Only lines that are quoted
      
      if (quotes.length > 0) {
        // Pick a random quote and remove the quotes
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return randomQuote.replace(/^"/, '').replace(/"$/, ''); // Remove surrounding quotes
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    }
    
    // Fallback quote if file can't be loaded
    return "The quick brown fox jumps over the lazy dog.";
  }

  private async generateTestWords(partNumber: number): Promise<string> {
    // New test structure based on part number
    switch (partNumber) {
      case 1:
        return this.generateTestPart1();
      case 2:
        return this.generateTestPart2();
      case 3:
        return await this.generateTestPart3();
      default:
        return '';
    }
  }

  // Get all three parts
  async generateAllParts(): Promise<{ part1: string; part2: string; part3: string }> {
    return {
      part1: await this.generatePart1(),
      part2: await this.generatePart2(),
      part3: await this.generatePart3()
    };
  }
}

// Helper function to get lesson configuration based on lesson ID and chapter
export function getLessonConfig(lessonId: string, chapterId: string): LessonConfig {
  // Get the persistent layout or default to QWERTY
  const activeLayoutString = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('persistent_layout') || LAYOUT_STRINGS.qwerty
    : LAYOUT_STRINGS.qwerty;
  
  const chapters = createChaptersForLayout(activeLayoutString);
  const lessonLetter = lessonId.toLowerCase();
  
  // Check if this is a roadmap final test
  if (lessonId.toLowerCase().startsWith('test')) {
    const currentChapter = chapters.find(ch => ch.id === parseInt(chapterId));
    if (!currentChapter) {
      // Fallback
      return { lessonLetter: 'a', chapterLetters: [], allLearnedLetters: [] };
    }
    
    const currentChapterLetters = currentChapter.lessons
      .filter(l => l.type === 'letter')
      .map(l => l.letter?.toLowerCase() || '')
      .filter(Boolean);
    
    // For tests, use the entire chapter's letters as the "lesson letters"
    // and previous chapters as "learned letters"
    const allLearnedLetters: string[] = [];
    for (const chapter of chapters) {
      if (chapter.id < parseInt(chapterId)) {
        // Add all letters from previous chapters
        const prevLessonLetters = chapter.lessons
          .filter(l => l.type === 'letter')
          .map(l => l.letter?.toLowerCase() || '')
          .filter(Boolean);
        allLearnedLetters.push(...prevLessonLetters);
      }
    }
    
    return {
      lessonLetter: currentChapterLetters[0] || 'a',
      chapterLetters: currentChapterLetters,
      allLearnedLetters
    };
  }
  
  // Find the current chapter and lesson
  const currentChapter = chapters.find(ch => ch.id === parseInt(chapterId));
  if (!currentChapter) {
    return { lessonLetter, chapterLetters: [], allLearnedLetters: [] };
  }
  
  // Get all lessons from the current chapter
  const currentChapterLessons = currentChapter.lessons.filter(l => l.type === 'letter');
  
  // Find the position of the current lesson in its chapter
  const lessonIndex = currentChapterLessons.findIndex(l => l.id === lessonLetter);
  
  // Get letters from the same chapter that come BEFORE the current lesson
  const chapterLetters = lessonIndex > 0 
    ? currentChapterLessons.slice(0, lessonIndex).map(l => l.letter?.toLowerCase() || '').filter(Boolean)
    : [];
  
  // Get all learned letters from previous chapters + letters learned before current lesson in current chapter
  const allLearnedLetters: string[] = [];
  for (const chapter of chapters) {
    if (chapter.id < parseInt(chapterId)) {
      // Add all letters from previous chapters
      const prevLessonLetters = chapter.lessons
        .filter(l => l.type === 'letter')
        .map(l => l.letter?.toLowerCase() || '')
        .filter(Boolean);
      allLearnedLetters.push(...prevLessonLetters);
    } else if (chapter.id === parseInt(chapterId)) {
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
