"use client";

import Link from "next/link";

import { toast } from "sonner";

import {
  ArrowRight,
} from "lucide-react";

import { validateResetPassword } from "./AuthValidation";
import AuthButton from "./AuthButton";
import AuthFooter from "./AuthFooter";
import AuthForm from "./AuthForm";
import PasswordField from "./PasswordField";

type ResetPasswordFormProps = {
  loading?: boolean;
  disabled?: boolean;

  onSubmit?: (
    values: {
      password: string;
      confirmPassword: string;
    },
  ) => void;
};

export default function ResetPasswordForm({
  loading = false,
  disabled = false,
  onSubmit,
}: ResetPasswordFormProps) {
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
      password: String(
        form.get("password") ?? "",
      ),

      confirmPassword: String(
        form.get("confirmPassword") ?? "",
      ),
    };

    const validation =
      validateResetPassword(values);

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
      title="Create New Password"
      description="
        Choose a strong password for your MarkEtra account.
      "
      footer={
        <AuthFooter>
          <Link
            href="/Auth"
            className="
              font-semibold
              text-[var(--primary)]
              transition-opacity
              duration-300
              hover:opacity-80
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
        <PasswordField
          id="password"
          name="password"
          label="New Password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          required
          showStrength
          disabled={disabled || loading}
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          required
          disabled={disabled || loading}
        />

        <AuthButton
          type="submit"
          loading={loading}
          disabled={disabled}
          loadingText="Updating Password..."
          rightIcon={
            <ArrowRight size={16} />
          }
        >
          {disabled
            ? "Password Updated"
            : "Update Password"}
        </AuthButton>
      </form>
    </AuthForm>
  );
}