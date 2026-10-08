"use client";

import { ReactNode } from "react";

import AuthCard from "./AuthCard";

type AuthFormProps = {
  title: string;

  description?: string;

  children: ReactNode;

  footer?: ReactNode;

  className?: string;
};

export default function AuthForm({
  title,
  description,
  children,
  footer,
  className = "",
}: AuthFormProps) {
  return (
    <AuthCard className={className}>
      <header
        className="
          text-center
        "
      >
        <h1
          className="
            text-[22px]

            font-extrabold

            leading-tight

            tracking-[-0.02em]

            text-[var(--foreground)]

            sm:text-[26px]
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mx-auto

              mt-1.5

              max-w-[300px]

              text-[13px]

              leading-5

              text-[var(--foreground-muted)]

              sm:mt-2

              sm:max-w-[320px]

              sm:text-[14px]

              sm:leading-6
            "
          >
            {description}
          </p>
        )}
      </header>

<div
  className="
    mt-6

    space-y-4
  "
>
  {children}
</div>

{footer && (
  <footer
    className="
      mt-6

      border-t

      border-[var(--border)]

      pt-4
    "
  >
    {footer}
  </footer>
)}
    </AuthCard>
  );
}