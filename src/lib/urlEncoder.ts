/**
 * URL Encoder/Decoder for special characters in lesson IDs
 * Converts special characters to URL-safe identifiers
 */

const URL_SAFE_MAP: Record<string, string> = {
  '.': 'dot',
  ',': 'comma',
  ';': 'semicolon',
  ':': 'colon',
  '!': 'exclamation',
  '?': 'questionMark',
  '/': 'slash',
  '\\': 'backslash',
  '|': 'pipe',
  '&': 'ampersand',
  '%': 'percent',
  '#': 'hash',
  '$': 'dollar',
  '@': 'at',
  '*': 'asterisk',
  '+': 'plus',
  '=': 'equals',
  '-': 'minus',
  '_': 'underscore',
  '(': 'openParen',
  ')': 'closeParen',
  '[': 'openBracket',
  ']': 'closeBracket',
  '{': 'openBrace',
  '}': 'closeBrace',
  '<': 'openAngle',
  '>': 'closeAngle',
  '"': 'doubleQuote',
  "'": 'singleQuote',
  ' ': 'space',
  '\n': 'newline',
  '\t': 'tab',
  '~': 'tilde',
  '`': 'backtick',
  '^': 'caret',
  '{': 'openBrace',
  '}': 'closeBrace',
  '|': 'pipe',
  // Numbers as symbols need encoding too
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine'
};

// Reverse map for decoding
const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(URL_SAFE_MAP).map(([key, value]) => [value, key])
);

/**
 * Encode a character to a URL-safe identifier
 */
export function encodeCharacter(char: string): string {
  // If it's already in the map, return the URL-safe version
  if (URL_SAFE_MAP[char] !== undefined) {
    return URL_SAFE_MAP[char];
  }
  
  // For normal alphanumeric characters, keep as is
  return char.toLowerCase();
}

/**
 * Decode a URL-safe identifier back to the original character
 */
export function decodeCharacter(encoded: string): string {
  // If it's in the reverse map, return the original character
  if (REVERSE_MAP[encoded] !== undefined) {
    return REVERSE_MAP[encoded];
  }
  
  // For normal alphanumeric characters, keep as is
  return encoded;
}

/**
 * Encode a lesson ID to URL-safe format
 */
export function encodeLessonId(lessonId: string): string {
  // For special IDs like 'test1', 'rshift', etc., keep them as is
  if (lessonId.startsWith('test') || lessonId === 'rshift' || lessonId === 'lshift' || lessonId.startsWith('shift-')) {
    return lessonId;
  }
  
  return encodeCharacter(lessonId);
}

/**
 * Decode a URL-safe identifier back to lesson ID
 */
export function decodeLessonId(encodedId: string): string {
  // For special IDs like 'test1', 'rshift', etc., keep them as is
  if (encodedId.startsWith('test') || encodedId === 'rshift' || encodedId === 'lshift' || encodedId.startsWith('shift-')) {
    return encodedId;
  }
  
  return decodeCharacter(encodedId);
}

