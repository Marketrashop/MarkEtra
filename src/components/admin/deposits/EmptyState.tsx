"use client";

import Button from "@/components/ui/Button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = "No deposits found",
  description = "There are currently no deposits matching the selected filters.",
  actionLabel = "Clear Filters",
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        min-h-[200px]
        flex-col
        items-center
        justify-center
        rounded-[var(--admin-deposit-empty-radius)]
        border
        border-[var(--admin-deposit-empty-border)]
        bg-[var(--admin-deposit-empty-bg)]
        px-4
        py-7
        text-center
        shadow-[var(--admin-deposit-empty-shadow)]
        transition-all
        duration-300
        sm:min-h-[260px]
        sm:px-6
        sm:py-10
      "
    >
      <div
        className="
          mb-3.5
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-[var(--admin-deposit-empty-icon-border)]
          bg-[var(--admin-deposit-empty-icon-bg)]
          text-2xl
          shadow-[var(--admin-deposit-empty-icon-shadow)]
          sm:mb-4
          sm:h-14
          sm:w-14
          sm:text-3xl
        "
      >
        💳
      </div>

      <h2
        className="
          text-base
          font-semibold
          text-[var(--admin-deposit-empty-title)]
          sm:text-lg
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-1.5
          max-w-md
          text-xs
          leading-5
          text-[var(--admin-deposit-empty-text)]
          sm:mt-2
          sm:text-sm
          sm:leading-5
        "
      >
        {description}
      </p>

      {onAction && (
        <div
          className="
            mt-4
            w-full
            sm:mt-5
            sm:w-auto
          "
        >
          <Button
            type="button"
            variant="secondary"
            className="
              h-9
              w-full
              px-4
              text-xs
              sm:h-10
              sm:w-auto
              sm:px-5
              sm:text-sm
            "
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}