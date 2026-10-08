"use client";

import WithdrawalMethodForm from "./WithdrawalMethodForm";

import type {
  WithdrawalMethodFormValues,
} from "./withdrawal-method.types";

type WithdrawalMethodModalProps = {
  open: boolean;

  title: string;

  description: string;

  value: WithdrawalMethodFormValues;

  loading?: boolean;

  submitLabel?: string;

  onChange: (
    value: WithdrawalMethodFormValues
  ) => void;

  onSubmit: () => void;

  onClose: () => void;
};

export default function WithdrawalMethodModal({
  open,
  title,
  description,
  value,
  loading = false,
  submitLabel = "Save Method",
  onChange,
  onSubmit,
  onClose,
}: WithdrawalMethodModalProps) {
  if (!open) {
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
        p-1.5
        sm:p-4
      "
    >
      <div
        className="
          flex
          max-h-[96vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-[var(--admin-modal-radius)]
          border
          border-[var(--admin-modal-border)]
          bg-[var(--admin-modal-bg)]
          shadow-[var(--admin-modal-shadow)]
          sm:max-h-[90vh]
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-header-bg)]
            px-3
            py-2.5
            sm:px-6
            sm:py-5
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-sm
                font-bold
                text-[var(--admin-title)]
                sm:text-xl
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-[var(--admin-muted)]
                sm:mt-2
                sm:text-sm
                sm:leading-6
              "
            >
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              ml-1.5
              shrink-0
              rounded
              px-1.5
              py-0.5
              text-[10px]
              font-medium
              text-[var(--admin-text)]
              transition-all
              duration-300
              hover:bg-[var(--admin-button-secondary-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:ml-3
              sm:rounded-lg
              sm:px-3
              sm:py-2
              sm:text-sm
            "
          >
            ✕
          </button>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            py-3
            sm:px-6
            sm:py-6
          "
        >
          <WithdrawalMethodForm
            value={value}
            loading={loading}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>

        <div
          className="
            flex
            items-center
            justify-end
            gap-1.5
            border-t
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-footer-bg)]
            px-2.5
            py-2
            sm:gap-3
            sm:px-6
            sm:py-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-7
              rounded-md
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
              sm:h-auto
              sm:rounded-[var(--admin-input-radius)]
              sm:px-5
              sm:py-3
              sm:text-sm
            "
          >
            Cancel
          </button>

<button
  type="button"
  onClick={onSubmit}
  disabled={loading}
  className="
    inline-flex
    h-7
    items-center
    justify-center
    rounded-md
    border
    px-2.5
    text-[9px]
    font-semibold
    transition-all
    duration-300
    hover:opacity-90
    disabled:cursor-not-allowed
    disabled:opacity-60
    sm:h-auto
    sm:rounded-[var(--admin-input-radius)]
    sm:px-5
    sm:py-3
    sm:text-sm
  "
  style={{
    background: "var(--admin-table-header-bg)",
    color: "var(--admin-table-title)",
    borderColor: "var(--admin-card-border)",
    boxShadow: "0 1px 3px var(--admin-card-shadow)",
  }}
>
  {loading
    ? "Saving..."
    : submitLabel}
</button>
        </div>
      </div>
    </div>
  );
}