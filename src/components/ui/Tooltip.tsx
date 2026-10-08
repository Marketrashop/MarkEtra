"use client";

import { ReactNode } from "react";

type TooltipProps = {
  label: string;

  children: ReactNode;
};

export default function Tooltip({
  label,

  children,
}: TooltipProps) {
  return (
    <div
      className="
        group

        relative

        inline-flex
      "
    >
<div
  className="
    pointer-events-none

    absolute

    bottom-full

    left-1/2

    z-50

    mb-3

    hidden

    -translate-x-1/2

    translate-y-2

    opacity-0

    transition-all
    duration-200

    lg:block

    group-hover:translate-y-0

    group-hover:opacity-100
  "
>
        <div
          className="
            whitespace-nowrap

            rounded-xl

            border

            border-[var(--border)]

            bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]

            px-3

            py-1.5

            text-[12px]

            font-medium

            text-[var(--foreground)]

            shadow-xl

            backdrop-blur-xl
          "
        >
          {label}
        </div>

        <div
          className="
            absolute

            left-1/2

            top-full

            h-2.5

            w-2.5

            -translate-x-1/2

            -translate-y-1/2

            rotate-45

            border-r

            border-b

            border-[var(--border)]

            bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]
          "
        />
      </div>

      {children}
    </div>
  );
}