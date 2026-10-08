export const buttonVariants = {
  primary:
    "bg-[var(--primary)] text-[var(--button-text)] hover:opacity-90",

  secondary:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",

  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
} as const;

export const buttonSizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6",
  lg: "h-14 px-8 text-lg",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;