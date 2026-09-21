"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Theme is external browser state (the `data-theme` attribute on <html>, set
 * before paint by the inline script in layout.tsx and persisted to
 * localStorage). We read it with useSyncExternalStore — the React-blessed way
 * to subscribe to a browser store — which avoids the setState-in-effect
 * anti-pattern and stays consistent across tabs.
 */

function subscribe(onChange: () => void): () => void {
  // Re-render when another tab changes the stored theme.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/** Server + first-client render: default to light (matches no-JS baseline). */
function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable — the in-memory attribute still works this session */
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        // Nudge subscribers in this tab (storage event only fires cross-tab).
        window.dispatchEvent(new Event("storage"));
      }}
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
