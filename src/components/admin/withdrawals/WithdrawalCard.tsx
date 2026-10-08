"use client";

import {
  ArrowRight,
} from "lucide-react";

import WithdrawalStatus from "./WithdrawalStatus";

import { formatCurrency } from "../Wallet/wallet.utils";

import type {
  Withdrawal,
} from "./withdrawal.types";

type WithdrawalCardProps = {
  withdrawal: Withdrawal;

  onReview: (
    withdrawal: Withdrawal
  ) => void;

  mobile?: boolean;
};

export default function WithdrawalCard({
  withdrawal,
  onReview,
  mobile = false,
}: WithdrawalCardProps) {
  if (mobile) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-border)]
          bg-[var(--admin-card-bg)]
          p-2.5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-2
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                truncate
                text-[11px]
                font-semibold
                text-[var(--admin-foreground)]
              "
            >
              {withdrawal.reference}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[var(--admin-muted-foreground)]
              "
            >
              {[
                withdrawal.user.firstName,
                withdrawal.user.lastName,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[var(--admin-muted-foreground)]
              "
            >
              {withdrawal.method.name}
            </p>
          </div>

          <WithdrawalStatus
            status={
              withdrawal.status
            }
          />
        </div>

        <div
          className="
            mt-2.5
            grid
            grid-cols-2
            gap-2
            text-[10px]
          "
        >
          <div>
            <p
              className="
                text-[8px]
                text-[var(--admin-muted-foreground)]
              "
            >
              Amount
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                font-semibold
                text-[var(--admin-foreground)]
              "
            >
              {formatCurrency(
                withdrawal.amount
              )}
            </p>
          </div>

          <div>
            <p
              className="
                text-[8px]
                text-[var(--admin-muted-foreground)]
              "
            >
              Date
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                font-medium
                text-[var(--admin-foreground)]
              "
            >
              {
                withdrawal.createdAt
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onReview(
              withdrawal
            )
          }
          className="
            mt-2.5
            flex
            h-7
            w-full
            items-center
            justify-center
            gap-1
            rounded-md
            bg-[var(--admin-primary)]
            px-2.5
            text-[9px]
            font-semibold
            text-[var(--admin-primary-foreground)]
            transition-opacity
            hover:opacity-90
          "
        >
          Review

          <ArrowRight
            size={12}
          />
        </button>
      </div>
    );
  }

  return (
    <tr
      className="
        transition-colors
        hover:bg-[var(--admin-muted-bg)]
      "
    >
      <td
        className="
          whitespace-nowrap
          px-6
          py-5
        "
      >
        <p
          className="
            font-semibold
            text-[var(--admin-foreground)]
          "
        >
          {withdrawal.reference}
        </p>
      </td>

      <td
        className="
          px-6
          py-5
        "
      >
        <div>
          <p
            className="
              font-medium
              text-[var(--admin-foreground)]
            "
          >
            {[
              withdrawal.user.firstName,
              withdrawal.user.lastName,
            ]
              .filter(Boolean)
              .join(" ")}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--admin-muted-foreground)]
            "
          >
            {withdrawal.user.email}
          </p>
        </div>
      </td>

      <td
        className="
          px-6
          py-5
        "
      >
        <div>
          <p
            className="
              font-medium
              text-[var(--admin-foreground)]
            "
          >
            {withdrawal.method.name}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--admin-muted-foreground)]
            "
          >
            {withdrawal.method.type}
          </p>
        </div>
      </td>

      <td
        className="
          whitespace-nowrap
          px-6
          py-5
          font-semibold
          text-[var(--admin-foreground)]
        "
      >
        {formatCurrency(
          withdrawal.amount
        )}
      </td>

      <td
        className="
          whitespace-nowrap
          px-6
          py-5
        "
      >
        <WithdrawalStatus
          status={
            withdrawal.status
          }
        />
      </td>

      <td
        className="
          whitespace-nowrap
          px-6
          py-5
          text-sm
          text-[var(--admin-muted-foreground)]
        "
      >
        {withdrawal.createdAt}
      </td>

      <td
        className="
          whitespace-nowrap
          px-6
          py-5
          text-right
        "
      >
        <button
          type="button"
          onClick={() =>
            onReview(
              withdrawal
            )
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[var(--admin-border)]
            px-3
            py-2
            text-sm
            font-semibold
            text-[var(--admin-foreground)]
            transition-all
            hover:border-[var(--admin-primary)]
            hover:text-[var(--admin-primary)]
          "
        >
          Review

          <ArrowRight
            size={16}
          />
        </button>
      </td>
    </tr>
  );
}