export const TYPOGRAPHY = {
  display:
    "text-5xl md:text-6xl font-extrabold leading-tight tracking-tight",

  h1: "text-4xl md:text-5xl font-extrabold leading-tight",

  h2: "mt-16 text-[42px] font-extrabold leading-tight",

  h3: "text-3xl font-bold leading-tight",

  body:
    "text-[18px] leading-9 text-[var(--foreground-muted)]",

  small:
    "text-sm leading-7 text-[var(--foreground-muted)]",

  caption:
    "text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)]",

  label:
    "text-sm font-semibold tracking-wide",

  quote:
    "border-l-4 border-[var(--primary)] pl-6 italic text-xl leading-9",

  list:
    "space-y-4 pl-6 list-disc text-[18px] leading-8 text-[var(--foreground-muted)]",

  listItem: "",
} as const;