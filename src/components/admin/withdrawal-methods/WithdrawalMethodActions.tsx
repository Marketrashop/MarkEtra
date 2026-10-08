"use client";

import {
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";

type WithdrawalMethodActionsProps = {
  active: boolean;

  loading?: boolean;

  onEdit: () => void;

  onToggle: () => void;

  onDelete: () => void;
};

export default function WithdrawalMethodActions({
  active,
  loading = false,
  onEdit,
  onToggle,
  onDelete,
}: WithdrawalMethodActionsProps) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-end
        gap-0.5
        sm:gap-1.5
      "
    >
      <button
        type="button"
        disabled={loading}
        onClick={onEdit}
        className="
          inline-flex
          h-6
          items-center
          justify-center
          gap-0.5
          rounded
          border
          border-[var(--admin-button-secondary-border)]
          bg-[var(--admin-button-secondary-bg)]
          px-1.5
          text-[9px]
          font-medium
          text-[var(--admin-button-secondary-text)]
          transition-all
          duration-300
          hover:bg-[var(--admin-button-secondary-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-8
          sm:gap-1.5
          sm:rounded-lg
          sm:px-2.5
          sm:text-xs
        "
      >
        <Pencil
          size={10}
          className="sm:h-3.5 sm:w-3.5"
        />

        Edit
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={onToggle}
        className="
          inline-flex
          h-6
          items-center
          justify-center
          gap-0.5
          rounded
          border
          border-[var(--admin-button-secondary-border)]
          bg-[var(--admin-button-secondary-bg)]
          px-1.5
          text-[9px]
          font-medium
          text-[var(--admin-button-secondary-text)]
          transition-all
          duration-300
          hover:bg-[var(--admin-button-secondary-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-8
          sm:gap-1.5
          sm:rounded-lg
          sm:px-2.5
          sm:text-xs
        "
      >
        {active ? (
          <>
            <PowerOff
              size={10}
              className="sm:h-3.5 sm:w-3.5"
            />

            Disable
          </>
        ) : (
          <>
            <Power
              size={10}
              className="sm:h-3.5 sm:w-3.5"
            />

            Enable
          </>
        )}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={onDelete}
        className="
          inline-flex
          h-6
          items-center
          justify-center
          gap-0.5
          rounded
          bg-[var(--admin-button-danger-bg)]
          px-1.5
          text-[9px]
          font-medium
          text-[var(--admin-button-danger-text)]
          transition-all
          duration-300
          hover:bg-[var(--admin-button-danger-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-8
          sm:gap-1.5
          sm:rounded-lg
          sm:px-2.5
          sm:text-xs
        "
      >
        <Trash2
          size={10}
          className="sm:h-3.5 sm:w-3.5"
        />

        Delete
      </button>
    </div>
  );
}