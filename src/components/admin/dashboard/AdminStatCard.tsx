"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { ChevronRight } from "lucide-react";

import { ReactNode } from "react";

type AdminStatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  href?: string;
};

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  href,
}: AdminStatCardProps) {
  const content = (
    <div
      className="
        flex
        h-full
        flex-col
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        transition-all
        duration-[var(--admin-card-transition)]
        hover:-translate-y-0.5
        sm:rounded-[var(--admin-card-radius)]
        sm:p-[var(--admin-card-padding)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2
          sm:gap-4
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
            rounded-md
            border
            border-[var(--admin-surface-border)]
            bg-[var(--admin-surface-bg)]
            text-[var(--admin-primary)]
            sm:h-10
            sm:w-10
            sm:rounded-[var(--admin-surface-radius)]
          "
        >
          {icon}
        </div>

        {href && (
          <ChevronRight
            size={12}
            className="
              text-[var(--admin-muted)]
              sm:h-4
              sm:w-4
            "
          />
        )}
      </div>

      <div
        className="
          mt-2
          space-y-0.5
          sm:mt-4
          sm:space-y-1
        "
      >
        <p
          className="
            text-[9px]
            font-medium
            leading-3.5
            text-[var(--admin-muted)]
            sm:text-xs
            sm:leading-4
          "
        >
          {title}
        </p>

        <h2
          className="
            text-lg
            font-bold
            leading-none
            text-[var(--admin-title)]
            sm:text-2xl
          "
        >
          {value}
        </h2>

        {subtitle && (
          <p
            className="
              text-[8px]
              leading-3
              text-[var(--admin-muted)]
              sm:text-xs
              sm:leading-4
            "
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <NavigationLink
        href={href}
        className="block"
      >
        {content}
      </NavigationLink>
    );
  }

  return content;
}