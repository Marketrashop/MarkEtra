"use client";

import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

type DeleteCategoryDialogProps = {
  open: boolean;

  categoryName: string;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => Promise<void> | void;
};

export default function DeleteCategoryDialog({
  open,
  categoryName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[var(--admin-modal-overlay)]
        p-2
        sm:p-[var(--space-lg)]
      "
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-lg
          border
          border-[var(--admin-modal-border)]
          bg-[var(--admin-modal-bg)]
          shadow-[var(--admin-modal-shadow)]
          sm:rounded-[var(--admin-modal-radius)]
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            border-b
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-header-bg)]
            px-3
            py-2.5
            sm:gap-[var(--space-md)]
            sm:px-[var(--space-xl)]
            sm:py-[var(--space-lg)]
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
              rounded-full
              bg-[var(--admin-plan-disabled-bg)]
              text-[var(--admin-button-danger-bg)]
              sm:h-10
              sm:w-10
            "
          >
            <AlertTriangle
              size={15}
              className="
                sm:h-5
                sm:w-5
              "
            />
          </div>

          <div>
            <h2
              className="
                text-[13px]
                font-semibold
                text-[var(--admin-title)]
                sm:text-base
              "
            >
              Delete Category
            </h2>

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
              This action cannot be
              undone.
            </p>
          </div>
        </div>

        <div
          className="
            px-3
            py-3
            sm:px-[var(--space-xl)]
            sm:py-[var(--space-lg)]
          "
        >
          <p
            className="
              text-[10px]
              leading-4
              text-[var(--admin-text)]
              sm:text-sm
              sm:leading-6
            "
          >
            Are you sure you want to
            permanently delete{" "}
            <span className="font-semibold">
              {categoryName}
            </span>
            ?
          </p>
        </div>

        <div
          className="
            flex
            flex-col-reverse
            gap-1.5
            border-t
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-footer-bg)]
            p-3
            sm:flex-row
            sm:justify-end
            sm:gap-[var(--space-sm)]
            sm:p-[var(--space-lg)]
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
              border-[var(--admin-button-secondary-border)]
              bg-[var(--admin-button-secondary-bg)]
              px-2.5
              text-[9px]
              font-medium
              text-[var(--admin-button-secondary-text)]
              transition
              hover:bg-[var(--admin-button-secondary-hover)]
              disabled:cursor-not-allowed
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
              gap-1
              rounded-md
              bg-[var(--admin-button-danger-bg)]
              px-2.5
              text-[9px]
              font-medium
              text-[var(--admin-button-danger-text)]
              transition
              hover:bg-[var(--admin-button-danger-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-10
              sm:gap-2
              sm:rounded-[var(--admin-input-radius)]
              sm:px-4
              sm:text-sm
            "
          >
            {loading && (
              <Loader2
                size={13}
                className="
                  animate-spin
                  sm:h-4
                  sm:w-4
                "
              />
            )}

            {loading
              ? "Deleting..."
              : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
}