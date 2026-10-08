"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import {
  ChevronRight,
  House,
} from "lucide-react";

import UserContainer from "./DashboardContainer";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardBreadcrumbProps = {
  environment: "user" | "admin";

  items: BreadcrumbItem[];

  className?: string;
};

export default function DashboardBreadcrumb({
  environment,
  items,
  className,
}: DashboardBreadcrumbProps) {
  const root =
    environment === "admin"
      ? {
          href: "/admin/dashboard",
          label: "Dashboard",
        }
      : {
          href: "/Dashboard",
          label: "Dashboard",
        };

  return (
    <section
      className={`
        w-full

        border-b

        border-[var(--dashboard-breadcrumb-border)]

        mb-3
        sm:mb-[var(--dashboard-breadcrumb-margin-bottom)]

        bg-[var(--dashboard-breadcrumb-bg)]

        transition-colors
        duration-300

        ${className ?? ""}
      `}
    >
      <UserContainer>
        <div
          className="
            flex

            h-[var(--dashboard-breadcrumb-height)]

            items-center
          "
        >
          <nav
            aria-label="Breadcrumb"
            className="
              flex

              flex-wrap

              items-center

              gap-[var(--dashboard-breadcrumb-gap)]

              text-[var(--dashboard-breadcrumb-font-size)]

              font-[var(--dashboard-breadcrumb-font-weight)]

              text-[var(--dashboard-breadcrumb-text)]

              sm:text-[var(--dashboard-breadcrumb-font-size-desktop)]
            "
          >
<NavigationLink
  href={root.href}
  className="
    flex
    items-center
    gap-1.5
    transition-colors
    duration-300
    hover:text-[var(--dashboard-breadcrumb-hover)]
  "
>
  <House
    size={15}
    strokeWidth={2}
  />

  {root.label}
</NavigationLink>

            {items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="
                  flex

                  items-center

                  gap-[var(--dashboard-breadcrumb-gap)]
                "
              >
                <ChevronRight
                  size={16}
                  strokeWidth={2}
                  className="
                    shrink-0

                    text-[var(--dashboard-breadcrumb-text)]
                  "
                />

                {item.href ? (
<NavigationLink
  href={item.href}
  className="
    transition-colors
    duration-300
    hover:text-[var(--dashboard-breadcrumb-hover)]
  "
>
  {item.label}
</NavigationLink>
                ) : (
                  <span
                    className="
                      max-w-[var(--dashboard-breadcrumb-max-width)]

                      truncate

                      font-semibold

                      text-[var(--dashboard-breadcrumb-active)]

                      sm:max-w-none
                    "
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </UserContainer>
    </section>
  );
}