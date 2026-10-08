"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type AuthInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;

    helperText?: string;

    error?: string;

    success?: string;

    leftIcon?: ReactNode;

    rightIcon?: ReactNode;

    required?: boolean;
  };

const AuthInput = forwardRef<
  HTMLInputElement,
  AuthInputProps
>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      className = "",
      required,
      id,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    const hasSuccess = Boolean(success);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="
              mb-1.5

              text-[12px]

              font-semibold

              text-[var(--foreground)]

              sm:mb-2

              sm:text-[13px]
            "
          >
            {label}
          </label>
        )}

        <div
          className={`
            flex

            h-10

            items-center

            gap-2.5

            rounded-xl

            border

            bg-[var(--surface)]

            px-3

            transition-all
            duration-300

            sm:h-11

            sm:gap-3

            sm:px-3.5

            ${
              hasError
                ? `
                  border-red-500

                  focus-within:ring-2

                  focus-within:ring-red-500/20
                `
                : hasSuccess
                  ? `
                  border-emerald-500

                  focus-within:ring-2

                  focus-within:ring-emerald-500/20
                `
                  : `
                  border-[var(--border)]

                  focus-within:border-[var(--primary)]

                  focus-within:ring-2

                  focus-within:ring-[var(--primary)]/20
                `
            }
          `}
        >
          {leftIcon && (
            <span
              className="
                shrink-0

                text-[var(--foreground-muted)]
              "
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            {...props}
            className={`
              h-full

              w-full

              border-0

              bg-transparent

              text-[13px]

              text-[var(--foreground)]

              outline-none

              placeholder:text-[12px]

              placeholder:text-[var(--foreground-muted)]

              disabled:cursor-not-allowed

              disabled:opacity-60

              sm:text-[14px]

              sm:placeholder:text-[13px]

              ${className}
            `}
          />

          {rightIcon && (
            <span
              className="
                shrink-0

                text-[var(--foreground-muted)]
              "
            >
              {rightIcon}
            </span>
          )}
        </div>

        {(helperText ||
          error ||
          success) && (
          <p
            className={`
              mt-1.5

              text-[11px]

              sm:mt-2

              sm:text-[12px]

              ${
                hasError
                  ? "text-red-500"
                  : hasSuccess
                    ? "text-emerald-500"
                    : "text-[var(--foreground-muted)]"
              }
            `}
          >
            {error ??
              success ??
              helperText}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName =
  "AuthInput";

export default AuthInput;