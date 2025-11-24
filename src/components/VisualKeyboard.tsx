import { useMemo, useRef, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useTheme } from '@/contexts/ThemeContext';

interface VisualKeyboardProps {
  layoutString: string;
  className?: string;
}

// Standard QWERTY layout positions (45 characters)
// This does NOT include backtick (`) or backslash (\) - those are fixed
// These are the 45 keys that map directly to layoutString positions
const QWERTY_POSITIONS = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./";
const ACCENT_KEYS = [
  '{tab}',
  '{lock}',
  '{shift}',
  '{ctrl}',
  '{enter}',
  '{bksp}',
  'fn',
  'win',
  'alt',
  'altgr',
  'menu'
];

export function VisualKeyboard({ layoutString, className = "" }: VisualKeyboardProps) {
  const { theme } = useTheme();
  const keyboardRef = useRef<any>(null);
  const accentButtonTheme = useMemo(
    () => {
      const themes = [
        {
          class: 'vk-accent',
          buttons: ACCENT_KEYS.join(' ')
        }
      ];
      
      // Add styling for question mark keys in preview mode
      if (layoutString && layoutString.includes('?')) {
        const questionMarkKeys: string[] = [];
        for (let i = 0; i < QWERTY_POSITIONS.length && i < layoutString.length; i++) {
          if (layoutString[i] === '?') {
            questionMarkKeys.push(QWERTY_POSITIONS[i]);
          }
        }
        if (questionMarkKeys.length > 0) {
          themes.push({
            class: 'vk-preview',
            buttons: questionMarkKeys.join(' ')
          });
        }
      }
      
      return themes;
    },
    [layoutString]
  );

  const palette = {
    boardBg: 'hsl(var(--card))',
    boardBorder: 'hsl(var(--border) / 0.8)',
    boardGlow:
      theme === 'deep'
        ? '0 25px 60px hsl(var(--background) / 0.5)'
        : '0 25px 45px hsl(var(--background) / 0.18)',
    keyBg: 'hsl(var(--muted))',
    keyBgHover: 'hsl(var(--muted) / 0.85)',
    keyText: 'hsl(var(--card-foreground))',
    keyBorder: 'hsl(var(--border))',
    keyShadow: '0 4px 12px hsl(var(--background) / 0.25)',
    keyShadowHover: '0 6px 18px hsl(var(--primary) / 0.28)',
    functionKeyBg: 'hsl(var(--secondary))',
    functionKeyText: 'hsl(var(--secondary-foreground))',
    accentBg: 'hsl(var(--primary))',
    accentText: 'hsl(var(--primary-foreground))',
    accentBorder: 'hsl(var(--primary))',
    accentGlow:
      theme === 'deep'
        ? '0 6px 18px hsl(var(--primary) / 0.45)'
        : '0 6px 16px hsl(var(--primary) / 0.32)',
    rowGap: '0.35rem'
  };

  // Validate layout string - allow question marks for preview mode
  const isPreviewMode = layoutString && layoutString.includes('?');
  
  if (!layoutString || layoutString.length !== 45) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <p className="text-muted-foreground text-sm">
          Invalid layout string (must be 45 characters)
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          Current length: {layoutString?.length || 0}
        </p>
      </div>
    );
  }

  // Create the keyboard layout structure (QWERTY positions)
  // The layout is ALWAYS QWERTY - we use the display prop to show custom characters
  const keyboardLayout = useMemo(() => {
    return {
      default: [
        "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
        "{tab} q w e r t y u i o p [ ] \\",
        "{lock} a s d f g h j k l ; ' {enter}",
        "{shift} z x c v b n m , . / {shift}",
        "{ctrl} fn win alt {space} altgr menu win {ctrl}"
      ]
    };
  }, []);

  // Create display map: QWERTY key -> layout character
  const displayMap = useMemo(() => {
    const display: Record<string, string> = {};
    const hasQuestionMarks = layoutString.includes('?');
    
    for (let i = 0; i < QWERTY_POSITIONS.length && i < layoutString.length; i++) {
      const qwertyKey = QWERTY_POSITIONS[i];
      const layoutChar = layoutString[i];
      
      // Handle question marks in preview mode
      if (layoutChar === '?') {
        display[qwertyKey] = '?';
        if (qwertyKey.match(/[a-z]/)) {
          display[qwertyKey.toUpperCase()] = '?';
        }
      } else {
        // Map the key exactly as it appears (lowercase for letters)
        display[qwertyKey] = layoutChar;
        // Also map uppercase version
        if (qwertyKey.match(/[a-z]/)) {
          display[qwertyKey.toUpperCase()] = layoutChar.toUpperCase();
        }
      }
    }

    const functionKeyDisplay: Record<string, string> = {
      '{bksp}': 'backspace',
      '{tab}': 'tab',
      '{lock}': 'caps',
      '{enter}': 'enter',
      '{shift}': 'shift',
      '{space}': 'space',
      '{ctrl}': 'ctrl',
      'fn': 'fn',
      'win': 'win',
      'alt': 'alt',
      'altgr': 'alt gr',
      'menu': 'menu'
    };

    Object.entries(functionKeyDisplay).forEach(([key, value]) => {
      display[key] = value || key.replace(/[{}]/g, '');
    });

    return display;
  }, [layoutString]);

  // Update display when layoutString changes
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setOptions({
        display: displayMap,
        buttonTheme: accentButtonTheme
      });
    }
  }, [displayMap, accentButtonTheme]);

  return (
    <div className={`flex flex-col items-center w-full max-w-5xl ${className}`}>
      <div className="w-full">
        <Keyboard
          keyboardRef={(r: any) => (keyboardRef.current = r)}
          layout={keyboardLayout}
          display={displayMap}
          mergeDisplay={true}
          buttonTheme={accentButtonTheme}
          onInit={(keyboard: any) => {
            keyboard.setOptions({
              display: displayMap,
              buttonTheme: accentButtonTheme
            });
          }}
          onRender={() => {
            if (keyboardRef.current) {
              keyboardRef.current.setOptions({
                display: displayMap,
                buttonTheme: accentButtonTheme
              });
            }
          }}
          theme="hg-theme-default"
          disableButtonHold={true}
          physicalKeyboardHighlight={false}
          preventMouseDownDefault={true}
        />
      </div>
      <style>{`
        .hg-theme-default {
          width: 100%;
          max-width: 100%;
          background: transparent;
          border-radius: 0.75rem;
          border: none;
          padding: 0.5rem;
          box-shadow: none;
          overflow: visible;
        }
        .hg-theme-default .hg-row {
          display: flex;
          justify-content: center;
          gap: 0.35rem;
          margin-bottom: 0.35rem;
          flex-wrap: nowrap;
          width: 100%;
        }
        .hg-theme-default .hg-button {
          background: ${palette.keyBg};
          color: ${palette.keyText};
          border: 1px solid ${palette.keyBorder};
          border-radius: 0.4rem;
          font-weight: 600;
          font-size: 0.8rem;
          width: 2.5rem;
          height: 2.5rem;
          min-width: 2.5rem;
          max-width: 2.5rem;
          transition: all 0.2s;
          box-shadow: ${palette.keyShadow};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
        }
        .hg-theme-default .hg-button[data-skbtn="{bksp}"],
        .hg-theme-default .hg-button[data-skbtn="{ctrl}"],
        .hg-theme-default .hg-button[data-skbtn="{tab}"] {
          width: 4.5rem;
          min-width: 4.5rem;
          max-width: 4.5rem;
          border-radius: 0.4rem;
        }
        .hg-theme-default .hg-button[data-skbtn="{enter}"] {
          width: 5rem;
          min-width: 5rem;
          max-width: 5rem;
          border-radius: 0.4rem;
        }
        .hg-theme-default .hg-button[data-skbtn="{lock}"] {
          width: 5rem;
          min-width: 5rem;
          max-width: 5rem;
          border-radius: 0.4rem;
        }
        .hg-theme-default .hg-button[data-skbtn="{shift}"] {
          width: 6.6rem;
          min-width: 6.6rem;
          max-width: 6.6rem;
        } 
        .hg-theme-default .hg-button[data-skbtn="{space}"] {
          width: 16.16rem;
          min-width: 16.16rem;
          max-width: 16.16rem;
        }
        .hg-theme-default .hg-button.vk-accent {
          background: ${palette.accentBg} !important;
          color: ${palette.accentText} !important;
          border-color: ${palette.accentBorder} !important;
          box-shadow: none;
          font-size: 0.85rem;
        }
        .hg-theme-default .hg-button.vk-preview {
          opacity: 0.5;
          border-style: dashed;
          border-color: ${palette.keyBorder} !important;
          background: ${palette.keyBg} !important;
        }
        .hg-theme-default .hg-button:hover {
          background: ${palette.keyBgHover};
          border-color: ${theme === 'deep' ? 'rgba(148, 163, 184, 0.55)' : 'rgba(148, 163, 184, 0.7)'};
          box-shadow: ${palette.keyShadowHover};
        }
        @media (max-width: 768px) {
          .hg-theme-default .hg-button {
            min-width: 2.1rem;
            height: 2.4rem;
            font-size: 0.8rem;
          }
          .hg-theme-default .hg-button[data-skbtn="{space}"] {
            min-width: 10rem;
          }
          .hg-theme-default .hg-button[data-skbtn="fn"],
          .hg-theme-default .hg-button[data-skbtn="win"],
          .hg-theme-default .hg-button[data-skbtn="alt"],
          .hg-theme-default .hg-button[data-skbtn="altgr"],
          .hg-theme-default .hg-button[data-skbtn="menu"] {
            min-width: 2.4rem;
          }
        }
      `}</style>
    </div>
  );
}
