"use client";

import DepositRow from "./DepositRow";

import type {
  Deposit,
} from "./types";

type DepositTableProps = {
  deposits: Deposit[];

  onView: (
    deposit: Deposit,
  ) => void;
};

export default function DepositTable({
  deposits,
  onView,
}: DepositTableProps) {
  return (
    <div
      className="
        mb-20
        overflow-hidden
        rounded-[var(--admin-card-radius)]
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        shadow-[var(--admin-card-shadow)]
        transition-all
        duration-[var(--admin-card-transition)]
        sm:mb-28
      "
    >
      <div
        className="
          overflow-x-auto
        "
      >
        <table
          className="
            min-w-[900px]
            w-full
            border-collapse
          "
        >
          <thead>
            <tr
              className="
                border-b
                border-[var(--admin-table-border)]
                bg-[var(--admin-table-header-bg)]
                transition-colors
              "
            >
              <th
                className="
                  px-3
                  py-2.5
                  text-left
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                User
              </th>

              <th
                className="
                  px-3
                  py-2.5
                  text-left
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                Deposit Method
              </th>

              <th
                className="
                  px-3
                  py-2.5
                  text-left
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                Amount
              </th>

              <th
                className="
                  px-3
                  py-2.5
                  text-left
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                Status
              </th>

              <th
                className="
                  px-3
                  py-2.5
                  text-left
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                Date
              </th>

              <th
                className="
                  px-3
                  py-2.5
                  text-right
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--admin-table-muted)]
                  sm:px-4
                  sm:py-3
                  sm:text-xs
                "
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody
            className="
              divide-y
              divide-[var(--admin-table-border)]
              bg-[var(--admin-table-bg)]
              transition-colors
            "
          >
            {deposits.map(
              (deposit) => (
                <DepositRow
                  key={deposit.id}
                  deposit={deposit}
                  onView={onView}
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}