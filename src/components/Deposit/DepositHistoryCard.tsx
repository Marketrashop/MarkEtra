"use client";

import Image from "next/image";

import {
  formatDepositMoney,
} from "./deposit.utils";

import type {
  DepositHistoryItem,
} from "./deposit.types";

type DepositHistoryCardProps = {
  deposit: DepositHistoryItem;
};

export default function DepositHistoryCard({
  deposit,
}: DepositHistoryCardProps) {
  const statusStyles = {
    pending: `
      bg-[var(--deposit-history-status-pending-bg)]
      text-[var(--deposit-history-status-pending-text)]
    `,

    successful: `
      bg-[var(--deposit-history-status-success-bg)]
      text-[var(--deposit-history-status-success-text)]
    `,

    failed: `
      bg-[var(--deposit-history-status-failed-bg)]
      text-[var(--deposit-history-status-failed-text)]
    `,
  };

  return (
    <article
      className="
        rounded-[var(--deposit-history-card-radius)]
        border
        border-[var(--deposit-history-card-border)]
        bg-[var(--deposit-history-card-bg)]
        p-2.5
        shadow-[var(--deposit-history-card-shadow)]
        transition-all
        duration-300
        hover:border-[var(--deposit-history-card-hover-border)]
        sm:p-[var(--deposit-history-card-padding)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2.5
          sm:gap-4
        "
      >
        <div
          className="
            flex
            min-w-0
            gap-2.5
            sm:gap-4
          "
        >
          <div
            className="
              relative
              h-9
              w-9
              shrink-0
              overflow-hidden
              rounded-lg
              border
              border-[var(--deposit-history-card-icon-border)]
              bg-[var(--deposit-history-card-icon-bg)]
              sm:h-12
              sm:w-12
              sm:rounded-xl
            "
          >
            <Image
              src={deposit.method.icon}
              alt={deposit.method.name}
              fill
              sizes="48px"
              className="
                object-contain
                p-1.5
                sm:p-2
              "
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-[12px]
                font-semibold
                text-[var(--deposit-history-card-title)]
                sm:text-[16px]
              "
            >
              {deposit.method.name}
            </h3>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                text-[var(--deposit-history-card-text)]
                sm:mt-1
                sm:text-sm
              "
            >
              Ref: {deposit.reference}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[var(--deposit-history-card-text)]
                sm:mt-1
                sm:text-sm
              "
            >
              {deposit.createdAt}
            </p>
          </div>
        </div>

        <div
          className="
            shrink-0
            text-right
          "
        >
          <p
            className="
              text-[13px]
              font-bold
              text-[var(--deposit-history-card-title)]
              sm:text-lg
            "
          >
            {formatDepositMoney(
              deposit.amount
            )}
          </p>

          <span
            className={`
              mt-1
              inline-flex
              rounded-full
              px-1.5
              py-0.5
              text-[8px]
              font-semibold
              capitalize
              sm:mt-2
              sm:px-3
              sm:py-1
              sm:text-xs
              ${
                statusStyles[
                  deposit.status
                ]
              }
            `}
          >
            {deposit.status}
          </span>
        </div>
      </div>
    </article>
  );
}