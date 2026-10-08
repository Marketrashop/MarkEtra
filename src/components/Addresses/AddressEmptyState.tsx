"use client";

import {
  MapPin,
  Plus,
} from "lucide-react";

type AddressEmptyStateProps = {
  onAdd: () => void;
};

export default function AddressEmptyState({
  onAdd,
}: AddressEmptyStateProps) {
  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        px-3
        py-6
        text-center
        shadow-[var(--user-card-shadow)]
        sm:rounded-xl
        sm:px-5
        sm:py-8
      "
    >
      <div
        className="
          mx-auto
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-[var(--user-stat-bg)]
          text-[var(--primary)]
          sm:h-10
          sm:w-10
        "
      >
        <MapPin
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </div>

      <h2
        className="
          mt-2.5
          text-[13px]
          font-semibold
          text-[var(--user-title)]
          sm:mt-3
          sm:text-sm
        "
      >
        No saved addresses
      </h2>

      <p
        className="
          mx-auto
          mt-1
          max-w-sm
          text-[10px]
          leading-4
          text-[var(--user-text-muted)]
          sm:mt-1.5
          sm:text-xs
          sm:leading-5
        "
      >
        Add a delivery address once and
        reuse it during future checkouts.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="
          mt-4
          inline-flex
          h-9
          items-center
          justify-center
          gap-1.5
          rounded-lg
          bg-[#5658EC]
          px-4
          text-[11px]
          font-semibold
          text-white
          shadow-[0_6px_18px_rgba(86,88,236,0.3)]
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:bg-[#4b4de0]
          hover:shadow-[0_10px_26px_rgba(86,88,236,0.4)]
          active:scale-[0.98]
          sm:mt-5
          sm:h-11
          sm:gap-2
          sm:rounded-xl
          sm:px-5
          sm:text-sm
          sm:shadow-[0_8px_24px_rgba(86,88,236,0.35)]
          sm:hover:shadow-[0_12px_30px_rgba(86,88,236,0.45)]
        "
      >
        <Plus
          size={14}
          strokeWidth={2.5}
          className="sm:h-4 sm:w-4"
        />

        Add address
      </button>
    </section>
  );
}