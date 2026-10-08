"use client";

import { Plus } from "lucide-react";

type CategoriesToolbarProps = {
  onCreate: () => void;
};

export default function CategoriesToolbar({
  onCreate,
}: CategoriesToolbarProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        sm:gap-3
      "
    >
      <div className="min-w-0">
        <h2
          className="
            truncate
            text-[13px]
            font-semibold
            text-[var(--admin-title)]
            sm:text-xl
          "
        >
          Categories
        </h2>

        <p
          className="
            mt-px
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:mt-1
            sm:text-sm
            sm:leading-normal
          "
        >
          Organize products into categories.
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
    rounded-md
    border
    px-2.5
    text-[9px]
    font-medium
    transition
    hover:opacity-90
    focus:outline-none
    sm:h-11
    sm:gap-2
    sm:rounded-[var(--admin-input-radius)]
    sm:px-5
    sm:text-sm
  "
  style={{
    background:
      "var(--admin-table-header-bg)",
    color:
      "var(--admin-table-title)",
    borderColor:
      "var(--admin-card-border)",
    boxShadow:
      "0 1px 3px var(--admin-card-shadow)",
  }}
>
  <Plus
    size={13}
    className="sm:h-[18px] sm:w-[18px]"
  />

  <span>
    New Category
  </span>
</button>
    </div>
  );
}