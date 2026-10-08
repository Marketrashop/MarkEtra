"use client";

import Button from "@/components/ui/Button";

import type {
  WalletUserRowProps,
} from "./wallet.types";

import {
  formatCurrency,
  getFullName,
} from "./wallet.utils";

export default function WalletUserRow({
  user,
  onManage,
}: WalletUserRowProps) {
  return (
    <tr
      onClick={() =>
        onManage(user)
      }
      className="
        cursor-pointer
        border-b
        border-[var(--admin-table-border)]
        transition-colors
        duration-300
        hover:bg-[var(--admin-table-row-hover)]
      "
    >
      <td
        className="
          px-3
          py-3
          sm:px-4
          sm:py-3.5
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
          {getFullName(user)}
        </div>

        <div
          className="
            mt-0.5
            text-[10px]
            text-[var(--admin-table-muted)]
            sm:mt-1
            sm:text-xs
          "
        >
          {user.role}
        </div>
      </td>

      <td
        className="
          px-3
          py-3
          text-xs
          text-[var(--admin-table-text)]
          sm:px-4
          sm:py-3.5
          sm:text-sm
        "
      >
        {user.email}
      </td>

      <td
        className="
          px-3
          py-3
          text-xs
          font-semibold
          text-[var(--admin-table-title)]
          sm:px-4
          sm:py-3.5
          sm:text-sm
        "
      >
        {formatCurrency(
          user.wallet
            ?.availableBalance ??
            0,
        )}
      </td>

      <td
        className="
          px-3
          py-3
          sm:px-4
          sm:py-3.5
        "
      >
        <span
          className="
            inline-flex
            rounded-full
            px-2
            py-0.5
            text-[9px]
            font-semibold
            sm:px-2.5
            sm:py-1
            sm:text-[10px]
          "
        >
          {user.status}
        </span>
      </td>

      <td
        className="
          px-3
          py-3
          text-right
          sm:px-4
          sm:py-3.5
        "
      >
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={(
            event,
          ) => {
            event.stopPropagation();

            onManage(user);
          }}
        >
          Manage
        </Button>
      </td>
    </tr>
  );
}