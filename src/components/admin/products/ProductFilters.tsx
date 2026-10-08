"use client";

import { Search, X } from "lucide-react";

import {
  PRODUCT_STATUSES,
  type ProductStatus,
} from "@/constants/product-status";

export type ProductFiltersValue = {
  search: string;
  status: ProductStatus | "ALL";
  featured: boolean | null;
};

type ProductFiltersProps = {
  value: ProductFiltersValue;
  disabled?: boolean;
  onChange: (
    value: ProductFiltersValue
  ) => void;
};

const defaultFilters: ProductFiltersValue =
  {
    search: "",
    status: "ALL",
    featured: null,
  };

export default function ProductFilters({
  value,
  disabled = false,
  onChange,
}: ProductFiltersProps) {
  function update<
    K extends keyof ProductFiltersValue
  >(
    key: K,
    next: ProductFiltersValue[K]
  ) {
    onChange({
      ...value,
      [key]: next,
    });
  }

  function clearFilters() {
    onChange(defaultFilters);
  }

  const hasFilters =
    value.search.trim() !== "" ||
    value.status !== "ALL" ||
    value.featured !== null;

  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        sm:rounded-[var(--admin-surface-radius)]
        sm:p-[var(--space-lg)]
      "
    >
      <div
        className="
          grid
          gap-2
          lg:grid-cols-[2fr_1fr_1fr_auto]
          sm:gap-[var(--space-md)]
        "
      >
        <div className="relative">
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
              sm:h-4
              sm:w-4
            "
          />

          <input
            type="text"
            value={value.search}
            disabled={disabled}
            placeholder="Search products..."
            onChange={(event) =>
              update(
                "search",
                event.target.value
              )
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
              text-[var(--admin-input-text)]
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
            update(
              "status",
              event.target
                .value as ProductStatus | "ALL"
            )
          }
          className="
            h-8
            rounded-md
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-input-bg)]
            px-2
            text-[10px]
            text-[var(--admin-input-text)]
            outline-none
            transition
            focus:border-[var(--admin-input-focus)]
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-3
            sm:text-sm
          "
        >
          <option value="ALL">
            All Statuses
          </option>

          {PRODUCT_STATUSES.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}
        </select>

        <select
          value={
            value.featured === null
              ? "ALL"
              : value.featured
              ? "TRUE"
              : "FALSE"
          }
          disabled={disabled}
          onChange={(event) => {
            const next =
              event.target.value === "ALL"
                ? null
                : event.target.value ===
                  "TRUE";

            update(
              "featured",
              next
            );
          }}
          className="
            h-8
            rounded-md
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-input-bg)]
            px-2
            text-[10px]
            text-[var(--admin-input-text)]
            outline-none
            transition
            focus:border-[var(--admin-input-focus)]
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-3
            sm:text-sm
          "
        >
          <option value="ALL">
            All Products
          </option>

          <option value="TRUE">
            Featured
          </option>

          <option value="FALSE">
            Non Featured
          </option>
        </select>

        <button
          type="button"
          disabled={
            disabled ||
            !hasFilters
          }
          onClick={clearFilters}
          className="
            inline-flex
            h-7
            items-center
            justify-center
            gap-1
            rounded-md
            border
            border-[var(--admin-button-secondary-border)]
            bg-[var(--admin-button-secondary-bg)]
            px-2.5
            text-[9px]
            font-medium
            text-[var(--admin-title)]
            transition
            hover:bg-[var(--admin-button-secondary-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:h-11
            sm:gap-2
            sm:rounded-[var(--admin-input-radius)]
            sm:px-4
            sm:text-sm
          "
        >
          <X
            size={13}
            className="
              sm:h-4
              sm:w-4
            "
          />

          Clear
        </button>
      </div>
    </section>
  );
}