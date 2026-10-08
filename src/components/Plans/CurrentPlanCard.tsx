"use client";

import type {
  UserSubscription,
} from "@/types/subscription.types";

import {
  CalendarDays,
  Crown,
  Package,
  Percent,
} from "lucide-react";

type CurrentPlanCardProps = {
  subscription: UserSubscription | null;
  loading: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getDaysRemaining(
  expiresAt: string,
) {
  const now = Date.now();

  const end =
    new Date(expiresAt).getTime();

  return Math.max(
    Math.ceil(
      (end - now) /
        (1000 * 60 * 60 * 24),
    ),
    0,
  );
}

export function CurrentPlanCard({
  subscription,
  loading,
}: CurrentPlanCardProps) {
  if (loading) {
    return (
      <section
        className="
          animate-pulse
          rounded-lg
          border
          p-3
          sm:rounded-[var(--user-radius-md)]
          sm:p-5
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
        <div className="space-y-2.5 sm:space-y-4">
          <div
            className="
              h-5
              w-32
              rounded
              sm:h-6
              sm:w-40
            "
            style={{
              background:
                "var(--user-surface-secondary)",
            }}
          />

          <div
            className="
              grid
              grid-cols-2
              gap-1.5
              sm:gap-3
            "
          >
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  h-16
                  rounded-lg
                  sm:h-20
                  sm:rounded-[var(--user-radius-sm)]
                "
                style={{
                  background:
                    "var(--user-surface-secondary)",
                }}
              />
            ))}
          </div>

          <div
            className="
              h-1.5
              rounded-full
              sm:h-2
            "
            style={{
              background:
                "var(--user-surface-secondary)",
            }}
          />
        </div>
      </section>
    );
  }

  if (!subscription) {
    return (
      <section
        className="
          rounded-lg
          border
          p-3
          sm:rounded-[var(--user-radius-md)]
          sm:p-5
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
        <div className="space-y-0.5 sm:space-y-1">
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
            No Active Plan
          </h2>

          <p
            className="
              text-[10px]
              leading-4
              sm:text-sm
              sm:leading-normal
            "
            style={{
              color:
                "var(--user-text-muted)",
            }}
          >
            Subscribe to a plan to begin
            publishing affiliate
            products.
          </p>
        </div>
      </section>
    );
  }

  const daysRemaining =
    getDaysRemaining(
      subscription.expiresAt,
    );

  return (
    <section
      className="
        rounded-lg
        border
        p-3
        sm:rounded-[var(--user-radius-md)]
        sm:p-5
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
          flex-col
          gap-3
          md:flex-row
          md:items-start
          md:justify-between
          md:gap-5
        "
      >
        <div
          className="
            space-y-2
            sm:space-y-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-3
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                sm:h-10
                sm:w-10
              "
              style={{
                background:
                  "var(--user-surface-secondary)",
              }}
            >
              <Crown
                size={15}
                className="sm:hidden"
                style={{
                  color:
                    "var(--user-icon)",
                }}
              />

              <Crown
                size={18}
                className="hidden sm:block"
                style={{
                  color:
                    "var(--user-icon)",
                }}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-base
                  font-semibold
                  sm:text-lg
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                {
                  subscription.badgeName
                }
              </h2>

              <p
                className="
                  text-[9px]
                  sm:text-xs
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Current Subscription
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex
              rounded-full
              px-2
              py-0.5
              text-[9px]
              font-medium
              sm:px-3
              sm:py-1
              sm:text-xs
            "
            style={{
              background:
                "var(--user-badge-success-bg)",
              color:
                "var(--user-badge-success-text)",
            }}
          >
            {subscription.status}
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-1.5
            md:min-w-[340px]
            md:gap-3
          "
        >
          <InfoItem
            icon={
              <Percent
                size={13}
                className="sm:hidden"
              />
            }
            label="Commission"
            value={`${subscription.commissionRate}%`}
          />

          <InfoItem
            icon={
              <Package
                size={13}
                className="sm:hidden"
              />
            }
            label="Products"
            value={String(
              subscription.maxPublishedProducts,
            )}
          />

          <InfoItem
            icon={
              <CalendarDays
                size={13}
                className="sm:hidden"
              />
            }
            label="Started"
            value={formatDate(
              subscription.startsAt,
            )}
          />

          <InfoItem
            icon={
              <CalendarDays
                size={13}
                className="sm:hidden"
              />
            }
            label="Expires"
            value={formatDate(
              subscription.expiresAt,
            )}
          />
        </div>
      </div>

      <div
        className="
          mt-3
          space-y-1.5
          sm:mt-5
          sm:space-y-2
        "
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
              sm:text-xs
            "
            style={{
              color:
                "var(--user-text-muted)",
            }}
          >
            Days Remaining
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
            {daysRemaining} day
            {daysRemaining === 1
              ? ""
              : "s"}
          </span>
        </div>

        <div
          className="
            h-1.5
            overflow-hidden
            rounded-full
            sm:h-2
          "
          style={{
            background:
              "var(--user-progress-bg)",
          }}
        >
          <div
            className="
              h-full
              rounded-full
            "
            style={{
              width: `${Math.min(
                100,
                (daysRemaining / 30) *
                  100,
              )}%`,
              background:
                "var(--user-progress-fill)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div
      className="
        rounded-lg
        border
        p-2
        sm:rounded-[var(--user-radius-sm)]
        sm:p-3
      "
      style={{
        background:
          "var(--user-surface-secondary)",
        borderColor:
          "var(--user-divider)",
      }}
    >
      <div
        className="
          mb-1
          flex
          items-center
          gap-1.5
          sm:mb-2
          sm:gap-2
        "
        style={{
          color:
            "var(--user-icon-muted)",
        }}
      >
        {icon}

        <span
          className="
            text-[9px]
            sm:text-xs
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          truncate
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
      </p>
    </div>
  );
}