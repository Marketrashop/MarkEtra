"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type {
  AdminAffiliatePublicationStatus,
} from "@/types/admin-affiliate.types";

export type AffiliateProductFilter =
  | "ALL"
  | AdminAffiliatePublicationStatus;

type AffiliateProductFiltersProps = {
  search: string;

  status: AffiliateProductFilter;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: AffiliateProductFilter,
  ) => void;

  counts?: Partial<
    Record<
      AffiliateProductFilter,
      number
    >
  >;
};

const filters: {
  value: AffiliateProductFilter;

  label: string;
}[] = [
  {
    value: "ALL",
    label: "All",
  },

  {
    value: "SUBMITTED",
    label: "Submitted",
  },

  {
    value: "IN_REVIEW",
    label: "In Review",
  },

  {
    value: "APPROVED",
    label: "Approved",
  },

  {
    value: "REJECTED",
    label: "Rejected",
  },

  {
    value: "PUBLISHED",
    label: "Published",
  },
];

export default function AffiliateProductFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  counts,
}: AffiliateProductFiltersProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-2
        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:gap-2.5
      "
    >
      <div
        className="
          relative
          w-full
          sm:max-w-[280px]
        "
      >
        <Search
          size={13}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            text-[var(--foreground-muted)]
            sm:left-3
            sm:h-[15px]
            sm:w-[15px]
          "
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Search products or affiliates..."
          className="
            h-8
            w-full
            rounded-md
            border
            border-[var(--border)]
            bg-[var(--surface)]
            pl-7
            pr-2
            text-[10px]
            text-[var(--foreground)]
            outline-none
            transition-all
            duration-200
            placeholder:text-[var(--foreground-muted)]
            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[var(--primary)]/10
            sm:h-9
            sm:rounded-lg
            sm:pl-9
            sm:pr-3
            sm:text-[12px]
          "
        />
      </div>

      <div
        className="
          flex
          min-w-0
          items-center
          gap-1.5
          sm:gap-2
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-md
            border
            border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--foreground-muted)]
            sm:h-9
            sm:w-9
            sm:rounded-lg
          "
          aria-hidden="true"
        >
          <SlidersHorizontal
            size={13}
            strokeWidth={2}
            className="sm:h-[15px] sm:w-[15px]"
          />
        </div>

        <div
          className="
            min-w-0
            overflow-x-auto
          "
        >
          <div
            className="
              flex
              items-center
              gap-1
              sm:gap-1.5
            "
          >
            {filters.map(
              (filter) => {
                const active =
                  status ===
                  filter.value;

                const count =
                  counts?.[
                    filter.value
                  ];

                return (
                  <button
                    key={
                      filter.value
                    }
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        filter.value,
                      )
                    }
                    className="
                      inline-flex
                      h-7
                      shrink-0
                      items-center
                      gap-1
                      rounded-md
                      border
                      px-2
                      text-[9px]
                      font-semibold
                      transition-all
                      duration-200
                      sm:h-8
                      sm:gap-1.5
                      sm:rounded-lg
                      sm:px-2.5
                      sm:text-[10px]
                    "
                    style={{
                      background:
                        "var(--surface)",

                      color:
                        active
                          ? "var(--foreground)"
                          : "var(--foreground-muted)",

                      borderColor:
                        active
                          ? "var(--foreground-muted)"
                          : "var(--border)",

                      boxShadow:
                        active
                          ? "inset 0 0 0 1px var(--foreground-muted)"
                          : "none",
                    }}
                  >
                    {filter.label}

                    {typeof count ===
                      "number" && (
                      <span
                        className="
                          rounded-full
                          px-1
                          py-0.5
                          text-[7px]
                          font-bold
                          sm:px-1.5
                          sm:text-[8px]
                        "
                        style={{
                          background:
                            "var(--surface-hover)",

                          color:
                            "var(--foreground-muted)",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}