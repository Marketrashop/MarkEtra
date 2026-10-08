"use client";

import Button from "@/components/ui/Button";

type WalletEmptyStateProps = {
  onRefresh?: () => void;
};

export default function WalletEmptyState({
  onRefresh,
}: WalletEmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-[var(--admin-card-radius)]
        border
        border-dashed
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        px-4
        py-8
        text-center
        sm:px-8
        sm:py-16
      "
    >
      <div
        className="
          mb-2.5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[var(--admin-muted-bg)]
          text-lg
          sm:mb-4
          sm:h-16
          sm:w-16
          sm:text-2xl
        "
      >
        💳
      </div>

      <h3
        className="
          text-sm
          font-semibold
          text-[var(--admin-title)]
          sm:text-xl
        "
      >
        No wallet users found
      </h3>

      <p
        className="
          mt-1
          max-w-md
          text-xs
          leading-5
          text-[var(--admin-muted)]
          sm:mt-2
          sm:text-sm
        "
      >
        No users match your current search. Try another keyword or refresh the page.
      </p>

      {onRefresh && (
        <Button
          className="
            mt-3
            sm:mt-6
          "
          onClick={onRefresh}
        >
          Refresh
        </Button>
      )}
    </div>
  );
}