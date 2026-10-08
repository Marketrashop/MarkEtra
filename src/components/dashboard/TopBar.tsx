"use client";

import {
  ReactNode,
} from "react";

import {
  Search,
} from "lucide-react";

import {
  useCartContext,
} from "@/context/CartContext";

import {
  useSearchContext,
} from "@/context/AppSearchContext";

import {
  cn,
} from "@/lib/utils";

import UserContainer from "./DashboardContainer";

type TopBarProps = {
  left?: ReactNode;

  center?: ReactNode;

  right?: ReactNode;

  className?: string;
};

export default function TopBar({
  left,
  center,
  right,
  className,
}: TopBarProps) {
  const {
    cartOpen,
  } = useCartContext();

  const {
    openSearch,
  } =
    useSearchContext();

  return (
    <header
      className={cn(
        `
          sticky
          top-0
          z-40
          border-b
          border-[var(--border)]
          bg-[color-mix(in_srgb,var(--background)_92%,transparent)]
          backdrop-blur-xl
          transition-all
          duration-300
        `,
        cartOpen &&
          "pointer-events-none -translate-y-full opacity-0",
        className,
      )}
    >
      <UserContainer>
        <div
          className="
            flex
            h-[72px]
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
            "
          >
            {left}
          </div>

          {center && (
            <>
              <button
                type="button"
                aria-label="Search products"
                onClick={
                  openSearch
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  text-[var(--foreground-muted)]
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-[var(--primary)]
                  hover:text-[var(--primary)]
                  hover:shadow-md
                  active:scale-95
                  lg:hidden
                "
              >
                <Search
                  size={18}
                  strokeWidth={2.2}
                />
              </button>

              <div
                className="
                  hidden
                  flex-1
                  justify-center
                  lg:flex
                "
              >
                <div
                  className="
                    hidden
                    flex-1
                    justify-end
                    pr-4
                    lg:flex
                    xl:pr-6
                  "
                >
                  <div
                    className="
                      w-[240px]
                    "
                  >
                    {center}
                  </div>
                </div>
              </div>
            </>
          )}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            {right}
          </div>
        </div>
      </UserContainer>
    </header>
  );
}