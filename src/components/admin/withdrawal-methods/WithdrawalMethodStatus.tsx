"use client";

type WithdrawalMethodStatusProps = {
  active: boolean;
};

export default function WithdrawalMethodStatus({
  active,
}: WithdrawalMethodStatusProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        transition-all
        duration-300
        sm:px-3
        sm:py-1
        sm:text-xs

        ${
          active
            ? `
              bg-[var(--admin-status-success-bg)]
              text-[var(--admin-status-success-text)]
            `
            : `
              bg-[var(--admin-status-failed-bg)]
              text-[var(--admin-status-failed-text)]
            `
        }
      `}
    >
      {active
        ? "Active"
        : "Disabled"}
    </span>
  );
}