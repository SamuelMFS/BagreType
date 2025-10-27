import { useLayout } from '@/contexts/LayoutContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LAYOUT_STRINGS } from '@/lib/layoutMapper';

interface KeyboardImageProps {
  lessonKey: string;
  currentChar?: string;
  className?: string;
}

// Mapping from lesson keys to QWERTY keys for image lookup
const KEY_MAPPING: Record<string, string> = {
  // Chapter 1: Index Fingers
  'f': 'f', 'j': 'j', 'r': 'r', 'u': 'u', 'n': 'n', 'v': 'v', 
  't': 't', 'y': 'y', 'g': 'g', 'h': 'h', 'b': 'b', 'm': 'm',
  
  // Chapter 2: Middle Fingers  
  'd': 'd', 'k': 'k', 'e': 'e', 'i': 'i', 'c': 'c', ',': 'comma',
  
  // Chapter 3: Ring Fingers
  's': 's', 'l': 'l', 'w': 'w', 'o': 'o', 'x': 'x', '.': 'period',
  
  // Chapter 4: Pinky Fingers
  'a': 'a', ';': 'semicolon', 'q': 'q', 'p': 'p', 'z': 'z', '/': 'slash',
  
  // Chapter 5: Numbers & Symbols
  '1': '1', '0': '0', '2': '2', '9': '9', '3': '3', '8': '8', 
  '4': '4', '7': '7', '5': '5', '6': '6',
  
  // Shift symbols
  '!': 'shift_1', ')': 'shift_0', '@': 'shift_2', '(': 'shift_9',
  '#': 'shift_3', '*': 'shift_8', '$': 'shift_4', '&': 'shift_7',
  '%': 'shift_5', '^': 'shift_6',
  
  // Additional symbols for quotes
  '<': 'comma',    // < uses same position as ,
  '>': 'period',   // > uses same position as .
  '?': 'slash',    // ? uses same position as /
  ':': 'shift_semicolon', // : uses shift + ;
  '"': 's_quotes', // " uses dedicated s_quotes image
  "'": 'quotes', // ' uses dedicated quotes image
  '_': 'shift_minus', // _ uses shift + -
  '+': 'shift_equals', // + uses shift + =
  '{': 'shift_bracket_left', // { uses shift + [
  '}': 'shift_bracket_right', // } uses shift + ]
  '-': 'minus',
  '=': 'equals',
  '[': 'bracket_left',
  ']': 'bracket_right',
  '\\': 'space', // No backslash image, use space bar
  '|': 'space', // No pipe image, use space bar
  
  // Space bar
  ' ': 'space',
  
  // Shift keys
  'rshift': 'rshift', 'lshift': 'lshift'
};

// Map shift-number IDs to shift symbols
const SHIFT_ID_MAP: Record<string, string> = {
  'shift-1': 'shift_1',
  'shift-2': 'shift_2',
  'shift-3': 'shift_3',
  'shift-4': 'shift_4',
  'shift-5': 'shift_5',
  'shift-6': 'shift_6',
  'shift-7': 'shift_7',
  'shift-8': 'shift_8',
  'shift-9': 'shift_9',
  'shift-10': 'shift_0'
};

