"use client";

import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-2.5
        sm:flex-row
        sm:items-start
        sm:justify-between
        sm:gap-4
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <h1
          className="
            text-[13px]
            font-bold
            tracking-tight
            sm:text-3xl
          "
        >
          {title}
        </h1>

        {description ? (
          <p
            className="
              mt-0.5
              max-w-[340px]
              text-[9px]
              leading-3.5
              text-[var(--foreground-muted)]
              sm:mt-2
              sm:max-w-3xl
              sm:text-sm
              sm:leading-normal
            "
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div
          className="
            shrink-0
            self-start
          "
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}