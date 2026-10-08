import clsx from "clsx";

import type {
  DepositStatus,
} from "./types";

type DepositStatusBadgeProps = {
  status: DepositStatus;
};

const STATUS_STYLES: Record<
  DepositStatus,
  string
> = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  APPROVED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  REJECTED:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const STATUS_LABELS: Record<
  DepositStatus,
  string
> = {
  PENDING: "Pending",

  APPROVED: "Approved",

  REJECTED: "Rejected",
};

export default function DepositStatusBadge({
  status,
}: DepositStatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-4 sm:px-2.5 sm:py-1 sm:text-xs",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}