export function KeyboardImage({ lessonKey, currentChar, className = "" }: KeyboardImageProps) {
  const { currentLayout, layoutName } = useLayout();
  const { theme } = useTheme();
  
  // Normalize accented characters to their base form (á -> a, é -> e, etc.)
  const normalizeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  
  // Get the QWERTY key that corresponds to this lesson key
  const getQwertyKey = (key: string): string => {
    // Get the active layout (persistent layout or current layout)
    const activeLayoutString = typeof localStorage !== 'undefined' 
      ? localStorage.getItem('persistent_layout') || currentLayout || LAYOUT_STRINGS.qwerty
      : currentLayout || LAYOUT_STRINGS.qwerty;
    
    const defaultQwertyString = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./";
    
    // If using default QWERTY, use direct mapping
    if (activeLayoutString === defaultQwertyString) {
      return KEY_MAPPING[key.toLowerCase()] || key.toLowerCase();
    }
    
    // For custom layouts, find the position of the key in the active layout
    const keyLower = key.toLowerCase();
    const activeLayoutLower = activeLayoutString.toLowerCase();
    const keyPosition = activeLayoutLower.indexOf(keyLower);
    
    if (keyPosition === -1) {
      // Fallback to direct mapping if key not found in layout
      return KEY_MAPPING[keyLower] || keyLower;
    }
    
    // Get the corresponding QWERTY key at the same position
    const qwertyKey = defaultQwertyString[keyPosition];
    if (!qwertyKey) {
      // Fallback if position is out of bounds
      return KEY_MAPPING[keyLower] || keyLower;
    }
    
    // Map the QWERTY character to its image name
    return KEY_MAPPING[qwertyKey.toLowerCase()] || qwertyKey.toLowerCase();
  };
  
  // Use currentChar if available, otherwise fall back to lessonKey
  const displayKey = currentChar || lessonKey;
  
  // Normalize accented characters
  const normalizedDisplayKey = normalizeAccents(displayKey);
  const normalizedLessonKey = normalizeAccents(lessonKey);
  
  // Check if this is a shift-ID (e.g., "shift-1")
  const isShiftId = typeof normalizedLessonKey === 'string' && normalizedLessonKey.startsWith('shift-');
  let imageKey: string;
  
  if (isShiftId) {
    // Use the shift ID mapping
    imageKey = SHIFT_ID_MAP[normalizedLessonKey] || normalizedLessonKey;
  } else if (normalizedDisplayKey === normalizedDisplayKey.toUpperCase() && normalizedDisplayKey.match(/[A-Z]/)) {
    // Uppercase letter - use shift prefix naming convention (qwerty_shift_F_light)
    const qwertyKey = getQwertyKey(normalizedDisplayKey.toLowerCase());
    imageKey = `shift_${qwertyKey.toUpperCase()}`;
  } else {
    // Regular case - get QWERTY key
    const qwertyKey = getQwertyKey(normalizedDisplayKey);
    imageKey = qwertyKey;
  }
  
  // Fallback to space bar for characters without images (like backslash)
  const safeImageKey = imageKey || 'space';
  
  const themeSuffix = theme === 'deep' ? 'dark' : 'light';
  const imagePath = `/keyboard-images/qwerty_${safeImageKey}_${themeSuffix}.png`;
  
  // Create display label showing the QWERTY position, not the actual character
  let displayLabel: string;
  if (normalizedDisplayKey === ' ') {
    displayLabel = 'Space';
  } else if (isShiftId) {
    // For shift keys, show the shift symbol
    displayLabel = normalizedLessonKey.replace('shift-', 'Shift+');
  } else if (normalizedDisplayKey === normalizedDisplayKey.toUpperCase() && normalizedDisplayKey.match(/[A-Z]/)) {
    // For uppercase letters, show the QWERTY position in uppercase
    const qwertyKey = getQwertyKey(normalizedDisplayKey.toLowerCase());
    displayLabel = qwertyKey.toUpperCase();
  } else {
    // For regular keys, show the QWERTY position
    const qwertyKey = getQwertyKey(normalizedDisplayKey);
    // Convert image key back to readable format
    const readableKey = qwertyKey === 'comma' ? ',' : 
                       qwertyKey === 'period' ? '.' : 
                       qwertyKey === 'semicolon' ? ';' : 
                       qwertyKey === 'slash' ? '/' : 
                       qwertyKey === 'minus' ? '-' : 
                       qwertyKey === 'equals' ? '=' : 
                       qwertyKey === 'bracket_left' ? '[' : 
                       qwertyKey === 'bracket_right' ? ']' : 
                       qwertyKey === 'backslash' ? '\\' : 
                       qwertyKey.replace('shift_', '');
    displayLabel = readableKey;
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center space-y-2">
        <img 
          src={imagePath} 
          alt={`Keyboard key: ${displayLabel}`}
          className="w-50 h-50 object-contain"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <div className="text-4xl hidden" style={{ display: 'none' }}>⌨</div>
        <p className="text-muted-foreground text-sm">Key position: {displayLabel}</p>
      </div>
    </div>
  );
}
