import { createContext, useContext, useEffect, useState } from "react";

type Theme = "shallow" | "deep";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("bagre-theme");
    return (stored as Theme) || "deep";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("shallow", "deep");
    root.classList.add(theme);
    localStorage.setItem("bagre-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "deep" ? "shallow" : "deep"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
