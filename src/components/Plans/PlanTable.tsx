"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  SubscriptionPlan,
} from "@/types/plan.types";

type PlanTableProps = {
  plans: SubscriptionPlan[];
  loading?: boolean;
  onView: (
    plan: SubscriptionPlan,
  ) => void;
  onEdit: (
    plan: SubscriptionPlan,
  ) => void;
  onDelete: (
    plan: SubscriptionPlan,
  ) => void;
};

export default function PlanTable({
  plans,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: PlanTableProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-lg
          border
          p-5
          text-center
          sm:rounded-[var(--admin-card-radius)]
          sm:p-8
        "
        style={{
          background:
            "var(--admin-card-bg)",
          borderColor:
            "var(--admin-card-border)",
          boxShadow:
            "var(--admin-card-shadow)",
        }}
      >
        <p
          className="
            text-[11px]
            sm:text-sm
          "
          style={{
            color:
              "var(--admin-muted)",
          }}
        >
          Loading plans...
        </p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          p-5
          text-center
          sm:rounded-[var(--admin-card-radius)]
          sm:p-8
        "
        style={{
          background:
            "var(--admin-empty-bg)",
          borderColor:
            "var(--admin-empty-border)",
          boxShadow:
            "var(--admin-empty-shadow)",
        }}
      >
        <h3
          className="
            text-sm
            font-semibold
            sm:text-base
          "
          style={{
            color:
              "var(--admin-empty-title)",
          }}
        >
          No subscription plans
        </h3>

        <p
          className="
            mt-1.5
            text-[10px]
            leading-4
            sm:mt-2
            sm:text-sm
            sm:leading-normal
          "
          style={{
            color:
              "var(--admin-empty-text)",
          }}
        >
          Create your first plan to begin offering subscriptions.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          hidden
          overflow-hidden
          rounded-[var(--admin-card-radius)]
          border
          lg:block
        "
        style={{
          background:
            "var(--admin-table-bg)",
          borderColor:
            "var(--admin-table-border)",
          boxShadow:
            "var(--admin-card-shadow)",
        }}
      >
        <table className="w-full">
          <thead
            style={{
              background:
                "var(--admin-table-header-bg)",
            }}
          >
            <tr>
              <Header>
                Plan
              </Header>

              <Header>
                Price
              </Header>

              <Header>
                Commission
              </Header>

              <Header>
                Products
              </Header>

              <Header>
                Duration
              </Header>

              <Header>
                Status
              </Header>

              <Header align="center">
                Actions
              </Header>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="transition-colors"
                style={{
                  borderColor:
                    "var(--admin-table-border)",
                }}
              >
                <Cell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {plan.name}
                      </span>

                      <span
                        className="
                          rounded-full
                          px-2
                          py-0.5
                          text-[10px]
                          font-semibold
                          text-white
                        "
                        style={{
                          backgroundColor:
                            plan.badgeColor,
                        }}
                      >
                        {plan.badgeName}
                      </span>
                    </div>

                    <p
                      className="text-xs"
                      style={{
                        color:
                          "var(--admin-muted)",
                      }}
                    >
                      {plan.slug}
                    </p>
                  </div>
                </Cell>

                <Cell>
                  $
                  {plan.price.toLocaleString()}
                </Cell>

                <Cell>
                  {plan.commissionRate}%
                </Cell>

                <Cell>
                  {
                    plan.maxPublishedProducts
                  }
                </Cell>

                <Cell>
                  {
                    plan.durationInDays
                  }{" "}
                  days
                </Cell>

                <Cell>
                  <StatusBadge
                    active={
                      plan.isActive
                    }
                  />
                </Cell>

                <Cell align="center">
                  <div className="flex justify-center gap-2">
                    <ActionButton
                      label="View"
                      onClick={() =>
                        onView(plan)
                      }
                    >
                      <Eye size={16} />
                    </ActionButton>

                    <ActionButton
                      label="Edit"
                      onClick={() =>
                        onEdit(plan)
                      }
                    >
                      <Pencil size={16} />
                    </ActionButton>

                    <ActionButton
                      label="Delete"
                      danger
                      onClick={() =>
                        onDelete(plan)
                      }
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="
          space-y-2.5
          lg:hidden
          sm:space-y-3
        "
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="
              rounded-lg
              border
              p-2.5
              sm:rounded-[var(--admin-card-radius)]
              sm:p-4
            "
            style={{
              background:
                "var(--admin-card-bg)",
              borderColor:
                "var(--admin-card-border)",
              boxShadow:
                "var(--admin-card-shadow)",
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
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                    sm:gap-2
                  "
                >
                  <h3
                    className="
                      truncate
                      text-xs
                      font-semibold
                      sm:text-base
                    "
                    style={{
                      color:
                        "var(--admin-title)",
                    }}
                  >
                    {plan.name}
                  </h3>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      px-1.5
                      py-0.5
                      text-[8px]
                      font-semibold
                      text-white
                      sm:px-2
                      sm:text-[10px]
                    "
                    style={{
                      backgroundColor:
                        plan.badgeColor,
                    }}
                  >
                    {plan.badgeName}
                  </span>
                </div>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[9px]
                    sm:mt-1
                    sm:text-xs
                  "
                  style={{
                    color:
                      "var(--admin-muted)",
                  }}
                >
                  {plan.slug}
                </p>
              </div>

              <StatusBadge
                active={
                  plan.isActive
                }
              />
            </div>

            <div
              className="
                mt-2.5
                grid
                grid-cols-2
                gap-1.5
                text-xs
                sm:mt-4
                sm:gap-3
                sm:text-sm
              "
            >
              <Info
                label="Price"
                value={`$${plan.price.toLocaleString()}`}
              />

              <Info
                label="Commission"
                value={`${plan.commissionRate}%`}
              />

              <Info
                label="Products"
                value={
                  plan.maxPublishedProducts
                }
              />

              <Info
                label="Duration"
                value={`${plan.durationInDays} days`}
              />
            </div>

            <div
              className="
                mt-2.5
                flex
                gap-1.5
                sm:mt-4
                sm:gap-2
              "
            >
              <ActionButton
                className="flex-1"
                label="View"
                onClick={() =>
                  onView(plan)
                }
              >
                <Eye
                  size={14}
                  className="sm:hidden"
                />
                <Eye
                  size={16}
                  className="hidden sm:block"
                />
              </ActionButton>

              <ActionButton
                className="flex-1"
                label="Edit"
                onClick={() =>
                  onEdit(plan)
                }
              >
                <Pencil
                  size={14}
                  className="sm:hidden"
                />
                <Pencil
                  size={16}
                  className="hidden sm:block"
                />
              </ActionButton>

              <ActionButton
                className="flex-1"
                label="Delete"
                danger
                onClick={() =>
                  onDelete(plan)
                }
              >
                <Trash2
                  size={14}
                  className="sm:hidden"
                />
                <Trash2
                  size={16}
                  className="hidden sm:block"
                />
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Header({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold ${
        align === "center"
          ? "text-center"
          : "text-left"
      }`}
      style={{
        color:
          "var(--admin-table-header-text)",
      }}
    >
      {children}
    </th>
  );
}

function Cell({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <td
      className={`border-t px-4 py-3 text-sm ${
        align === "center"
          ? "text-center"
          : "text-left"
      }`}
      style={{
        color:
          "var(--admin-table-text)",
        borderColor:
          "var(--admin-table-border)",
      }}
    >
      {children}
    </td>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        px-2
        py-1.5
        sm:rounded-none
        sm:border-0
        sm:p-0
      "
      style={{
        background:
          "var(--admin-table-header-bg)",
        borderColor:
          "var(--admin-card-border)",
      }}
    >
      <p
        className="
          text-[8px]
          sm:text-xs
        "
        style={{
          color:
            "var(--admin-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          text-[11px]
          font-medium
          sm:mt-1
          sm:text-sm
        "
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  className?: string;
  onClick: () => void;
};

function ActionButton({
  children,
  label,
  danger = false,
  className,
  onClick,
}: ActionButtonProps) {
  return (
    <Button
      type="button"
      title={label}
      aria-label={label}
      className={`
        h-7
        min-w-0
        p-0
        text-[9px]
        sm:h-9
        sm:w-9
        sm:text-sm
        ${className ?? ""}
      `}
      onClick={onClick}
      style={
        danger
          ? {
              background:
                "var(--admin-button-danger-bg)",
              color:
                "var(--admin-button-danger-text)",
            }
          : undefined
      }
    >
      {children}
    </Button>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className="
        inline-flex
        shrink-0
        items-center
        rounded-full
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        sm:px-2.5
        sm:py-1
        sm:text-[10px]
      "
      style={{
        background: active
          ? "var(--admin-status-success-bg)"
          : "var(--admin-status-failed-bg)",
        color: active
          ? "var(--admin-status-success-text)"
          : "var(--admin-status-failed-text)",
      }}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}