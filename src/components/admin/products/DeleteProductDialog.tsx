"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

type DeleteProductDialogProps = {
  open: boolean;
  productName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteProductDialog({
  open,
  productName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
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
        bg-black/60
        p-2
        backdrop-blur-sm
        sm:p-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          shadow-2xl
          sm:rounded-[var(--admin-surface-radius)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            border-b
            border-[var(--admin-card-border)]
            p-3
            sm:gap-3
            sm:p-[var(--space-lg)]
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
              sm:gap-3
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
                bg-[var(--admin-button-danger-bg)]
                text-[var(--admin-button-danger-text)]
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

            <div className="min-w-0">
              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-[var(--admin-title)]
                  sm:text-base
                "
              >
                Delete Product
              </h2>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  leading-3.5
                  text-[var(--admin-muted)]
                  sm:mt-1
                  sm:text-xs
                  sm:leading-normal
                "
              >
                This action cannot be
                undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            aria-label="Close delete product dialog"
            title="Close"
            className="
              inline-flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[var(--admin-button-secondary-border)]
              bg-[var(--admin-button-secondary-bg)]
              transition
              hover:bg-[var(--admin-button-secondary-hover)]
              disabled:pointer-events-none
              disabled:opacity-50
              sm:h-9
              sm:w-9
              sm:rounded-[var(--admin-input-radius)]
            "
          >
            <X
              size={13}
              className="
                sm:h-4
                sm:w-4
              "
            />
          </button>
        </div>

        <div
          className="
            space-y-2.5
            p-3
            sm:space-y-[var(--space-md)]
            sm:p-[var(--space-lg)]
          "
        >
          <p
            className="
              text-[10px]
              leading-4
              text-[var(--admin-muted)]
              sm:text-sm
              sm:leading-6
            "
          >
            Are you sure you want to
            permanently delete
            <span
              className="
                mx-1
                font-semibold
                text-[var(--admin-title)]
              "
            >
              "{productName}"
            </span>
            ?
          </p>

          <div
            className="
              rounded-md
              border
              border-[var(--admin-status-warning-border)]
              bg-[var(--admin-status-warning-bg)]
              p-2.5
              text-[9px]
              leading-3.5
              text-[var(--admin-status-warning-text)]
              sm:rounded-[var(--admin-input-radius)]
              sm:p-3
              sm:text-xs
              sm:leading-5
            "
          >
            All associated images,
            variants and specifications
            will also be permanently
            removed.
          </div>
        </div>

        <div
          className="
            flex
            flex-col-reverse
            gap-1.5
            border-t
            border-[var(--admin-card-border)]
            p-3
            sm:flex-row
            sm:justify-end
            sm:gap-3
            sm:p-[var(--space-lg)]
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
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
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-10
              sm:gap-2
              sm:rounded-[var(--admin-input-radius)]
              sm:px-4
              sm:text-sm
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={13}
                  className="
                    animate-spin
                    sm:h-4
                    sm:w-4
                  "
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2
                  size={13}
                  className="
                    sm:h-4
                    sm:w-4
                  "
                />
                Delete Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}