"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { toast } from "sonner";

import {
  ArrowRight,
  Mail,
} from "lucide-react";

import { validateLogin } from "./AuthValidation";
import AuthButton from "./AuthButton";
import AuthDivider from "./AuthDivider";
import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthTabs from "./AuthTabs";
import PasswordField from "./PasswordField";

type LoginFormProps = {
  loading?: boolean;

  loadingText?: string;

  onSubmit?: (
    values: {
      email: string;

      password: string;

      rememberMe: boolean;
    },
  ) => void | Promise<void>;

  onRegister?: () => void;
};

export default function LoginForm({
  loading = false,

  loadingText,

  onSubmit,

  onRegister,
}: LoginFormProps) {
  const [locked, setLocked] =
    useState(false);

useEffect(() => {
  if (!loading) {
    setLocked(false);
  }
}, [loading]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      loading ||
      locked
    ) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

    const values = {
      email: String(
        form.get("email"),
      ),

      password: String(
        form.get("password"),
      ),

      rememberMe:
        form.get("rememberMe") ===
        "on",
    };

    const validation =
      validateLogin(values);

    if (!validation.success) {
      toast.error(
        validation.message,
      );

      return;
    }

    setLocked(true);

    try {
      await onSubmit?.(values);
    } catch {
      setLocked(false);
    }
  }

  return (
    <AuthForm
      title="Welcome Back"
      description="
Sign in to continue building your business with MarkEtra.
      "
      footer={
        <p
          className="
            text-center

            text-[12px]

            text-[var(--foreground-muted)]

            sm:text-[13px]
          "
        >
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onRegister}
            disabled={
              loading ||
              locked
            }
            className="
              font-semibold

              text-[var(--primary)]

              transition-colors
              duration-300

              hover:opacity-80

              disabled:cursor-not-allowed

              disabled:opacity-50
            "
          >
            Create one
          </button>
        </p>
      }
    >
      <div
        className="
          mb-3

          sm:mb-4
        "
      >
        <AuthTabs
          value="login"
          onChange={(value) => {
            if (
              loading ||
              locked
            ) {
              return;
            }

            if (
              value ===
              "register"
            ) {
              onRegister?.();
            }
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          space-y-3

          sm:space-y-4
        "
      >
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={loading}
          leftIcon={
            <Mail
              size={16}
              className="
                sm:h-[17px]
                sm:w-[17px]
              "
            />
          }
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
        />

        <div
          className="
            flex

            items-center

            justify-between

            gap-3
          "
        >
          <label
            className="
              flex

              cursor-pointer

              items-center

              gap-1.5

              text-[12px]

              text-[var(--foreground-muted)]
            "
          >
            <input
              type="checkbox"
              name="rememberMe"
              disabled={loading}
              className="
                h-3.5

                w-3.5

                rounded

                border-[var(--border)]

                accent-[var(--primary)]
              "
            />

            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="
              text-[12px]

              font-medium

              text-[var(--primary)]

              transition-opacity
              duration-300

              hover:opacity-80
            "
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton
          type="submit"
          loading={loading}
          disabled={
            loading ||
            locked
          }
          loadingText={
            loadingText
          }
          rightIcon={
            <ArrowRight
              size={16}
              className="
                sm:h-[17px]
                sm:w-[17px]
              "
            />
          }
        >
          Sign In
        </AuthButton>

        <AuthDivider
          label="or continue with"
          className="
            my-1
          "
        />

        <AuthButton
          type="button"
          variant="secondary"
          disabled={
            loading ||
            locked
          }
        >
          Continue with Google
        </AuthButton>
      </form>
    </AuthForm>
  );
}