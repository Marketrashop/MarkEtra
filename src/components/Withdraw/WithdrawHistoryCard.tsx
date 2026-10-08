"use client";

import Image from "next/image";

import {
  Building2,
} from "lucide-react";

import {
  formatWithdrawAmount,
} from "./withdraw.utils";

import type {
  WithdrawHistoryItem,
} from "./withdraw.types";

type WithdrawHistoryCardProps = {
  withdrawal: WithdrawHistoryItem;
};

export default function WithdrawHistoryCard({
  withdrawal,
}: WithdrawHistoryCardProps) {
  const statusStyles = {
    pending: `
      border-[var(--withdraw-history-status-pending-border)]
      bg-[var(--withdraw-history-status-pending-bg)]
      text-[var(--withdraw-history-status-pending-text)]
    `,

    successful: `
      border-[var(--withdraw-history-status-success-border)]
      bg-[var(--withdraw-history-status-success-bg)]
      text-[var(--withdraw-history-status-success-text)]
    `,

    rejected: `
      border-[var(--withdraw-history-status-rejected-border)]
      bg-[var(--withdraw-history-status-rejected-bg)]
      text-[var(--withdraw-history-status-rejected-text)]
    `,
  };

  return (
    <article
      className="
        rounded-[var(--withdraw-history-card-radius)]
        border
        border-[var(--withdraw-history-card-border)]
        bg-[var(--withdraw-history-card-bg)]
        p-2.5
        shadow-[var(--withdraw-history-card-shadow)]
        transition-all
        duration-[var(--withdraw-history-card-transition)]
        hover:border-[var(--withdraw-history-card-hover-border)]
        sm:p-[var(--withdraw-history-card-padding)]
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
            items-start
            gap-2
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-md
              border
              border-[var(--withdraw-history-card-icon-border)]
              bg-[var(--withdraw-history-card-icon-bg)]
              sm:h-10
              sm:w-10
              sm:rounded-lg
            "
          >
            {withdrawal.method.type ===
            "bank" ? (
              <Building2
                size={16}
                strokeWidth={2}
                className="
                  text-[var(--withdraw-history-card-icon-color)]
                  sm:h-[19px]
                  sm:w-[19px]
                "
              />
            ) : (
              <div
                className="
                  relative
                  h-full
                  w-full
                "
              >
                <Image
                  src={
                    withdrawal.method
                      .icon
                  }
                  alt={
                    withdrawal.method
                      .name
                  }
                  fill
                  sizes="40px"
                  className="
                    object-contain
                    p-1
                    sm:p-1.5
                  "
                />
              </div>
            )}
          </div>

          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-1.5
                sm:gap-2
              "
            >
              <h3
                className="
                  truncate
                  text-[11px]
                  font-semibold
                  text-[var(--withdraw-history-card-title)]
                  sm:text-[13px]
                "
              >
                {
                  withdrawal.method
                    .name
                }
              </h3>

              <span
                className="
                  text-[8px]
                  font-medium
                  text-[var(--withdraw-history-card-symbol)]
                  sm:text-[10px]
                "
              >
                {
                  withdrawal.method
                    .symbol
                }
              </span>
            </div>

            <p
              className="
                mt-0.5
                max-w-[200px]
                truncate
                text-[9px]
                text-[var(--withdraw-history-card-text)]
                sm:mt-1
                sm:max-w-[260px]
                sm:text-[11px]
              "
            >
              {
                withdrawal.destinationAddress
              }
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-[var(--withdraw-history-card-muted)]
                sm:mt-1
                sm:text-[10px]
              "
            >
              Ref:{" "}
              {
                withdrawal.reference
              }
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-[var(--withdraw-history-card-muted)]
                sm:mt-1
                sm:text-[10px]
              "
            >
              {
                withdrawal.createdAt
              }{" "}
              ·{" "}
              {
                withdrawal.createdTime
              }
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
              text-[12px]
              font-bold
              text-[var(--withdraw-history-card-amount)]
              sm:text-[14px]
            "
          >
            {formatWithdrawAmount(
              withdrawal.amount
            )}
          </p>

          <p
            className="
              mt-0.5
              text-[8px]
              text-[var(--withdraw-history-card-crypto)]
              sm:mt-1
              sm:text-[10px]
            "
          >
            {
              withdrawal.cryptoAmount
            }{" "}
            {
              withdrawal.method
                .symbol
            }
          </p>

          <span
            className={`
              mt-1.5
              inline-flex
              rounded-md
              border
              px-1.5
              py-0.5
              text-[8px]
              font-medium
              capitalize
              sm:mt-2
              sm:px-2
              sm:py-1
              sm:text-[10px]
              ${
                statusStyles[
                  withdrawal.status
                ]
              }
            `}
          >
            {
              withdrawal.status
            }
          </span>
        </div>
      </div>
    </article>
  );
}