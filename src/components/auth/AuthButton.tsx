"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type AuthButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "primary"
      | "secondary"
      | "ghost";

    fullWidth?: boolean;

    loading?: boolean;

    loadingText?: string;

    leftIcon?: ReactNode;

    rightIcon?: ReactNode;
  };

export default function AuthButton({
  children,

  variant = "primary",

  fullWidth = true,

  loading = false,

  loadingText = "Loading...",

  leftIcon,

  rightIcon,

  className = "",

  disabled,

  ...props
}: AuthButtonProps) {
  const variantClasses = {
    primary: `
      border

      border-[var(--services-cta-primary-bg)]

      bg-[var(--services-cta-primary-bg)]

      text-[var(--services-cta-primary-text)]

      enabled:hover:scale-[1.01]

      enabled:hover:opacity-95

      enabled:hover:shadow-lg
    `,

    secondary: `
      border

      border-[var(--border)]

      bg-[var(--surface)]

      text-[var(--foreground)]

      enabled:hover:border-[var(--primary)]

      enabled:hover:bg-[var(--surface-card)]

      enabled:hover:text-[var(--primary)]
    `,

    ghost: `
      border

      border-transparent

      bg-transparent

      text-[var(--foreground-muted)]

      enabled:hover:bg-[var(--surface-card)]

      enabled:hover:text-[var(--foreground)]
    `,
  };

  return (
    <button
      {...props}
      disabled={
        disabled || loading
      }
      aria-busy={loading}
      className={`
        inline-flex

        ${
          fullWidth
            ? "w-full"
            : ""
        }

        h-10

        items-center

        justify-center

        gap-2

        rounded-xl

        px-3.5

        text-[13px]

        font-semibold

        whitespace-nowrap

        transition-all
        duration-300

        focus-visible:outline-none

        focus-visible:ring-2

        focus-visible:ring-[var(--primary)]/20

        disabled:cursor-not-allowed

        disabled:opacity-60

        sm:gap-2.5

        sm:px-4

        sm:text-[14px]

        ${variantClasses[variant]}

        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="
              h-3.5

              w-3.5

              animate-spin

              shrink-0

              sm:h-4

              sm:w-4
            "
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity=".2"
            />

            <path
              d="
                M22
                12

                a10
                10
                0
                0
                1

                -10
                10
              "
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {leftIcon}

          <span>{children}</span>

          {rightIcon}
        </>
      )}
    </button>
  );
}