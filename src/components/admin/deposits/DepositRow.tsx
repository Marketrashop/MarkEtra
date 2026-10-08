"use client";

import Button from "@/components/ui/Button";

import DepositStatusBadge from "./DepositStatusBadge";

import type {
  Deposit,
} from "./types";

type DepositRowProps = {
  deposit: Deposit;

  onView: (
    deposit: Deposit,
  ) => void;
};

export default function DepositRow({
  deposit,
  onView,
}: DepositRowProps) {
  return (
    <tr
      className="
        border-b
        border-[var(--admin-table-border)]
        text-[var(--admin-table-text)]
        transition-all
        duration-300
        hover:bg-[var(--admin-table-row-hover)]
      "
    >
      <td
        className="
          px-3
          py-2.5
          sm:px-4
          sm:py-3
        "
      >
        <div
          className="
            text-xs
            font-semibold
            text-[var(--admin-table-title)]
            sm:text-sm
          "
        >
          {[
            deposit.user.firstName,
            deposit.user.lastName,
          ]
            .filter(Boolean)
            .join(" ")}
        </div>

        <div
          className="
            mt-0.5
            text-[11px]
            leading-4
            text-[var(--admin-table-muted)]
            sm:mt-1
            sm:text-xs
          "
        >
          {deposit.user.email}
        </div>
      </td>

      <td
        className="
          px-3
          py-2.5
          sm:px-4
          sm:py-3
        "
      >
        <div
          className="
            text-xs
            font-semibold
            text-[var(--admin-table-title)]
            sm:text-sm
          "
        >
          {deposit.depositMethod.symbol}
        </div>

        <div
          className="
            mt-0.5
            text-[11px]
            leading-4
            text-[var(--admin-table-muted)]
            sm:mt-1
            sm:text-xs
          "
        >
          {deposit.depositMethod.network}
        </div>
      </td>

      <td
        className="
          px-3
          py-2.5
          text-xs
          font-medium
          text-[var(--admin-table-text)]
          sm:px-4
          sm:py-3
          sm:text-sm
        "
      >
        $
        {Number(
          deposit.amount,
        ).toLocaleString()}
      </td>

      <td
        className="
          px-3
          py-2.5
          sm:px-4
          sm:py-3
        "
      >
        <DepositStatusBadge
          status={deposit.status}
        />
      </td>

      <td
        className="
          px-3
          py-2.5
          text-[11px]
          text-[var(--admin-table-muted)]
          sm:px-4
          sm:py-3
          sm:text-xs
        "
      >
        {new Date(
          deposit.createdAt,
        ).toLocaleDateString()}
      </td>

      <td
        className="
          px-3
          py-2
          text-right
          sm:px-4
          sm:py-2.5
        "
      >
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="
            h-8
            min-w-[68px]
            rounded-md
            px-2.5
            text-xs
            sm:h-9
            sm:min-w-[84px]
            sm:rounded-lg
            sm:px-3
            sm:text-sm
          "
          onClick={() =>
            onView(deposit)
          }
        >
          View
        </Button>
      </td>
    </tr>
  );
}