import { useTheme } from "@/contexts/ThemeContext";
import { Waves, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-underwater bg-card hover:bg-card/80 border-2 border-primary/30 hover:border-primary transition-wave"
      aria-label={`Switch to ${theme === "deep" ? "shallow" : "deep"} waters`}
    >
      {theme === "deep" ? (
        <Waves className="w-6 h-6 text-primary" />
      ) : (
        <Droplet className="w-6 h-6 text-primary" />
      )}
    </Button>
  );
};

export default ThemeToggle;
