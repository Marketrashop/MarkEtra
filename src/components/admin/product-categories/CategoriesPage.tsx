"use client";

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import CategoryForm from "./CategoryForm";
import CategoriesTable from "./CategoriesTable";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import type {
  ProductCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category.types";

type CategoriesPageProps = {
  categories: ProductCategory[];

  onCreate: (
    values: CreateCategoryInput
  ) => Promise<void>;

  onUpdate: (
    id: string,
    values: UpdateCategoryInput
  ) => Promise<void>;

  onDelete: (
    id: string
  ) => Promise<void>;
};

export default function CategoriesPage({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: CategoriesPageProps) {
  const [createOpen, setCreateOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<ProductCategory | null>(null);

  const [deleting, setDeleting] =
    useState<ProductCategory | null>(null);

  const [loading, setLoading] =
    useState(false);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => {
        if (
          a.sortOrder !== b.sortOrder
        ) {
          return (
            a.sortOrder -
            b.sortOrder
          );
        }

        return a.name.localeCompare(
          b.name
        );
      }),
    [categories]
  );

  async function handleCreate(
    values: CreateCategoryInput
  ) {
    try {
      setLoading(true);

      await onCreate(values);

      toast.success(
        "Category created."
      );

      setCreateOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create category."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(
    values: UpdateCategoryInput
  ) {
    if (!editing) {
      return;
    }

    try {
      setLoading(true);

      await onUpdate(
        editing.id,
        values
      );

      toast.success(
        "Category updated."
      );

      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update category."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleting) {
      return;
    }

    try {
      setLoading(true);

      await onDelete(
        deleting.id
      );

      toast.success(
        "Category deleted."
      );

      setDeleting(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        flex
        flex-col
        gap-3
        sm:gap-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-[var(--space-md)]
        "
      >
        <div>
          <h1
            className="
              text-[13px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-xl
            "
          >
            Product Categories
          </h1>

          <p
            className="
              mt-0.5
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:text-sm
              sm:leading-normal
            "
          >
            Organize products with
            compact category
            management.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setCreateOpen(true)
          }
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
            px-2.5
            text-[9px]
            font-medium
            transition
            hover:opacity-90
            focus:outline-none
            sm:h-11
            sm:gap-2
            sm:self-auto
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
            className="
              sm:h-[18px]
              sm:w-[18px]
            "
          />

          New Category
        </button>
      </div>

      <CategoriesTable
        categories={
          sortedCategories
        }
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      {createOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            bg-[var(--admin-modal-overlay)]
            p-0
            sm:items-center
            sm:p-6
          "
        >
          <div
            className="
              max-h-[94vh]
              w-full
              overflow-y-auto
              rounded-t-lg
              border
              border-[var(--admin-modal-border)]
              bg-[var(--admin-modal-bg)]
              p-3
              shadow-[var(--admin-modal-shadow)]
              sm:max-h-none
              sm:max-w-2xl
              sm:overflow-hidden
              sm:rounded-[var(--admin-modal-radius)]
              sm:p-5
            "
          >
            <div
              className="
                mb-3
                sm:mb-[var(--space-lg)]
              "
            >
              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-[var(--admin-title)]
                  sm:text-lg
                "
              >
                Create Category
              </h2>
            </div>

            <CategoryForm
              loading={loading}
              submitLabel="Create Category"
              onSubmit={
                handleCreate
              }
            />

            <div
              className="
                mt-3
                flex
                justify-end
                sm:mt-[var(--space-lg)]
              "
            >
              <button
                type="button"
                onClick={() =>
                  setCreateOpen(
                    false
                  )
                }
                className="
                  h-7
                  rounded-md
                  border
                  border-[var(--admin-button-secondary-border)]
                  bg-[var(--admin-button-secondary-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-secondary-text)]
                  transition
                  hover:bg-[var(--admin-button-secondary-hover)]
                  sm:h-10
                  sm:rounded-[var(--admin-input-radius)]
                  sm:px-4
                  sm:text-sm
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            bg-[var(--admin-modal-overlay)]
            p-0
            sm:items-center
            sm:p-6
          "
        >
          <div
            className="
              max-h-[94vh]
              w-full
              overflow-y-auto
              rounded-t-lg
              border
              border-[var(--admin-modal-border)]
              bg-[var(--admin-modal-bg)]
              p-3
              shadow-[var(--admin-modal-shadow)]
              sm:max-h-none
              sm:max-w-2xl
              sm:overflow-hidden
              sm:rounded-[var(--admin-modal-radius)]
              sm:p-5
            "
          >
            <div
              className="
                mb-3
                sm:mb-[var(--space-lg)]
              "
            >
              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-[var(--admin-title)]
                  sm:text-lg
                "
              >
                Edit Category
              </h2>
            </div>

            <CategoryForm
              initialValues={{
                name: editing.name,
                slug: editing.slug,
                description:
                  editing.description ??
                  "",
                imageKey:
                  editing.imageKey ??
                  "",
                isActive:
                  editing.isActive,
                sortOrder:
                  editing.sortOrder,
              }}
              loading={loading}
              submitLabel="Save Changes"
              onSubmit={
                handleUpdate
              }
            />

            <div
              className="
                mt-3
                flex
                justify-end
                sm:mt-[var(--space-lg)]
              "
            >
              <button
                type="button"
                onClick={() =>
                  setEditing(
                    null
                  )
                }
                className="
                  h-7
                  rounded-md
                  border
                  border-[var(--admin-button-secondary-border)]
                  bg-[var(--admin-button-secondary-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-secondary-text)]
                  transition
                  hover:bg-[var(--admin-button-secondary-hover)]
                  sm:h-10
                  sm:rounded-[var(--admin-input-radius)]
                  sm:px-4
                  sm:text-sm
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteCategoryDialog
        open={!!deleting}
        loading={loading}
        categoryName={
          deleting?.name ?? ""
        }
        onClose={() =>
          setDeleting(null)
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}