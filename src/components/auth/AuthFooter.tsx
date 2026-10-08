"use client";

import { ReactNode } from "react";

type AuthFooterProps = {
  children: ReactNode;
};

export default function AuthFooter({
  children,
}: AuthFooterProps) {
  return (
    <footer
      className="
        mt-5

        border-t

        border-[var(--border)]

        pt-3.5

        text-center

        sm:mt-8

        sm:pt-5
      "
    >
      <div
        className="
          text-[12px]

          leading-5

          text-[var(--foreground-muted)]

          sm:text-[13px]

          sm:leading-6
        "
      >
        {children}
      </div>
    </footer>
  );
}