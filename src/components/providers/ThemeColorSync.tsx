
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const THEME_COLORS: Record<string, string> = {
  light: "#ffffff",
  blue: "#0b1645",
};

export default function ThemeColorSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;

    const color = THEME_COLORS[theme];

    if (!color) return;

    document
      .querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]',
      )
      .forEach((meta) => {
        meta.setAttribute("content", color);
      });

    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
  }, [theme]);

  return null;
}
