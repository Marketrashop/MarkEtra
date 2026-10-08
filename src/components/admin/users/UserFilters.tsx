"use client";

import type {
  ChangeEvent,
} from "react";

import type {
  UserRole,
  UserStatusFilter,
} from "./user.types";

type UserFiltersProps = {
  search: string;
  status: UserStatusFilter;
  role: UserRole;
  onSearchChange: (
    value: string,
  ) => void;
  onStatusChange: (
    status: UserStatusFilter,
  ) => void;
  onRoleChange: (
    role: UserRole,
  ) => void;
};

const STATUS_OPTIONS: Array<{
  value: UserStatusFilter;
  label: string;
}> = [
  {
    value: "ALL",
    label: "All Users",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "DEACTIVATED",
    label: "Deactivated",
  },
  {
    value: "PENDING_DELETION",
    label: "Pending Deletion",
  },
];

const ROLE_OPTIONS: Array<{
  value: UserRole;
  label: string;
}> = [
  {
    value: "USER",
    label: "Users",
  },
  {
    value: "ADMIN",
    label: "Admins",
  },
];

export function UserFilters({
  search,
  status,
  role,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}: UserFiltersProps) {
  function handleSearchChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onSearchChange(
      event.target.value,
    );
  }

  function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    onStatusChange(
      event.target.value as UserStatusFilter,
    );
  }

  return (
    <section
      className="
        flex
        flex-col
        gap-1.5
        lg:flex-row
        lg:items-center
        lg:justify-between
        lg:gap-4
      "
    >
      <input
        type="search"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by name or email..."
        className="
          h-8
          w-full
          rounded-md
          border
          px-2.5
          text-[10px]
          outline-none
          transition
          sm:h-9
          sm:rounded-lg
          sm:px-3
          sm:text-xs
          lg:max-w-md
        "
        style={{
          background:
            "var(--admin-input-bg)",
          borderColor:
            "var(--admin-input-border)",
          color:
            "var(--admin-input-text)",
        }}
      />

      <div
        className="
          flex
          w-full
          items-center
          gap-1.5
          lg:w-auto
          lg:gap-2
        "
      >
        <div
          className="
            inline-flex
            h-8
            shrink-0
            items-center
            rounded-md
            border
            p-0.5
            sm:h-9
            sm:rounded-lg
          "
          style={{
            background:
              "var(--admin-input-bg)",
            borderColor:
              "var(--admin-input-border)",
          }}
          role="group"
          aria-label="User type"
        >
          {ROLE_OPTIONS.map(
            (option) => {
              const active =
                role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onRoleChange(
                      option.value,
                    )
                  }
                  aria-pressed={active}
                  className="
                    h-7
                    rounded
                    border
                    px-2
                    text-[9px]
                    font-semibold
                    transition-all
                    duration-200
                    sm:h-8
                    sm:rounded-md
                    sm:px-2.5
                    sm:text-[10px]
                  "
                  style={{
                    background: active
                      ? "var(--admin-table-header-bg)"
                      : "transparent",
                    borderColor: active
                      ? "var(--admin-card-border)"
                      : "transparent",
                    color: active
                      ? "var(--admin-table-title)"
                      : "var(--admin-muted)",
                    boxShadow: active
                      ? "inset 0 0 0 1px var(--admin-card-border), 0 1px 3px var(--admin-card-shadow)"
                      : "none",
                  }}
                >
                  {option.label}
                </button>
              );
            },
          )}
        </div>

        <select
          value={status}
          onChange={handleStatusChange}
          className="
            h-8
            min-w-0
            flex-1
            rounded-md
            border
            px-2.5
            text-[10px]
            outline-none
            transition
            sm:h-9
            sm:rounded-lg
            sm:px-3
            sm:text-xs
            lg:w-56
            lg:flex-none
          "
          style={{
            background:
              "var(--admin-input-bg)",
            borderColor:
              "var(--admin-input-border)",
            color:
              "var(--admin-input-text)",
          }}
        >
          {STATUS_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>
      </div>
    </section>
  );
}