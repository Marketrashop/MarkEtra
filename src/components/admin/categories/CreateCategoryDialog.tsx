"use client";

import { X } from "lucide-react";

import type {
  CreateCategoryInput,
} from "@/types/category.types";

import CategoryForm from "./CategoryForm";

type CreateCategoryDialogProps = {
  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    values: CreateCategoryInput,
  ) => Promise<void>;
};

export default function CreateCategoryDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateCategoryDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/60
        p-0
        backdrop-blur-md
        sm:items-center
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-category-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          flex
          max-h-[94vh]
          w-full
          flex-col
          overflow-y-auto
          rounded-t-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          shadow-2xl
          sm:max-h-none
          sm:max-w-2xl
          sm:overflow-hidden
          sm:rounded-[var(--admin-surface-radius)]
        "
      >
        <header
          className="
            flex
            items-center
            justify-between
            gap-2
            border-b
            border-[var(--admin-card-border)]
            bg-[var(--admin-card-bg)]
            px-3
            py-2.5
            sm:gap-3
            sm:px-6
            sm:py-5
          "
        >
          <div className="min-w-0">
            <h2
              id="create-category-title"
              className="
                truncate
                text-[13px]
                font-semibold
                text-[var(--admin-title)]
                sm:text-xl
              "
            >
              Create Category
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
              Add a new product category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[var(--admin-muted)]
              transition-colors
              hover:bg-[var(--admin-hover)]
              hover:text-[var(--admin-title)]
              disabled:pointer-events-none
              disabled:opacity-50
              sm:h-10
              sm:w-10
            "
            aria-label="Close"
          >
            <X
              size={13}
              className="sm:h-5 sm:w-5"
            />
          </button>
        </header>

        <div
          className="
            px-3
            py-3
            sm:px-6
            sm:py-6
          "
        >
          <CategoryForm
            loading={loading}
            submitLabel="Create Category"
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}