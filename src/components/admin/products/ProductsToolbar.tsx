"use client";

import { Plus } from "lucide-react";

type ProductsToolbarProps = {
  onCreate: () => void;
};

export default function ProductsToolbar({
  onCreate,
}: ProductsToolbarProps) {
  return (
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
        <h1
          className="
            text-[13px]
            font-semibold
            tracking-tight
            text-[var(--admin-title)]
            sm:text-2xl
          "
        >
          Products
        </h1>

        <p
          className="
            mt-0.5
            max-w-[320px]
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:mt-1
            sm:max-w-none
            sm:text-sm
            sm:leading-normal
          "
        >
          Manage your catalog, inventory,
          pricing and product information.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="
          inline-flex
          h-7
          shrink-0
          items-center
          justify-center
          gap-1
          self-start
          rounded-md
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-table-header-bg)]
          px-2.5
          text-[9px]
          font-medium
          text-[var(--admin-table-title)]
          transition
          hover:opacity-90
          focus:outline-none
          disabled:pointer-events-none
          disabled:opacity-60
          sm:h-11
          sm:gap-2
          sm:self-auto
          sm:rounded-[var(--admin-input-radius)]
          sm:px-5
          sm:text-sm
        "
        style={{
          boxShadow:
            "0 1px 3px var(--admin-card-shadow)",
        }}
      >
        <Plus
          size={13}
          className="
            sm:h-[18px]
            sm:w-[18px]
          "
        />

        <span>
          New Product
        </span>
      </button>
    </div>
  );
}