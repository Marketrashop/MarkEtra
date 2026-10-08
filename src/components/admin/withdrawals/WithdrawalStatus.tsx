"use client";

import type {
  WithdrawalStatus as WithdrawalStatusType,
} from "./withdrawal.types";

type WithdrawalStatusProps = {
  status: WithdrawalStatusType;
};

export default function WithdrawalStatus({
  status,
}: WithdrawalStatusProps) {
  const config = {
    pending: {
      label: "Pending",

      className: `
        border-[var(--admin-warning-border)]
        bg-[var(--admin-warning-bg)]
        text-[var(--admin-warning-text)]
      `,
    },

    processing: {
      label: "Processing",

      className: `
        border-[var(--admin-info-border)]
        bg-[var(--admin-info-bg)]
        text-[var(--admin-info-text)]
      `,
    },

    completed: {
      label: "Completed",

      className: `
        border-[var(--admin-success-border)]
        bg-[var(--admin-success-bg)]
        text-[var(--admin-success-text)]
      `,
    },

    rejected: {
      label: "Rejected",

      className: `
        border-[var(--admin-danger-border)]
        bg-[var(--admin-danger-bg)]
        text-[var(--admin-danger-text)]
      `,
    },
  };

  const current =
    config[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        whitespace-nowrap
        rounded-full
        border
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.04em]
        transition-all
        duration-200
        sm:px-3
        sm:py-1
        sm:text-[12px]
        ${current.className}
      `}
    >
      {current.label}
    </span>
  );
}