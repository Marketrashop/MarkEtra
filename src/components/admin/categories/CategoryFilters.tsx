"use client";

import { Search } from "lucide-react";

export type CategoryFiltersValue = {
  search: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
};

type CategoryFiltersProps = {
  value: CategoryFiltersValue;
  onChange: (
    value: CategoryFiltersValue,
  ) => void;
  disabled?: boolean;
};

export default function CategoryFilters({
  value,
  onChange,
  disabled = false,
}: CategoryFiltersProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-2
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        sm:gap-4
        sm:rounded-[var(--admin-surface-radius)]
        sm:p-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div className="relative flex-1">
        <Search
          size={13}
          className="
            pointer-events-none
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            text-[var(--admin-muted)]
            sm:left-3
            sm:h-[18px]
            sm:w-[18px]
          "
        />

        <input
          type="text"
          value={value.search}
          disabled={disabled}
          placeholder="Search categories..."
          onChange={(event) =>
            onChange({
              ...value,
              search:
                event.target.value,
            })
          }
          className="
            h-8
            w-full
            rounded-md
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-input-bg)]
            pl-7
            pr-2.5
            text-[10px]
            outline-none
            transition
            focus:border-[var(--admin-input-focus)]
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:pl-10
            sm:pr-4
            sm:text-sm
          "
        />
      </div>

      <select
        value={value.status}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            ...value,
            status:
              event.target
                .value as CategoryFiltersValue["status"],
          })
        }
        className="
          h-8
          w-full
          rounded-md
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-input-bg)]
          px-2
          text-[10px]
          outline-none
          transition
          focus:border-[var(--admin-input-focus)]
          sm:h-11
          sm:min-w-[180px]
          sm:w-auto
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:text-sm
        "
      >
        <option value="ALL">
          All Categories
        </option>

        <option value="ACTIVE">
          Active
        </option>

        <option value="INACTIVE">
          Inactive
        </option>
      </select>
    </div>
  );
}