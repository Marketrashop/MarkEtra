"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutDashboard,
  Users,
} from "lucide-react";

import Tooltip from "@/components/ui/Tooltip";

import { cn } from "@/lib/utils";

const items = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/deposits",
    label: "Deposits",
    icon: ArrowDownToLine,
  },
  {
    href: "/admin/withdrawals",
    label: "Withdrawals",
    icon: ArrowUpFromLine,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
];

type AdminBottomDockProps = {
  className?: string;
};

export default function AdminBottomDock({
  className,
}: AdminBottomDockProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        `
          fixed
          inset-x-0
          bottom-0
          z-50
          flex
          justify-center
          px-0
          sm:bottom-5
          sm:px-6
          lg:px-8
        `,
        className,
      )}
    >
      <div
        className="
          flex
          h-16
          w-full
          items-center
          justify-around
          border
          border-[var(--dock-border)]
          bg-[var(--dock-bg)]
          px-4
          shadow-[0_12px_32px_var(--dock-shadow)]
          backdrop-blur-2xl
          transition-colors
          duration-300
          sm:h-14
          sm:max-w-[540px]
          sm:justify-between
          sm:rounded-full
          sm:px-2
        "
      >
        {items.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active =
              pathname === href ||
              pathname.startsWith(
                `${href}/`,
              );

            return (
              <Tooltip
                key={href}
                label={label}
              >
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    `
                      group
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[var(--dock-item-border)]
                      bg-[var(--dock-item-bg)]
                      transition-all
                      duration-300
                    `,
                    active
                      ? `
                          border-[var(--dock-active-bg)]
                          bg-[var(--dock-active-bg)]
                          text-[var(--dock-active-text)]
                          shadow-[0_8px_20px_var(--dock-active-shadow)]
                        `
                      : `
                          text-[var(--dock-icon)]
                          hover:border-[var(--dock-hover-border)]
                          hover:bg-[var(--dock-hover)]
                          hover:text-[var(--dock-icon-hover)]
                        `,
                  )}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                    className={cn(
                      active
                        ? "text-[var(--dock-active-text)]"
                        : `
                            text-[var(--dock-icon)]
                            transition-colors
                            duration-300
                            group-hover:text-[var(--dock-icon-hover)]
                          `,
                    )}
                  />
                </Link>
              </Tooltip>
            );
          },
        )}
      </div>
    </div>
  );
}