"use client";

import Button from "@/components/ui/Button";

import type {
  SubscriptionPlan,
} from "@/types/plan.types";

type PlanCardProps = {
  plan: SubscriptionPlan;

  current?: boolean;

  hasActiveSubscription?: boolean;

  disabled?: boolean;

  onSubscribe?: (
    plan: SubscriptionPlan,
  ) => void;
};

export function PlanCard({
  plan,
  current = false,
  hasActiveSubscription = false,
  disabled = false,
  onSubscribe,
}: PlanCardProps) {
  const buttonLabel = current
    ? "Current"
    : hasActiveSubscription
      ? "Upgrade"
      : "Subscribe";

  return (
    <div
      className={`
        flex
        h-full
        flex-col
        rounded-lg
        border
        p-3
        transition-all
        sm:rounded-[var(--user-radius-md)]
        sm:p-4
        ${
          disabled
            ? "opacity-60"
            : ""
        }
      `}
      style={{
        background:
          "var(--user-card-bg)",

        borderColor:
          current
            ? "var(--user-plan-active-border)"
            : "var(--user-card-border)",
      }}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2
          sm:gap-3
        "
      >
        <div className="min-w-0">
          <h3
            className="
              truncate
              text-sm
              font-semibold
              sm:text-base
            "
            style={{
              color:
                "var(--user-title)",
            }}
          >
            {plan.name}
          </h3>

          {plan.description && (
            <p
              className="
                mt-0.5
                line-clamp-2
                text-[10px]
                leading-4
                sm:mt-1
                sm:text-xs
                sm:leading-normal
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              {plan.description}
            </p>
          )}
        </div>

        <span
          className="
            shrink-0
            rounded-full
            border
            px-1.5
            py-0.5
            text-[9px]
            font-medium
            sm:px-2.5
            sm:py-1
            sm:text-[11px]
          "
          style={{
            background:
              "var(--user-plan-popular-bg)",

            borderColor:
              "var(--user-plan-popular-border)",

            color:
              plan.badgeColor,
          }}
        >
          {plan.badgeName}
        </span>
      </div>

      <div
        className="
          mt-3
          space-y-1.5
          sm:mt-4
          sm:space-y-2
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            px-2.5
            py-1.5
            sm:px-3
            sm:py-2
          "
          style={{
            background:
              "var(--user-stat-bg)",

            borderColor:
              "var(--user-stat-border)",
          }}
        >
          <span
            className="
              text-[10px]
              sm:text-xs
            "
            style={{
              color:
                "var(--user-text-muted)",
            }}
          >
            Price
          </span>

          <span
            className="
              text-xs
              font-semibold
              sm:text-sm
            "
            style={{
              color:
                "var(--user-title)",
            }}
          >
            $
            {plan.price.toLocaleString()}
          </span>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-1.5
            sm:gap-2
          "
        >
          <div
            className="
              rounded-lg
              border
              p-2
              sm:p-2.5
            "
            style={{
              background:
                "var(--user-stat-bg)",

              borderColor:
                "var(--user-stat-border)",
            }}
          >
            <p
              className="
                text-[9px]
                sm:text-[11px]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              Commission
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-semibold
                sm:mt-1
                sm:text-sm
              "
              style={{
                color:
                  "var(--user-title)",
              }}
            >
              {plan.commissionRate}%
            </p>
          </div>

          <div
            className="
              rounded-lg
              border
              p-2
              sm:p-2.5
            "
            style={{
              background:
                "var(--user-stat-bg)",

              borderColor:
                "var(--user-stat-border)",
            }}
          >
            <p
              className="
                text-[9px]
                sm:text-[11px]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              Products
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-semibold
                sm:mt-1
                sm:text-sm
              "
              style={{
                color:
                  "var(--user-title)",
              }}
            >
              {
                plan.maxPublishedProducts
              }
            </p>
          </div>

          <div
            className="
              col-span-2
              rounded-lg
              border
              p-2
              sm:p-2.5
            "
            style={{
              background:
                "var(--user-stat-bg)",

              borderColor:
                "var(--user-stat-border)",
            }}
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-[9px]
                  sm:text-[11px]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Duration
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  sm:text-sm
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                {
                  plan.durationInDays
                }{" "}
                days
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="
          mt-3
          h-8
          w-full
          text-[10px]
          sm:mt-4
          sm:h-10
          sm:text-sm
        "
        disabled={
          current ||
          disabled
        }
        onClick={() =>
          onSubscribe?.(
            plan,
          )
        }
      >
        {buttonLabel}
      </Button>
    </div>
  );
}