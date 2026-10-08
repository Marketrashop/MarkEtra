"use client";

import Link from "next/link";

import { toast } from "sonner";

import {
  ArrowRight,
  Mail,
} from "lucide-react";

import { validateForgotPassword } from "./AuthValidation";
import AuthButton from "./AuthButton";
import AuthFooter from "./AuthFooter";
import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";

type ForgotPasswordFormProps = {
  loading?: boolean;

  disabled?: boolean;

  onSubmit?: (
    values: {
      email: string;
    },
  ) => void;
};

export default function ForgotPasswordForm({
  loading = false,
  disabled = false,
  onSubmit,
}: ForgotPasswordFormProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading || disabled) {
      return;
    }

    const form =
      new FormData(event.currentTarget);

    const values = {
      email: String(
        form.get("email") ?? "",
      ),
    };

    const validation =
      validateForgotPassword(
        values,
      );

    if (!validation.success) {
      toast.error(
        validation.message,
      );

      return;
    }

    onSubmit?.(values);
  }

  return (
    <AuthForm
      title="Forgot Password?"
      description="
        Enter your email address and we'll send you a link to reset your password.
      "
      footer={
        <AuthFooter>
          <Link
            href="/Auth"
            className="
              text-[13px]

              font-semibold

              text-[var(--primary)]

              transition-opacity
              duration-300

              hover:opacity-80

              sm:text-[14px]
            "
          >
            Back to Sign In
          </Link>
        </AuthFooter>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="
          space-y-3
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
          disabled={disabled || loading}
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

        <AuthButton
          type="submit"
          loading={loading}
          disabled={disabled}
          loadingText="Sending Reset Link..."
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
          {disabled
            ? "Reset Link Limit Reached"
            : "Send Reset Link"}
        </AuthButton>
      </form>
    </AuthForm>
  );
}