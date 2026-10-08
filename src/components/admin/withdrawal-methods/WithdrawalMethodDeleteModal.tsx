"use client";

import { AlertTriangle } from "lucide-react";

import type {
  WithdrawalMethod,
} from "./withdrawal-method.types";

type WithdrawalMethodDeleteModalProps = {
  open: boolean;

  loading?: boolean;

  method?: WithdrawalMethod;

  onClose: () => void;

  onDelete?: () => void;
};

export default function WithdrawalMethodDeleteModal({
  open,
  loading = false,
  method,
  onClose,
  onDelete,
}: WithdrawalMethodDeleteModalProps) {
  if (!open || !method) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-[var(--admin-modal-overlay)]
        p-2
        sm:p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-[var(--admin-modal-radius)]
          border
          border-[var(--admin-modal-border)]
          bg-[var(--admin-modal-bg)]
          shadow-[var(--admin-modal-shadow)]
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            border-b
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-header-bg)]
            px-3
            py-4
            text-center
            sm:px-6
            sm:py-8
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[var(--admin-status-failed-bg)]
              sm:h-16
              sm:w-16
            "
          >
            <AlertTriangle
              size={18}
              className="
                text-[var(--admin-status-failed-text)]
                sm:h-[30px]
                sm:w-[30px]
              "
            />
          </div>

          <h2
            className="
              mt-2.5
              text-sm
              font-bold
              text-[var(--admin-title)]
              sm:mt-5
              sm:text-xl
            "
          >
            Delete Withdrawal Method
          </h2>

          <p
            className="
              mt-1.5
              max-w-md
              text-[10px]
              leading-4
              text-[var(--admin-muted)]
              sm:mt-3
              sm:text-sm
              sm:leading-6
            "
          >
            You are about to permanently delete{" "}
            <span
              className="
                font-semibold
                text-[var(--admin-text)]
              "
            >
              {method.name}
            </span>
            .

            <br />

            This action cannot be undone.
          </p>
        </div>

        <div
          className="
            flex
            flex-col-reverse
            gap-1.5
            bg-[var(--admin-modal-footer-bg)]
            p-2.5
            sm:flex-row
            sm:justify-end
            sm:gap-3
            sm:p-6
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              h-7
              rounded
              border
              border-[var(--admin-button-secondary-border)]
              bg-[var(--admin-button-secondary-bg)]
              px-2.5
              text-[9px]
              font-semibold
              text-[var(--admin-button-secondary-text)]
              transition-all
              duration-300
              hover:bg-[var(--admin-button-secondary-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-11
              sm:rounded-[var(--admin-input-radius)]
              sm:px-5
              sm:text-sm
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className="
              h-7
              rounded
              bg-[var(--admin-button-danger-bg)]
              px-2.5
              text-[9px]
              font-semibold
              text-[var(--admin-button-danger-text)]
              transition-all
              duration-300
              hover:bg-[var(--admin-button-danger-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-11
              sm:rounded-[var(--admin-input-radius)]
              sm:px-5
              sm:text-sm
            "
          >
            {loading
              ? "Deleting..."
              : "Delete Method"}
          </button>
        </div>
      </div>
    </div>
  );
}