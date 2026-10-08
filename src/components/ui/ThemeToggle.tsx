"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({
  className,
}: ThemeToggleProps) {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden="true"
        className={cn(
          `
            relative

            flex

            h-[26px]

            w-[52px]

            items-center

            rounded-full

            border

            border-[var(--border)]

            bg-[var(--muted)]

            p-0.5
          `,
          className,
        )}
      >
        <div
          className="
            h-[22px]

            w-[22px]

            rounded-full

            bg-[var(--primary)]

            shadow-sm
          "
        />
      </button>
    );
  }

  const isBlue =
    theme === "blue";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        isBlue
          ? "light"
          : "blue"
      } theme`}
      aria-pressed={isBlue}
      className={cn(
        `
          relative

          flex

          h-[26px]

          w-[52px]

          items-center

          rounded-full

          border

          border-[var(--border)]

          bg-[var(--muted)]

          p-0.5

          transition-colors

          duration-200
        `,
        className,
      )}
    >
      <span
        className="
          absolute

          left-[7px]

          flex

          items-center

          justify-center

          text-[var(--icon-color)]

          opacity-40
        "
      >
        <Sun
          size={10}
          strokeWidth={2.5}
        />
      </span>

      <span
        className="
          absolute

          right-[7px]

          flex

          items-center

          justify-center

          text-[var(--icon-color)]

          opacity-40
        "
      >
        <Moon
          size={10}
          strokeWidth={2.5}
        />
      </span>

      <motion.div
        animate={{
          x: isBlue
            ? 24
            : 0,
        }}
        transition={{
          type: "spring",

          stiffness: 450,

          damping: 30,
        }}
        className="
          relative

          z-10

          flex

          h-[22px]

          w-[22px]

          items-center

          justify-center

          rounded-full

          bg-[var(--primary)]

          shadow-sm
        "
      >
        {isBlue ? (
          <Moon
            size={11}
            strokeWidth={2.75}
            className="
              text-white
            "
          />
        ) : (
          <Sun
            size={11}
            strokeWidth={2.75}
            className="
              text-[var(--foreground)]
            "
          />
        )}
      </motion.div>
    </button>
  );
}