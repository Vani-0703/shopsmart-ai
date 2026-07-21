import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700
        bg-white/70 dark:bg-slate-900/60 hover:scale-105 active:scale-95 transition-transform"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-accent-orange" />
      ) : (
        <Moon className="w-5 h-5 text-brand-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
