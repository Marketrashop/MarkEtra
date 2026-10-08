"use client";

import type {
  SubscriptionPlan,
} from "@/types/plan.types";

import { X } from "lucide-react";

type ViewPlanDialogProps = {
  open: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
};

type RowProps = {
  label: string;
  value: React.ReactNode;
};

function Row({
  label,
  value,
}: RowProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-3
        border-b
        pb-2.5
        last:border-b-0
        last:pb-0
        sm:gap-4
        sm:pb-3
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          sm:text-xs
        "
        style={{
          color:
            "var(--admin-text-muted)",
          borderColor:
            "var(--admin-card-border)",
        }}
      >
        {label}
      </span>

      <span
        className="
          max-w-[62%]
          break-words
          text-right
          text-[11px]
          font-medium
          sm:max-w-[60%]
          sm:text-sm
        "
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ViewPlanDialog({
  open,
  plan,
  onClose,
}: ViewPlanDialogProps) {
  if (!open || !plan) {
    return null;
  }

  const currentPlan = plan;

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
          "var(--admin-modal-overlay)",
      }}
      onClick={onClose}
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
          onClick={(event) =>
            event.stopPropagation()
          }
          className="
            relative
            max-h-[calc(100vh-1.5rem)]
            w-full
            max-w-xl
            overflow-hidden
            rounded-lg
            border
            sm:max-h-[calc(100vh-3rem)]
            sm:rounded-[var(--admin-radius-lg)]
          "
          style={{
            background:
              "var(--admin-card-bg)",
            borderColor:
              "var(--admin-card-border)",
            boxShadow:
              "var(--admin-shadow-lg)",
          }}
        >
          <div
            className="
              relative
              border-b
              px-3
              py-2.5
              sm:p-5
            "
            style={{
              borderColor:
                "var(--admin-card-border)",
            }}
          >
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="
                absolute
                right-2.5
                top-2.5
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                transition-colors
                hover:bg-white/10
                sm:right-4
                sm:top-4
                sm:h-9
                sm:w-9
              "
            >
              <X
                size={14}
                className="sm:hidden"
              />

              <X
                size={18}
                className="hidden sm:block"
              />
            </button>

            <h2
              className="
                text-sm
                font-semibold
                sm:text-lg
              "
              style={{
                color:
                  "var(--admin-text)",
              }}
            >
              Plan Details
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
                  "var(--admin-text-muted)",
              }}
            >
              View subscription plan information.
            </p>
          </div>

          <div
            className="
              space-y-2.5
              overflow-y-auto
              px-3
              py-3
              sm:space-y-4
              sm:p-5
            "
            style={{
              maxHeight:
                "calc(100vh - 11rem)",
            }}
          >
            <Row
              label="Name"
              value={currentPlan.name}
            />

            <Row
              label="Slug"
              value={currentPlan.slug}
            />

            <Row
              label="Description"
              value={
                currentPlan.description ??
                "No description"
              }
            />

            <Row
              label="Price"
              value={`$${currentPlan.price.toLocaleString()}`}
            />

            <Row
              label="Commission"
              value={`${currentPlan.commissionRate}%`}
            />

            <Row
              label="Product Limit"
              value={
                currentPlan.maxPublishedProducts
              }
            />

            <Row
              label="Priority"
              value={
                currentPlan.priorityLevel
              }
            />

            <Row
              label="Badge"
              value={
                <span
                  className="
                    inline-flex
                    rounded-full
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-medium
                    text-white
                    sm:px-2
                    sm:py-1
                    sm:text-xs
                  "
                  style={{
                    backgroundColor:
                      currentPlan.badgeColor,
                  }}
                >
                  {currentPlan.badgeName}
                </span>
              }
            />

            <Row
              label="Duration"
              value={`${currentPlan.durationInDays} days`}
            />

            <Row
              label="Status"
              value={
                currentPlan.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

            <Row
              label="Sort Order"
              value={currentPlan.sortOrder}
            />

            <Row
              label="Created"
              value={new Date(
                currentPlan.createdAt,
              ).toLocaleString()}
            />

            <Row
              label="Updated"
              value={new Date(
                currentPlan.updatedAt,
              ).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}