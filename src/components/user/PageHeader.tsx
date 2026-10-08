"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;

  description?: string;

  action?: ReactNode;

  className?: string;
};

export default function PageHeader({
  title,

  description,

  action,

  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        `
          mb-4
          flex
          flex-col
          gap-2.5
          sm:mb-8
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:gap-4
        `,
        className,
      )}
    >
      <div className="min-w-0">
        <h1
          className="
            text-[18px]
            font-bold
            leading-tight
            tracking-[-0.03em]
            text-[var(--foreground)]
            sm:text-[24px]
            lg:text-[28px]
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-1.5
              max-w-2xl
              text-[11px]
              leading-5
              text-[var(--foreground-muted)]
              sm:mt-2
              sm:text-[15px]
              sm:leading-7
            "
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div
          className="
            shrink-0
          "
        >
          {action}
        </div>
      )}
    </header>
  );
}