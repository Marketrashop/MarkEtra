"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import AuthInput from "./AuthInput";
import PasswordStrength from "./PasswordStrength";

type PasswordFieldProps =
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > & {
    label?: string;

    helperText?: string;

    error?: string;

    success?: string;

    required?: boolean;

    showStrength?: boolean;
  };

const PasswordField = forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(
  (
    {
      label,

      helperText,

      error,

      success,

      required,

      showStrength = false,

      value,

      defaultValue,

      onChange,

      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] =
      useState(false);

    const [password, setPassword] =
      useState(
        String(
          value ??
            defaultValue ??
            ""
        )
      );

    return (
      <div
        className="
          w-full
        "
      >
        <AuthInput
          ref={ref}
          {...props}
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => {
            setPassword(
              event.target.value
            );

            onChange?.(event);
          }}
          type={
            showPassword
              ? "text"
              : "password"
          }
          label={label}
          helperText={helperText}
          error={error}
          success={success}
          required={required}
          rightIcon={
            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="
                flex

                items-center

                justify-center

                rounded-md

                p-0.5

                sm:p-1

                text-[var(--foreground-muted)]

                transition-colors
                duration-300

                hover:text-[var(--primary)]

                focus-visible:outline-none

                focus-visible:ring-2

                focus-visible:ring-[var(--primary)]/20
              "
            >
              {showPassword ? (
                <EyeOff
                  size={16}
                  strokeWidth={2}
                  className="
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />
              ) : (
                <Eye
                  size={16}
                  strokeWidth={2}
                  className="
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />
              )}
            </button>
          }
        />

        {showStrength && (
          <PasswordStrength
            password={
              typeof value ===
              "string"
                ? value
                : password
            }
          />
        )}
      </div>
    );
  }
);

PasswordField.displayName =
  "PasswordField";

export default PasswordField;