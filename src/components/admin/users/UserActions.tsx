"use client";

import {
  Power,
  RotateCcw,
  Trash2,
} from "lucide-react";

type UserAction =
  | "activate"
  | "deactivate"
  | "restore"
  | "approveDeletion"
  | "delete";

type UserActionsProps = {
  status:
    | "PENDING_VERIFICATION"
    | "ACTIVE"
    | "SUSPENDED"
    | "DEACTIVATED"
    | "PENDING_DELETION";

  disabled?: boolean;

  onAction: (
    action: UserAction,
  ) => void;
};

type ActionButtonProps = {
  label: string;
  action: UserAction;
  disabled: boolean;
  danger?: boolean;
  icon: React.ReactNode;
  onClick: (
    action: UserAction,
  ) => void;
};

function ActionButton({
  label,
  action,
  disabled,
  danger = false,
  icon,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={() =>
        onClick(action)
      }
      className="
        inline-flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-md
        border
        transition
        hover:opacity-90
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:h-9
        sm:w-9
        sm:rounded-lg
      "
      style={{
        background: danger
          ? "var(--admin-button-danger-bg)"
          : "var(--admin-button-secondary-bg)",

        color: danger
          ? "var(--admin-button-danger-text)"
          : "var(--admin-button-secondary-text)",

        borderColor: danger
          ? "transparent"
          : "var(--admin-button-secondary-border)",
      }}
    >
      {icon}
    </button>
  );
}

export function UserActions({
  status,
  disabled = false,
  onAction,
}: UserActionsProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-1
        sm:gap-1.5
      "
    >
      {status ===
        "ACTIVE" && (
        <>
          <ActionButton
            label="Deactivate"
            action="deactivate"
            disabled={disabled}
            onClick={onAction}
            icon={
              <Power
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />

          <ActionButton
            label="Delete Permanently"
            action="delete"
            danger
            disabled={disabled}
            onClick={onAction}
            icon={
              <Trash2
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />
        </>
      )}

      {status ===
        "DEACTIVATED" && (
        <>
          <ActionButton
            label="Activate"
            action="activate"
            disabled={disabled}
            onClick={onAction}
            icon={
              <Power
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />

          <ActionButton
            label="Delete Permanently"
            action="delete"
            danger
            disabled={disabled}
            onClick={onAction}
            icon={
              <Trash2
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />
        </>
      )}

      {status ===
        "PENDING_DELETION" && (
        <>
          <ActionButton
            label="Restore Account"
            action="restore"
            disabled={disabled}
            onClick={onAction}
            icon={
              <RotateCcw
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />

          <ActionButton
            label="Approve Deletion"
            action="approveDeletion"
            danger
            disabled={disabled}
            onClick={onAction}
            icon={
              <Trash2
                size={13}
                className="sm:h-4 sm:w-4"
              />
            }
          />
        </>
      )}
    </div>
  );
}