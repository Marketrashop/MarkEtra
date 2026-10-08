"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import {
  ChevronRight,
  House,
} from "lucide-react";

type BreadcrumbItem = {
  label: string;

  href?: string;
};

type PageBreadcrumbProps = {
  homeHref?: string;

  items: BreadcrumbItem[];
};

export default function PageBreadcrumb({
  homeHref = "/",

  items,
}: PageBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex
        flex-wrap
        items-center
        justify-center
        gap-1.5
        text-[10px]
        font-medium
        text-[var(--foreground-muted)]
        sm:gap-2
        sm:text-[14px]
      "
    >
      <NavigationLink
        href={homeHref}
        className="
          flex
          items-center
          gap-1
          transition-colors
          duration-300
          hover:text-[var(--primary)]
          sm:gap-1.5
        "
      >
        <House
          size={12}
          strokeWidth={2}
          className="
            sm:h-[15px]
            sm:w-[15px]
          "
        />

        Home
      </NavigationLink>

      {items.map(
        (
          item,
          index,
        ) => (
          <div
            key={`${item.label}-${index}`}
            className="
              flex
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            <ChevronRight
              size={12}
              strokeWidth={2}
              className="
                shrink-0
                text-[var(--foreground-muted)]
                sm:h-4
                sm:w-4
              "
            />

            {item.href ? (
              <NavigationLink
                href={item.href}
                className="
                  transition-colors
                  duration-300
                  hover:text-[var(--primary)]
                "
              >
                {item.label}
              </NavigationLink>
            ) : (
              <span
                className="
                  max-w-[180px]
                  truncate
                  font-semibold
                  text-[var(--foreground)]
                  sm:max-w-none
                "
              >
                {item.label}
              </span>
            )}
          </div>
        ),
      )}
    </nav>
  );
}