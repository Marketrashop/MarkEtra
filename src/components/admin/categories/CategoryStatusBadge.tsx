"use client";

type CategoryStatusBadgeProps = {
  isActive: boolean;
};

export default function CategoryStatusBadge({
  isActive,
}: CategoryStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "rounded-full",
        "px-1.5",
        "py-0.5",
        "text-[8px]",
        "font-medium",
        "sm:px-2.5",
        "sm:py-1",
        "sm:text-xs",
        isActive
          ? "bg-[var(--admin-status-success-bg)] text-[var(--admin-status-success-text)]"
          : "bg-[var(--admin-status-danger-bg)] text-[var(--admin-status-danger-text)]",
      ].join(" ")}
    >
      {isActive
        ? "Active"
        : "Inactive"}
    </span>
  );
}