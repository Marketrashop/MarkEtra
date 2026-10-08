"use client";

import {
  Home,
  ShoppingBag,
  BriefcaseBusiness,
  Bookmark,
  FileText,
  Phone,
} from "lucide-react";

import { usePathname } from "next/navigation";

import {
  NavigationLink,
} from "@/components/ui/Preloader";

import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Shop",
    href: "/Shop",
    icon: ShoppingBag,
  },
  {
    label: "Services",
    href: "/Services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Plans",
    href: "/Plans",
    icon: Bookmark,
  },
  {
    label: "Blog",
    href: "/Blog",
    icon: FileText,
  },
  {
    label: "Contact",
    href: "/Contact",
    icon: Phone,
  },
];

type NavLinksProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

export default function NavLinks({
  className,
  orientation = "horizontal",
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  const isVertical =
    orientation === "vertical";

  return (
    <ul
      className={cn(
        "flex",
        isVertical
          ? "flex-col"
          : "items-center gap-7",
        className,
      )}
    >
      {navigation.map(
        (item, index) => {
          const Icon =
            item.icon;

          const active =
            pathname === item.href;

          return (
            <li
              key={item.href}
              className={cn(
                isVertical &&
                  "border-b border-[var(--border)] last:border-b-0",
              )}
            >
              <NavigationLink
                href={item.href}
                onClick={(event) => {
                  if (pathname === item.href) {
                    event.preventDefault();

                    return;
                  }

                  onNavigate?.();
                }}
                className={cn(
                  "font-medium transition-all duration-200 hover:text-[var(--primary)]",
                  isVertical
                    ? `
                      relative
                      flex
                      min-h-[46px]
                      items-center
                      gap-2.5
                      py-0.5
                      pl-3
                      text-[14px]
                    `
                    : "text-[14px] font-bold uppercase tracking-[0.04em] text-[var(--foreground)]",
                  active &&
                    "text-[var(--primary)]",
                )}
              >
                {isVertical && (
                  <>
                    {active && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-7
                          w-1
                          -translate-y-1/2
                          rounded-full
                          bg-[var(--primary)]
                        "
                      />
                    )}

                    <Icon
                      size={18}
                      strokeWidth={2.1}
                      className="shrink-0"
                    />
                  </>
                )}

                <span>
                  {item.label}
                </span>
              </NavigationLink>
            </li>
          );
        },
      )}
    </ul>
  );
}