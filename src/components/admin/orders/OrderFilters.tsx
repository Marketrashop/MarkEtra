"use client";

import type {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
} from "../../../../generated/prisma/client";

import type {
  AdminOrderFilters,
} from "./types";

type OrderFiltersProps = {
  filters: AdminOrderFilters;

  onChange: (
    filters: AdminOrderFilters,
  ) => void;
};

export default function OrderFilters({
  filters,
  onChange,
}: OrderFiltersProps) {
  function updateFilters(
    changes: Partial<AdminOrderFilters>,
  ) {
    onChange({
      ...filters,
      ...changes,
    });
  }

  function clearFilters() {
    onChange({
      search: "",
      paymentMethod: "ALL",
      paymentStatus: "ALL",
      status: "ALL",
    });
  }

  const hasActiveFilters =
    Boolean(
      filters.search.trim(),
    ) ||
    filters.paymentMethod !==
      "ALL" ||
    filters.paymentStatus !==
      "ALL" ||
    filters.status !==
      "ALL";

  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        sm:rounded-xl
        sm:p-4
      "
    >
      <div
        className="
          grid
          gap-2
          lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(140px,0.75fr))_auto]
          lg:items-end
          sm:gap-3
        "
      >
        <label className="min-w-0">
          <span
            className="
              mb-1
              block
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.06em]
              text-[var(--admin-muted)]
              sm:mb-1.5
              sm:text-[10px]
              sm:tracking-[0.08em]
            "
          >
            Search
          </span>

          <input
            type="search"
            value={
              filters.search
            }
            onChange={(
              event,
            ) =>
              updateFilters({
                search:
                  event.target
                    .value,
              })
            }
            placeholder="Order number, reference, customer, email"
            className="
              h-8
              w-full
              rounded-md
              border
              border-[var(--admin-input-border)]
              bg-[var(--admin-input-bg)]
              px-2.5
              text-[10px]
              text-[var(--admin-input-text)]
              placeholder:text-[var(--admin-input-placeholder)]
              outline-none
              transition
              focus:border-[var(--admin-input-focus)]
              sm:h-10
              sm:rounded-lg
              sm:px-3
              sm:text-sm
            "
          />
        </label>

        <FilterSelect
          label="Payment method"
          value={
            filters.paymentMethod
          }
          onChange={(
            value,
          ) =>
            updateFilters({
              paymentMethod:
                value as
                  | PaymentMethod
                  | "ALL",
            })
          }
          options={[
            {
              value: "ALL",
              label: "All methods",
            },
            {
              value:
                "WALLET",
              label:
                "Wallet",
            },
            {
              value:
                "CRYPTO",
              label:
                "Crypto",
            },
          ]}
        />

        <FilterSelect
          label="Payment status"
          value={
            filters.paymentStatus
          }
          onChange={(
            value,
          ) =>
            updateFilters({
              paymentStatus:
                value as
                  | OrderPaymentStatus
                  | "ALL",
            })
          }
          options={[
            {
              value: "ALL",
              label: "All payment status",
            },
            {
              value:
                "PENDING",
              label:
                "Pending",
            },
            {
              value:
                "PAID",
              label:
                "Paid",
            },
            {
              value:
                "FAILED",
              label:
                "Failed",
            },
          ]}
        />

        <FilterSelect
          label="Order status"
          value={
            filters.status
          }
          onChange={(
            value,
          ) =>
            updateFilters({
              status:
                value as
                  | OrderStatus
                  | "ALL",
            })
          }
          options={[
            {
              value: "ALL",
              label: "All order status",
            },
            {
              value:
                "PENDING",
              label:
                "Pending",
            },
            {
              value:
                "PROCESSING",
              label:
                "Processing",
            },
            {
              value:
                "SHIPPED",
              label:
                "Shipped",
            },
            {
              value:
                "DELIVERED",
              label:
                "Delivered",
            },
            {
              value:
                "CANCELLED",
              label:
                "Cancelled",
            },
          ]}
        />

        <button
          type="button"
          onClick={
            clearFilters
          }
          disabled={
            !hasActiveFilters
          }
          className="
            h-7
            rounded-md
            border
            border-[var(--admin-card-border)]
            bg-[var(--admin-card-bg)]
            px-2.5
            text-[9px]
            font-medium
            text-[var(--admin-muted)]
            transition
            hover:border-[var(--primary)]
            hover:text-[var(--admin-title)]
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:h-10
            sm:rounded-lg
            sm:px-3
            sm:text-xs
          "
        >
          Clear
        </button>
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;

  value: string;

  options: {
    value: string;

    label: string;
  }[];

  onChange: (
    value: string,
  ) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="min-w-0">
      <span
        className="
          mb-1
          block
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.06em]
          text-[var(--admin-muted)]
          sm:mb-1.5
          sm:text-[10px]
          sm:tracking-[0.08em]
        "
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
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
          text-[var(--admin-input-text)]
          outline-none
          transition
          focus:border-[var(--admin-input-focus)]
          sm:h-10
          sm:rounded-lg
          sm:px-3
          sm:text-xs
        "
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </label>
  );
}