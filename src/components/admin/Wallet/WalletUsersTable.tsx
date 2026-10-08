"use client";

import WalletUserRow from "./WalletUserRow";

import WalletLoadingSkeleton from "./WalletLoadingSkeleton";
import WalletEmptyState from "./WalletEmptyState";

import type {
  WalletUsersTableProps,
} from "./wallet.types";

export default function WalletUsersTable({
  users,
  loading,
  onManage,
}: WalletUsersTableProps) {
  if (loading) {
    return (
      <WalletLoadingSkeleton />
    );
  }

  if (
    users.length === 0
  ) {
    return (
      <WalletEmptyState />
    );
  }

  return (
    <div
      className="
        mb-16
        w-full
        overflow-hidden
        rounded-[var(--admin-card-radius)]
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        shadow-[var(--admin-card-shadow)]
        transition-all
        duration-300
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
            w-full
            min-w-[960px]
            border-collapse
          "
        >
          <thead>
            <tr
              className="
                border-b
                border-[var(--admin-table-border)]
                bg-[var(--admin-table-header-bg)]
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
                  text-[var(--admin-table-header-text)]
                  sm:px-4
                  sm:py-3
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
                  text-[var(--admin-table-header-text)]
                  sm:px-4
                  sm:py-3
                "
              >
                Email
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
                  text-[var(--admin-table-header-text)]
                  sm:px-4
                  sm:py-3
                "
              >
                Balance
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
                  text-[var(--admin-table-header-text)]
                  sm:px-4
                  sm:py-3
                "
              >
                Status
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
                  text-[var(--admin-table-header-text)]
                  sm:px-4
                  sm:py-3
                "
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody
            className="
              bg-[var(--admin-table-bg)]
            "
          >
            {users.map(
              (user) => (
                <WalletUserRow
                  key={user.id}
                  user={user}
                  onManage={
                    onManage
                  }
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}