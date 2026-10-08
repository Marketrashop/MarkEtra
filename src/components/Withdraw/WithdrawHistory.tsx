"use client";

import {
  useMemo,
  useState,
} from "react";

import WithdrawHistoryCard from "./WithdrawHistoryCard";
import WithdrawHistoryEmpty from "./WithdrawHistoryEmpty";

import {
  WITHDRAW_FILTERS,
} from "./withdraw.constants";

import type {
  WithdrawHistoryItem,
  WithdrawFilter,
} from "./withdraw.types";

type WithdrawHistoryProps = {
  withdrawals: WithdrawHistoryItem[];
};

export default function WithdrawHistory({
  withdrawals,
}: WithdrawHistoryProps) {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState<WithdrawFilter>(
    "all"
  );

  const filteredWithdrawals =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return withdrawals;
      }

      return withdrawals.filter(
        (withdrawal) =>
          withdrawal.status ===
          activeFilter
      );
    }, [
      withdrawals,
      activeFilter,
    ]);

  return (
    <section
      className="
        mt-6
        rounded-[var(--withdraw-history-radius)]
        border
        border-[var(--withdraw-history-border)]
        bg-[var(--withdraw-history-bg)]
        p-3
        shadow-[var(--withdraw-history-shadow)]
        transition-all
        duration-[var(--withdraw-history-transition)]
        sm:mt-10
        sm:p-[var(--withdraw-history-padding)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-2.5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
        "
      >
        <div>
          <h2
            className="
              text-[15px]
              font-bold
              text-[var(--withdraw-history-title)]
              sm:text-[18px]
            "
          >
            Withdrawal History
          </h2>

          <p
            className="
              mt-1
              text-[10px]
              leading-4
              text-[var(--withdraw-history-text)]
              sm:mt-1.5
              sm:text-[12px]
              sm:leading-5
            "
          >
            View your recent withdrawal
            transactions.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-1
            sm:gap-1.5
          "
        >
          {WITHDRAW_FILTERS.map(
            (filter) => {
              const isActive =
                activeFilter ===
                filter.value;

              const statusStyles = {
                all: `
                  border-[var(--withdraw-history-filter-all-border)]
                  bg-[var(--withdraw-history-filter-all-bg)]
                  text-[var(--withdraw-history-filter-all-text)]
                `,

                pending: `
                  border-[var(--withdraw-history-filter-pending-border)]
                  bg-[var(--withdraw-history-filter-pending-bg)]
                  text-[var(--withdraw-history-filter-pending-text)]
                `,

                successful: `
                  border-[var(--withdraw-history-filter-success-border)]
                  bg-[var(--withdraw-history-filter-success-bg)]
                  text-[var(--withdraw-history-filter-success-text)]
                `,

                rejected: `
                  border-[var(--withdraw-history-filter-rejected-border)]
                  bg-[var(--withdraw-history-filter-rejected-bg)]
                  text-[var(--withdraw-history-filter-rejected-text)]
                `,
              };

              const activeStyles = {
                all: `
                  border-[var(--withdraw-history-filter-all-active-border)]
                  bg-[var(--withdraw-history-filter-all-active-bg)]
                  text-[var(--withdraw-history-filter-all-active-text)]
                `,

                pending: `
                  border-[var(--withdraw-history-filter-pending-active-border)]
                  bg-[var(--withdraw-history-filter-pending-active-bg)]
                  text-[var(--withdraw-history-filter-pending-active-text)]
                `,

                successful: `
                  border-[var(--withdraw-history-filter-success-active-border)]
                  bg-[var(--withdraw-history-filter-success-active-bg)]
                  text-[var(--withdraw-history-filter-success-active-text)]
                `,

                rejected: `
                  border-[var(--withdraw-history-filter-rejected-active-border)]
                  bg-[var(--withdraw-history-filter-rejected-active-bg)]
                  text-[var(--withdraw-history-filter-rejected-active-text)]
                `,
              };

              return (
                <button
                  key={
                    filter.value
                  }
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter.value
                    )
                  }
                  className={`
                    rounded-md
                    border
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-medium
                    transition-all
                    duration-[var(--withdraw-history-transition)]
                    ${
                      isActive
                        ? activeStyles[
                            filter.value
                          ]
                        : statusStyles[
                            filter.value
                          ]
                    }
                    hover:opacity-85
                    sm:px-2
                    sm:py-1
                    sm:text-[11px]
                  `}
                >
                  {
                    filter.label
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      <div
        className="
          mt-4
          max-h-[480px]
          space-y-2
          overflow-y-auto
          pr-0.5
          sm:mt-6
          sm:max-h-[600px]
          sm:space-y-3
          sm:pr-1
        "
      >
        {filteredWithdrawals.length >
        0 ? (
          filteredWithdrawals.map(
            (withdrawal) => (
              <WithdrawHistoryCard
                key={
                  withdrawal.id
                }
                withdrawal={
                  withdrawal
                }
              />
            )
          )
        ) : (
          <WithdrawHistoryEmpty />
        )}
      </div>
    </section>
  );
}