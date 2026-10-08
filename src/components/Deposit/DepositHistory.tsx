"use client";

import {
  useMemo,
  useState,
} from "react";

import DepositHistoryCard from "./DepositHistoryCard";
import DepositHistoryEmpty from "./DepositHistoryEmpty";

import type {
  DepositHistoryItem,
  DepositStatus,
} from "./deposit.types";

type DepositHistoryProps = {
  deposits: DepositHistoryItem[];
};

const FILTERS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Successful",
    value: "successful",
  },
  {
    label: "Failed",
    value: "failed",
  },
] as const;

type Filter =
  | "all"
  | DepositStatus;

export default function DepositHistory({
  deposits,
}: DepositHistoryProps) {
  const [activeFilter, setActiveFilter] =
    useState<Filter>("all");

  const filteredDeposits =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return deposits;
      }

      return deposits.filter(
        (deposit) =>
          deposit.status ===
          activeFilter
      );
    }, [
      deposits,
      activeFilter,
    ]);

  return (
    <section
      className="
        mt-6
        rounded-[var(--deposit-history-radius)]
        border
        border-[var(--deposit-history-border)]
        bg-[var(--deposit-history-bg)]
        p-3
        shadow-[var(--deposit-history-shadow)]
        transition-all
        duration-[var(--deposit-history-transition)]
        sm:mt-12
        sm:p-[var(--deposit-history-padding)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:gap-6
        "
      >
        <div className="min-w-0">
          <h2
            className="
              text-[16px]
              font-bold
              text-[var(--deposit-history-title)]
              sm:text-2xl
            "
          >
            Recent Deposits
          </h2>

          <p
            className="
              mt-1
              text-[11px]
              leading-5
              text-[var(--deposit-history-text)]
              sm:mt-2
              sm:text-sm
              sm:leading-normal
            "
          >
            View and monitor all your
            recent deposit requests.
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
          {FILTERS.map(
            (filter) => {
              const isActive =
                activeFilter ===
                filter.value;

              const filterStyles =
                {
                  all: isActive
                    ? `
                        border-[var(--deposit-history-filter-all-active-border)]

                        bg-[var(--deposit-history-filter-all-active-bg)]

                        text-[var(--deposit-history-filter-all-active-text)]
                      `
                    : `
                        border-[var(--deposit-history-filter-all-border)]

                        bg-[var(--deposit-history-filter-all-bg)]

                        text-[var(--deposit-history-filter-all-text)]

                        hover:border-[var(--deposit-history-filter-all-active-border)]

                        hover:bg-[var(--deposit-history-filter-all-active-bg)]

                        hover:text-[var(--deposit-history-filter-all-active-text)]
                      `,

                  pending: isActive
                    ? `
                        border-[var(--deposit-history-filter-pending-active-border)]

                        bg-[var(--deposit-history-filter-pending-active-bg)]

                        text-[var(--deposit-history-filter-pending-active-text)]
                      `
                    : `
                        border-[var(--deposit-history-filter-pending-border)]

                        bg-[var(--deposit-history-filter-pending-bg)]

                        text-[var(--deposit-history-filter-pending-text)]

                        hover:border-[var(--deposit-history-filter-pending-active-border)]

                        hover:bg-[var(--deposit-history-filter-pending-active-bg)]

                        hover:text-[var(--deposit-history-filter-pending-active-text)]
                      `,

                  successful: isActive
                    ? `
                        border-[var(--deposit-history-filter-successful-active-border)]

                        bg-[var(--deposit-history-filter-successful-active-bg)]

                        text-[var(--deposit-history-filter-successful-active-text)]
                      `
                    : `
                        border-[var(--deposit-history-filter-successful-border)]

                        bg-[var(--deposit-history-filter-successful-bg)]

                        text-[var(--deposit-history-filter-successful-text)]

                        hover:border-[var(--deposit-history-filter-successful-active-border)]

                        hover:bg-[var(--deposit-history-filter-successful-active-bg)]

                        hover:text-[var(--deposit-history-filter-successful-active-text)]
                      `,

                  failed: isActive
                    ? `
                        border-[var(--deposit-history-filter-failed-active-border)]

                        bg-[var(--deposit-history-filter-failed-active-bg)]

                        text-[var(--deposit-history-filter-failed-active-text)]
                      `
                    : `
                        border-[var(--deposit-history-filter-failed-border)]

                        bg-[var(--deposit-history-filter-failed-bg)]

                        text-[var(--deposit-history-filter-failed-text)]

                        hover:border-[var(--deposit-history-filter-failed-active-border)]

                        hover:bg-[var(--deposit-history-filter-failed-active-bg)]

                        hover:text-[var(--deposit-history-filter-failed-active-text)]
                      `,
                } as const;

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
                    duration-[var(--deposit-history-filter-transition)]
                    sm:px-2
                    sm:py-1
                    sm:text-[11px]
                    ${filterStyles[
                      filter.value
                    ]}
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
          max-h-[600px]
          space-y-2.5
          overflow-y-auto
          pr-0.5
          sm:mt-8
          sm:space-y-4
          sm:pr-1
        "
      >
        {filteredDeposits.length >
        0 ? (
          filteredDeposits.map(
            (deposit) => (
              <DepositHistoryCard
                key={
                  deposit.id
                }
                deposit={
                  deposit
                }
              />
            )
          )
        ) : (
          <DepositHistoryEmpty />
        )}
      </div>
    </section>
  );
}