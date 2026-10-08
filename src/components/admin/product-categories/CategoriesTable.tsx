"use client";

import Image from "next/image";
import { Edit2, Trash2 } from "lucide-react";

import type {
  ProductCategory,
} from "@/types/category.types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

type CategoriesTableProps = {
  categories: ProductCategory[];

  onEdit: (
    category: ProductCategory
  ) => void;

  onDelete: (
    category: ProductCategory
  ) => void;
};

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div
        className="
          flex
          h-40
          items-center
          justify-center
          rounded-lg
          border
          border-[var(--admin-border)]
          bg-[var(--admin-surface-bg)]
          px-3
          text-[10px]
          text-[var(--admin-muted)]
          sm:h-52
          sm:rounded-[var(--admin-surface-radius)]
          sm:px-4
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
        border-[var(--admin-border)]
        bg-[var(--admin-surface-bg)]
        sm:rounded-[var(--admin-surface-radius)]
      "
    >
      <div className="overflow-x-auto">
        <table
          className="
            min-w-[720px]
            divide-y
            divide-[var(--admin-border)]
            sm:min-w-full
          "
        >
          <thead
            className="
              bg-[var(--admin-bg)]
            "
          >
            <tr>
              <th
                className="
                  px-2.5
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Icon
              </th>

              <th
                className="
                  px-2.5
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Name
              </th>

              <th
                className="
                  px-2.5
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Slug
              </th>

              <th
                className="
                  px-2.5
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Status
              </th>

              <th
                className="
                  px-2.5
                  py-2.5
                  text-left
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Sort
              </th>

              <th
                className="
                  px-2.5
                  py-2.5
                  text-right
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--admin-muted)]
                  sm:px-6
                  sm:py-4
                  sm:text-xs
                  sm:tracking-wide
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody
            className="
              divide-y
              divide-[var(--admin-border)]
            "
          >
            {categories.map(
              (category) => {
                const imageUrl =
                  getCloudinaryImageUrl(
                    category.imageKey
                  );

                return (
                  <tr
                    key={category.id}
                    className="
                      transition-colors
                      hover:bg-[var(--admin-bg)]
                    "
                  >
                    <td
                      className="
                        px-2.5
                        py-2.5
                        sm:px-6
                        sm:py-4
                      "
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          width={42}
                          height={42}
                          className="
                            h-8
                            w-8
                            rounded-md
                            object-contain
                            sm:h-10
                            sm:w-10
                            sm:rounded-lg
                          "
                        />
                      ) : (
                        <div
                          className="
                            h-8
                            w-8
                            rounded-md
                            bg-[var(--admin-bg)]
                            sm:h-10
                            sm:w-10
                            sm:rounded-lg
                          "
                        />
                      )}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-2.5
                        py-2.5
                        text-[9px]
                        font-medium
                        text-[var(--admin-title)]
                        sm:px-6
                        sm:py-4
                        sm:text-sm
                      "
                    >
                      {category.name}
                    </td>

                    <td
                      className="
                        whitespace-nowrap
                        px-2.5
                        py-2.5
                        text-[9px]
                        text-[var(--admin-muted)]
                        sm:px-6
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
                        sm:px-6
                        sm:py-4
                      "
                    >
                      <span
                        className={
                          category.isActive
                            ? `
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              bg-emerald-500/15
                              px-1.5
                              py-0.5
                              text-[8px]
                              font-medium
                              text-emerald-500
                              sm:px-3
                              sm:py-1
                              sm:text-xs
                            `
                            : `
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              bg-red-500/15
                              px-1.5
                              py-0.5
                              text-[8px]
                              font-medium
                              text-red-500
                              sm:px-3
                              sm:py-1
                              sm:text-xs
                            `
                        }
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td
                      className="
                        px-2.5
                        py-2.5
                        text-[9px]
                        text-[var(--admin-title)]
                        sm:px-6
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
                        sm:px-6
                        sm:py-4
                      "
                    >
                      <div
                        className="
                          flex
                          justify-end
                          gap-1
                          sm:gap-2
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              category
                            )
                          }
                          aria-label={`Edit ${category.name}`}
                          title="Edit category"
                          className="
                            inline-flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            border
                            border-[var(--admin-border)]
                            bg-[var(--admin-surface-bg)]
                            text-[var(--admin-muted)]
                            transition
                            hover:bg-[var(--admin-bg)]
                            hover:text-[var(--admin-title)]
                            focus:outline-none
                            sm:h-9
                            sm:w-9
                            sm:rounded-lg
                          "
                        >
                          <Edit2
                            size={13}
                            className="
                              sm:h-4
                              sm:w-4
                            "
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              category
                            )
                          }
                          aria-label={`Delete ${category.name}`}
                          title="Delete category"
                          className="
                            inline-flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            border
                            border-red-500/30
                            bg-[var(--admin-surface-bg)]
                            p-0
                            text-red-500
                            transition
                            hover:bg-red-500/10
                            focus:outline-none
                            sm:h-9
                            sm:w-9
                            sm:rounded-lg
                          "
                        >
                          <Trash2
                            size={13}
                            className="
                              sm:h-4
                              sm:w-4
                            "
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}