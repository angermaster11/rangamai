"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. Persists choice in localStorage and reflects it via the
 * `data-theme` attribute on <html>, which globals.css reads. Wrapped in
 * try/catch so it degrades gracefully where storage is unavailable.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let initial: Theme;
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      initial =
        stored ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      initial = "light";
    }
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={`Switch to ${next} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
