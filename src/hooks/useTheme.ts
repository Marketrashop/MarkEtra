"use client";

import { useTheme as useNextTheme } from "next-themes";

import type { Theme } from "@/types/theme";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const currentTheme = (resolvedTheme ?? theme ?? "light") as Theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "blue" : "light");
  };

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
  };
}