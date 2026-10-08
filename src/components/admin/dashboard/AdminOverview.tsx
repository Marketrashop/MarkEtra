"use client";

import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import { NavigationLink } from "@/components/ui/Preloader";

type AdminOverviewProps = {
  pendingUsers: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingAffiliateProducts: number;
};

export default function AdminOverview({
  pendingUsers,
  pendingDeposits,
  pendingWithdrawals,
  pendingAffiliateProducts,
}: AdminOverviewProps) {
  const items = [
    {
      title: "User Verifications",
      value: pendingUsers,
      href: "/admin/kyc",
      icon: ShieldCheck,
    },
    {
      title: "Pending Deposits",
      value: pendingDeposits,
      href: "/admin/deposits",
      icon: CreditCard,
    },
    {
      title: "Pending Withdrawals",
      value: pendingWithdrawals,
      href: "/admin/withdrawals",
      icon: Wallet,
    },
    {
      title: "Affiliate Reviews",
      value: pendingAffiliateProducts,
      href: "/admin/affiliate",
      icon: ShoppingBag,
    },
  ];

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
        <div className="min-w-0">
          <h2
            className="
              text-[12px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-base
            "
          >
            Overview
          </h2>

          <p
            className="
              mt-0.5
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:text-xs
              sm:leading-4
            "
          >
            Items requiring attention.
          </p>
        </div>
      </div>

      <div
        className="
          grid
          gap-1.5
          sm:grid-cols-2
          sm:gap-3
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavigationLink
              key={item.title}
              href={item.href}
              className="
                group
                flex
                items-center
                justify-between
                gap-2
                rounded-md
                border
                border-[var(--admin-surface-border)]
                bg-[var(--admin-surface-bg)]
                p-2
                transition-all
                duration-[var(--admin-transition)]
                hover:opacity-90
                sm:rounded-[var(--admin-surface-radius)]
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                  sm:gap-3
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
                    text-[var(--admin-primary)]
                    sm:h-10
                    sm:w-10
                  "
                >
                  <Icon
                    size={13}
                    className="
                      sm:h-[18px]
                      sm:w-[18px]
                    "
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[9px]
                      leading-3.5
                      text-[var(--admin-muted)]
                      sm:text-xs
                      sm:leading-4
                    "
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-bold
                      leading-4
                      text-[var(--admin-title)]
                      sm:mt-1
                      sm:text-lg
                      sm:leading-5
                    "
                  >
                    {item.value}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={12}
                className="
                  shrink-0
                  text-[var(--admin-muted)]
                  transition-transform
                  duration-[var(--admin-transition)]
                  group-hover:translate-x-1
                  sm:h-4
                  sm:w-4
                "
              />
            </NavigationLink>
          );
        })}
      </div>
    </section>
  );
}