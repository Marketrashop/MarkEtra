"use client";

import { useState } from "react";

import { X } from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  SubscriptionPlan,
} from "@/types/plan.types";

type SubscribeDialogProps = {
  open: boolean;
  loading?: boolean;
  plan: SubscriptionPlan | null;
  hasActiveSubscription: boolean;
  onClose: () => void;
  onConfirm: (
    planId: string,
  ) => Promise<void> | void;
};

export default function SubscribeDialog({
  open,
  loading = false,
  plan,
  hasActiveSubscription,
  onClose,
  onConfirm,
}: SubscribeDialogProps) {
  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  if (!open || !plan) {
    return null;
  }

  async function handleConfirm() {
    if (!plan) {
      return;
    }

    try {
      setSubmitting(true);

      await onConfirm(plan.id);
    } finally {
      setSubmitting(false);
    }
  }

  const busy =
    loading || submitting;

  const isUpgrade =
    !!hasActiveSubscription;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-y-auto
        p-2
        backdrop-blur-md
        sm:p-4
      "
      style={{
        background:
          "var(--user-overlay)",
      }}
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
            max-h-[calc(100vh-1.5rem)]
            w-full
            max-w-md
            overflow-hidden
            rounded-lg
            border
            sm:max-h-[calc(100vh-3rem)]
            sm:rounded-[var(--user-radius-lg)]
          "
          style={{
            background:
              "var(--user-card-bg)",
            borderColor:
              "var(--user-card-border)",
            boxShadow:
              "var(--user-card-shadow)",
          }}
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-2
              border-b
              px-3
              py-2.5
              sm:gap-3
              sm:px-5
              sm:py-4
            "
            style={{
              borderColor:
                "var(--user-divider)",
            }}
          >
            <div className="min-w-0">
              <h2
                className="
                  text-sm
                  font-semibold
                  sm:text-base
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                {isUpgrade
                  ? "Confirm Upgrade"
                  : "Confirm Subscription"}
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  leading-4
                  sm:mt-1
                  sm:text-sm
                  sm:leading-normal
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                You are about to
                {isUpgrade
                  ? " upgrade to "
                  : " subscribe to "}
                <span
                  style={{
                    color:
                      "var(--user-title)",
                  }}
                >
                  {plan.name}
                </span>
                .
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
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
                size={14}
                className="sm:hidden"
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              />

              <X
                size={18}
                className="hidden sm:block"
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              />
            </button>
          </div>

          <div
            className="
              space-y-2
              overflow-y-auto
              px-3
              py-3
              sm:space-y-3
              sm:px-5
              sm:py-4
            "
            style={{
              maxHeight:
                "calc(100vh - 13rem)",
            }}
          >
            <Row
              label="Price"
              value={`$${plan.price.toLocaleString()}`}
            />

            <Row
              label="Commission"
              value={`${plan.commissionRate}%`}
            />

            <Row
              label="Products"
              value={String(
                plan.maxPublishedProducts,
              )}
            />

            <Row
              label="Duration"
              value={`${plan.durationInDays} days`}
            />
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
              borderColor:
                "var(--user-divider)",
            }}
          >
            <Button
              type="button"
              disabled={busy}
              onClick={handleConfirm}
              className="
                h-8
                min-w-24
                text-[10px]
                sm:h-10
                sm:min-w-28
                sm:text-sm
              "
              style={{
                background:
                  "var(--user-button-bg)",
                color:
                  "var(--user-button-text)",
              }}
            >
              {busy
                ? "Processing..."
                : hasActiveSubscription
                  ? "Upgrade"
                  : "Subscribe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
};

function Row({
  label,
  value,
}: RowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className="
          text-[10px]
          sm:text-sm
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {label}
      </span>

      <span
        className="
          text-[11px]
          font-semibold
          sm:text-sm
        "
        style={{
          color:
            "var(--user-title)",
        }}
      >
        {value}
      </span>
    </div>
  );
}