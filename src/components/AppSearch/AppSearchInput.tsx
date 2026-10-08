"use client";

import {
  Search,
  X,
} from "lucide-react";

type AppSearchInputProps = {
  value: string;
  onChange: (
    value: string,
  ) => void;
  autoFocus?: boolean;
};

export default function AppSearchInput({
  value,
  onChange,
  autoFocus = false,
}: AppSearchInputProps) {
  return (
    <div
      className="
        px-2.5
        py-2.5
        sm:px-5
        sm:py-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-[var(--border)]
          pb-2
          sm:gap-3
          sm:pb-3
        "
      >
        <Search
          size={15}
          className="
            shrink-0
            text-[var(--foreground-muted)]
            sm:h-[18px]
            sm:w-[18px]
          "
        />

        <input
          type="text"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          placeholder="Search products..."
          className="
            min-w-0
            flex-1
            border-none
            bg-transparent
            text-[12px]
            text-[var(--foreground)]
            placeholder:text-[var(--foreground-muted)]
            focus:outline-none
            sm:text-[15px]
          "
        />

{value && (
  <button
    type="button"
    onClick={() => onChange("")}
    aria-label="Clear search"
    className="
      flex
      h-6
      w-6
      shrink-0
      items-center
      justify-center
      rounded-full
      border
      border-[var(--border)]
      bg-[var(--surface-card)]
      text-[var(--foreground-muted)]
      shadow-sm
      transition-all
      duration-200
      hover:scale-105
      hover:bg-[var(--surface-hover)]
      hover:text-[var(--foreground)]
      active:scale-95
      sm:h-7
      sm:w-7
    "
  >
    <X
      size={12}
      strokeWidth={2.5}
      className="sm:h-[14px] sm:w-[14px]"
    />
  </button>
)}
      </div>
    </div>
  );
}