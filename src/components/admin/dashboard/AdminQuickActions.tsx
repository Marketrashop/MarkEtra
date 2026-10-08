"use client";

import {
  ArrowRight,
  CreditCard,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { NavigationLink } from "@/components/ui/Preloader";

const actions = [
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/deposit-methods",
    label: "Deposits",
    icon: CreditCard,
  },
];

export default function AdminQuickActions() {
  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        sm:rounded-[var(--admin-card-radius)]
        sm:p-[var(--admin-card-padding)]
      "
    >
      <div
        className="
          mb-2.5
          flex
          items-center
          justify-between
          sm:mb-4
        "
      >
        <h2
          className="
            text-[12px]
            font-semibold
            text-[var(--admin-title)]
            sm:text-[15px]
          "
        >
          Quick Actions
        </h2>

        <ArrowRight
          size={12}
          className="
            text-[var(--admin-muted)]
            sm:h-4
            sm:w-4
          "
        />
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-1.5
          sm:gap-3
        "
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <NavigationLink
              key={action.href}
              href={action.href}
              className="
                flex
                items-center
                gap-1.5
                rounded-md
                border
                border-[var(--admin-surface-border)]
                bg-[var(--admin-surface-bg)]
                p-2
                transition-all
                duration-[var(--admin-transition)]
                hover:border-[var(--admin-primary)]
                sm:gap-3
                sm:rounded-[var(--admin-surface-radius)]
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--admin-stat-border)]
                  bg-[var(--admin-stat-bg)]
                  sm:h-9
                  sm:w-9
                "
              >
                <Icon
                  size={12}
                  className="
                    text-[var(--admin-primary)]
                    sm:h-4
                    sm:w-4
                  "
                />
              </div>

              <span
                className="
                  truncate
                  text-[9px]
                  font-medium
                  text-[var(--admin-text)]
                  sm:text-[13px]
                "
              >
                {action.label}
              </span>
            </NavigationLink>
          );
        })}
      </div>
    </section>
  );
}