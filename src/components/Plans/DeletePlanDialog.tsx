"use client";

import { X } from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  SubscriptionPlan,
} from "@/types/plan.types";

type DeletePlanDialogProps = {
  open: boolean;
  loading?: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onConfirm: (
    planId: string,
  ) => Promise<void> | void;
};

export default function DeletePlanDialog({
  open,
  loading = false,
  plan,
  onClose,
  onConfirm,
}: DeletePlanDialogProps) {
  if (!open || !plan) {
    return null;
  }

  const currentPlan = plan;

  async function handleDelete() {
    await onConfirm(
      currentPlan.id,
    );
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-y-auto
        bg-black/60
        p-2
        backdrop-blur-md
        sm:p-4
      "
    >
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          py-3
          sm:py-6
        "
      >
        <div
          className="
            w-full
            max-w-md
            overflow-hidden
            rounded-xl
            border
            sm:rounded-[var(--admin-modal-radius)]
          "
          style={{
            background:
              "var(--admin-modal-bg)",
            borderColor:
              "var(--admin-modal-border)",
            boxShadow:
              "var(--admin-modal-shadow)",
          }}
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-2
              border-b
              px-3
              py-2.5
              sm:px-5
              sm:py-4
            "
            style={{
              background:
                "var(--admin-modal-header-bg)",
              borderColor:
                "var(--admin-modal-border)",
            }}
          >
            <h2
              className="
                text-sm
                font-semibold
                sm:text-lg
              "
              style={{
                color:
                  "var(--admin-title)",
              }}
            >
              Delete Plan
            </h2>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                loading
              }
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                transition-opacity
                hover:opacity-70
                sm:h-auto
                sm:w-auto
                sm:p-2
              "
              aria-label="Close dialog"
            >
              <X
                size={15}
                className="sm:hidden"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              />

              <X
                size={18}
                className="hidden sm:block"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              />
            </button>
          </div>

          <div
            className="
              space-y-2.5
              px-3
              py-3
              sm:space-y-4
              sm:px-5
              sm:py-5
            "
          >
            <p
              className="
                text-[11px]
                leading-5
                sm:text-sm
                sm:leading-6
              "
              style={{
                color:
                  "var(--admin-text)",
              }}
            >
              Are you sure you want to
              permanently delete{" "}
              <span className="font-semibold">
                {currentPlan.name}
              </span>
              ?
            </p>

            <div
              className="
                rounded-lg
                border
                p-2.5
                sm:rounded-[var(--admin-surface-radius)]
                sm:p-3
              "
              style={{
                background:
                  "var(--admin-surface-bg)",
                borderColor:
                  "var(--admin-surface-border)",
              }}
            >
              <p
                className="
                  text-[10px]
                  leading-4
                  sm:text-xs
                  sm:leading-normal
                "
                style={{
                  color:
                    "var(--admin-muted)",
                }}
              >
                This action cannot be
                undone.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              justify-end
              border-t
              px-3
              py-2.5
              sm:px-5
              sm:py-4
            "
            style={{
              background:
                "var(--admin-modal-footer-bg)",
              borderColor:
                "var(--admin-modal-border)",
            }}
          >
            <Button
              type="button"
              onClick={
                handleDelete
              }
              disabled={
                loading
              }
              className="
                w-full
                !h-8
                !px-3
                !text-[10px]
                sm:w-auto
                sm:!h-auto
                sm:!px-4
                sm:!py-2
                sm:!text-sm
              "
              style={{
                background:
                  "var(--admin-button-danger-bg)",
                color:
                  "var(--admin-button-danger-text)",
              }}
            >
              {loading
                ? "Deleting..."
                : "Delete Plan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}