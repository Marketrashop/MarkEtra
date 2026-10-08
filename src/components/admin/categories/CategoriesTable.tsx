"use client";

import {
  Edit,
  Trash2,
} from "lucide-react";

import type {
  ProductCategory,
} from "@/types/category.types";

import CategoryStatusBadge from "./CategoryStatusBadge";

type CategoriesTableProps = {
  categories: ProductCategory[];

  loading?: boolean;

  onEdit: (
    category: ProductCategory,
  ) => void;

  onDelete: (
    category: ProductCategory,
  ) => void;
};

export default function CategoriesTable({
  categories,
  loading = false,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          p-6
          text-center
          text-[10px]
          text-[var(--admin-muted)]
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-10
          sm:text-sm
        "
      >
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          p-6
          text-center
          text-[10px]
          text-[var(--admin-muted)]
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-10
          sm:text-sm
        "
      >
        No categories found.
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        sm:rounded-[var(--admin-surface-radius)]
      "
    >
      <div className="overflow-x-auto">
        <table
          className="
            min-w-[720px]
            w-full
            border-collapse
          "
        >
          <thead
            className="
              bg-[var(--admin-table-header-bg)]
            "
          >
            <tr>
              {[
                "Category",
                "Slug",
                "Products",
                "Status",
                "Sort Order",
                "Actions",
              ].map((title) => (
                <th
                  key={title}
                  className="
                    px-2.5
                    py-2.5
                    text-left
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.06em]
                    text-[var(--admin-muted)]
                    sm:px-5
                    sm:py-4
                    sm:text-xs
                    sm:tracking-wide
                  "
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.map(
              (category) => (
                <tr
                  key={category.id}
                  className="
                    border-t
                    border-[var(--admin-card-border)]
                    transition
                    hover:bg-[var(--admin-hover-bg)]
                  "
                >
                  <td
                    className="
                      px-2.5
                      py-2.5
                      text-[10px]
                      font-medium
                      text-[var(--admin-title)]
                      sm:px-5
                      sm:py-4
                      sm:text-base
                    "
                  >
                    {category.name}
                  </td>

                  <td
                    className="
                      px-2.5
                      py-2.5
                      text-[9px]
                      text-[var(--admin-muted)]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {category.slug}
                  </td>

                  <td
                    className="
                      px-2.5
                      py-2.5
                      text-[9px]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {category._count
                      ?.products ?? 0}
                  </td>

                  <td
                    className="
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <CategoryStatusBadge
                      isActive={
                        category.isActive
                      }
                    />
                  </td>

                  <td
                    className="
                      px-2.5
                      py-2.5
                      text-[9px]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {category.sortOrder}
                  </td>

                  <td
                    className="
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        sm:gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            category,
                          )
                        }
                        className="
                          inline-flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[var(--admin-button-secondary-border)]
                          bg-[var(--admin-button-secondary-bg)]
                          transition
                          hover:bg-[var(--admin-button-secondary-hover)]
                          sm:h-9
                          sm:w-9
                          sm:rounded-[var(--admin-input-radius)]
                        "
                        aria-label={`Edit ${category.name}`}
                      >
                        <Edit
                          size={13}
                          className="sm:h-4 sm:w-4"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            category,
                          )
                        }
                        className="
                          inline-flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          bg-red-600
                          text-white
                          transition
                          hover:bg-red-700
                          sm:h-9
                          sm:w-9
                          sm:rounded-[var(--admin-input-radius)]
                        "
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2
                          size={13}
                          className="sm:h-4 sm:w-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}