"use client";

import type {
  ProductCategory,
} from "@/types/category.types";

type DeleteCategoryDialogProps = {
  open: boolean;

  category: ProductCategory | null;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => Promise<void>;
};

export default function DeleteCategoryDialog({
  open,
  category,
  loading = false,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!open || !category) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        p-2
        backdrop-blur-sm
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          w-full
          max-w-md
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          p-3
          shadow-2xl
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-6
        "
      >
        <h2
          id="delete-category-title"
          className="
            text-[13px]
            font-semibold
            text-[var(--admin-title)]
            sm:text-xl
          "
        >
          Delete Category
        </h2>

        <p
          className="
            mt-1.5
            text-[10px]
            leading-4
            text-[var(--admin-muted)]
            sm:mt-3
            sm:text-sm
            sm:leading-6
          "
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {category.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div
          className="
            mt-3
            flex
            justify-end
            gap-1.5
            sm:mt-6
            sm:gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              inline-flex
              h-7
              items-center
              justify-center
              rounded-md
              border
              border-[var(--admin-card-border)]
              px-2.5
              text-[9px]
              font-medium
              transition
              hover:bg-[var(--admin-hover)]
              disabled:opacity-60
              sm:h-10
              sm:rounded-[var(--admin-input-radius)]
              sm:px-4
              sm:text-sm
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              inline-flex
              h-7
              items-center
              justify-center
              rounded-md
              bg-red-600
              px-2.5
              text-[9px]
              font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:opacity-60
              sm:h-10
              sm:rounded-[var(--admin-input-radius)]
              sm:px-4
              sm:text-sm
            "
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}