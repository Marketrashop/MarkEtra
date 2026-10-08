"use client";

import WithdrawalCard from "./WithdrawalCard";

import type {
  Withdrawal,
} from "./withdrawal.types";

type WithdrawalTableProps = {
  withdrawals: Withdrawal[];

  onReview: (
    withdrawal: Withdrawal
  ) => void;
};

export default function WithdrawalTable({
  withdrawals,
  onReview,
}: WithdrawalTableProps) {
  if (
    withdrawals.length === 0
  ) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-border)]
          bg-[var(--admin-card-bg)]
          px-3
          py-8
          text-center
          sm:rounded-xl
          sm:px-6
          sm:py-14
        "
      >
        <p
          className="
            text-[10px]
            text-[var(--admin-muted-foreground)]
            sm:text-sm
          "
        >
          No withdrawal requests found.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          hidden
          overflow-hidden
          rounded-xl
          border
          border-[var(--admin-border)]
          bg-[var(--admin-card-bg)]
          lg:block
        "
      >
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              min-w-[1000px]
              w-full
              divide-y
              divide-[var(--admin-border)]
            "
          >
            <thead
              className="
                bg-[var(--admin-muted-bg)]
              "
            >
              <tr>
                {[
                  "Reference",
                  "User",
                  "Method",
                  "Amount",
                  "Status",
                  "Date",
                  "",
                ].map(
                  (
                    heading
                  ) => (
                    <th
                      key={
                        heading
                      }
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-[var(--admin-muted-foreground)]
                      "
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-[var(--admin-border)]
              "
            >
              {withdrawals.map(
                (
                  withdrawal
                ) => (
                  <WithdrawalCard
                    key={
                      withdrawal.id
                    }
                    withdrawal={
                      withdrawal
                    }
                    onReview={
                      onReview
                    }
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="
          space-y-2
          lg:hidden
        "
      >
        {withdrawals.map(
          (
            withdrawal
          ) => (
            <WithdrawalCard
              key={
                withdrawal.id
              }
              withdrawal={
                withdrawal
              }
              onReview={
                onReview
              }
              mobile
            />
          )
        )}
      </div>
    </>
  );
}