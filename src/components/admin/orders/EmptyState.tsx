type EmptyStateProps = {
  title?: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;
};

export default function EmptyState({
  title = "No orders found",
  description = "Try changing your search or filter criteria.",
  actionLabel = "Clear Filters",
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        px-3
        py-7
        text-center
        shadow-[var(--admin-card-shadow)]
        sm:rounded-xl
        sm:px-5
        sm:py-10
      "
    >
      <h3
        className="
          text-[12px]
          font-semibold
          text-[var(--admin-title)]
          sm:text-sm
        "
      >
        {title}
      </h3>

      <p
        className="
          mx-auto
          mt-1
          max-w-md
          text-[9px]
          leading-3.5
          text-[var(--admin-muted)]
          sm:mt-1.5
          sm:text-xs
          sm:leading-5
        "
      >
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-3
            h-7
            rounded-md
            border
            border-[var(--admin-card-border)]
            bg-[var(--admin-card-bg)]
            px-2.5
            text-[9px]
            font-medium
            text-[var(--admin-muted)]
            transition
            hover:border-[var(--primary)]
            hover:text-[var(--admin-title)]
            sm:mt-4
            sm:h-9
            sm:rounded-lg
            sm:px-3
            sm:text-xs
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}