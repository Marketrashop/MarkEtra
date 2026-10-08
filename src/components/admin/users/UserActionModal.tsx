"use client";

import {
  Loader2,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useRef,
} from "react";

import type { AdminUser } from "./user.types";

type UserAction =
  | "activate"
  | "deactivate"
  | "restore"
  | "approveDeletion"
  | "delete";

type UserActionModalProps = {
  open: boolean;
  user: AdminUser | null;
  action: UserAction | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ACTIONS: Record<
  UserAction,
  {
    title: string;
    description: (
      name: string,
    ) => string;
    confirm: string;
    danger: boolean;
    warning: boolean;
  }
> = {
  activate: {
    title: "Activate User",
    description: (name) =>
      `Are you sure you want to activate ${name}?`,
    confirm: "Activate",
    danger: false,
    warning: false,
  },

  deactivate: {
    title: "Deactivate User",
    description: (name) =>
      `Are you sure you want to deactivate ${name}?`,
    confirm: "Deactivate",
    danger: false,
    warning: true,
  },

  restore: {
    title: "Restore Account",
    description: (name) =>
      `Restore ${name}'s account and cancel the deletion request?`,
    confirm: "Restore",
    danger: false,
    warning: false,
  },

  approveDeletion: {
    title: "Approve Deletion",
    description: (name) =>
      `This action permanently deletes ${name}'s account and cannot be undone.`,
    confirm: "Approve Deletion",
    danger: true,
    warning: false,
  },

  delete: {
    title: "Delete User",
    description: (name) =>
      `Permanently delete ${name}? This action cannot be undone.`,
    confirm: "Delete Permanently",
    danger: true,
    warning: false,
  },
};

export default function UserActionModal({
  open,
  user,
  action,
  loading = false,
  onClose,
  onConfirm,
}: UserActionModalProps) {
  const confirmRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    confirmRef.current?.focus();

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previous;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    loading,
    onClose,
  ]);

  if (
    !open ||
    !user ||
    !action
  ) {
    return null;
  }

  const config =
    ACTIONS[action];

  const fullName =
    `${user.firstName} ${user.lastName}`;

  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        bg-black/70
        p-3
        backdrop-blur-sm
        animate-in
        fade-in
        duration-200
        sm:p-4
      "
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-action-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          w-full
          max-w-lg
          rounded-2xl
          border
          p-4
          shadow-2xl
          animate-in
          zoom-in-95
          duration-200
          sm:p-5
        "
        style={{
          background:
            "var(--admin-card-bg)",
          borderColor:
            "var(--admin-card-border)",
        }}
      >
        <div
          className="
            flex
            items-start
            gap-3
            sm:gap-4
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              sm:h-11
              sm:w-11
            "
            style={{
              background:
                config.danger
                  ? "rgba(220,38,38,.15)"
                  : "rgba(59,130,246,.15)",
            }}
          >
            <TriangleAlert
              className="
                h-5
                w-5
                sm:h-[22px]
                sm:w-[22px]
              "
              color={
                config.danger
                  ? "#dc2626"
                  : "#2563eb"
              }
            />
          </div>

          <div
            className="
              min-w-0
              space-y-1.5
              sm:space-y-2
            "
          >
            <h2
              id="user-action-title"
              className="
                text-base
                font-semibold
                leading-5
                sm:text-lg
                sm:leading-6
              "
              style={{
                color:
                  "var(--admin-title)",
              }}
            >
              {config.title}
            </h2>

            <p
              className="
                text-xs
                leading-5
                sm:text-sm
                sm:leading-6
              "
              style={{
                color:
                  "var(--admin-muted)",
              }}
            >
              {config.description(
                fullName,
              )}
            </p>
          </div>
        </div>

        <div
          className="
            mt-5
            flex
            justify-end
            gap-2
            sm:mt-6
            sm:gap-3
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              h-9
              rounded-lg
              border
              px-4
              text-xs
              font-medium
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-10
              sm:rounded-xl
              sm:px-5
              sm:text-sm
            "
            style={{
              background:
                "var(--admin-button-secondary-bg)",
              color:
                "var(--admin-button-secondary-text)",
              borderColor:
                "var(--admin-button-secondary-border)",
            }}
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              px-4
              text-xs
              font-medium
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-10
              sm:gap-2
              sm:rounded-xl
              sm:px-5
              sm:text-sm
            "
            style={{
              background:
                config.danger
                  ? "var(--admin-button-danger-bg)"
                  : config.warning
                    ? "var(--admin-button-warning-bg)"
                    : action === "activate"
                      ? "var(--admin-button-success-bg)"
                      : "var(--admin-table-header-bg)",
              color:
                config.danger
                  ? "var(--admin-button-danger-text)"
                  : config.warning
                    ? "var(--admin-button-warning-text)"
                    : action === "activate"
                      ? "var(--admin-button-success-text)"
                      : "var(--admin-table-title)",
              borderColor:
                config.danger ||
                config.warning ||
                action === "activate"
                  ? "transparent"
                  : "var(--admin-card-border)",
              boxShadow:
                config.danger ||
                config.warning ||
                action === "activate"
                  ? undefined
                  : "0 1px 3px var(--admin-card-shadow)",
            }}
          >
            {loading && (
              <Loader2
                className="
                  h-3.5
                  w-3.5
                  animate-spin
                  sm:h-4
                  sm:w-4
                "
              />
            )}

            {loading
              ? "Processing..."
              : config.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}