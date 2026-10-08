"use client";

import { X } from "lucide-react";

type AppSearchHeaderProps = {
  onClose: () => void;
};

export default function AppSearchHeader({
  onClose,
}: AppSearchHeaderProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-[var(--border)]
        px-2.5
        py-2.5
        sm:px-5
        sm:py-4
      "
    >
      <div>
        <h2
          className="
            text-[13px]
            font-semibold
            text-[var(--foreground)]
            sm:text-[15px]
          "
        >
          Search Products
        </h2>

        <p
          className="
            mt-0.5
            text-[10px]
            text-[var(--foreground-muted)]
            sm:mt-1
            sm:text-[13px]
          "
        >
          Find products instantly.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close search"
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          text-[var(--foreground-muted)]
          transition-colors
          duration-200
          hover:bg-[var(--surface-hover)]
          hover:text-[var(--foreground)]
          sm:h-9
          sm:w-9
        "
      >
        <X
          size={15}
          strokeWidth={2}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </button>
    </div>
  );
}