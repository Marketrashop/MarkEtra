"use client";

import {
  ButtonHTMLAttributes,
  forwardRef,
} from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants = {
  primary:
    "bg-[var(--primary)] text-[var(--background)] hover:opacity-90",

  secondary:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",

  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-10 px-4 text-sm",

  md: "h-12 px-6",

  lg: "h-14 px-8 text-lg",
};

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={
          disabled || loading
        }
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading
          ? "Loading..."
          : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;