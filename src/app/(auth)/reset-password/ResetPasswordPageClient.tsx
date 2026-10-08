"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  AuthLayout,
  ResetPasswordForm,
} from "@/components/auth";

export default function ResetPasswordPageClient() {
  const searchParams = useSearchParams();

  const token =
    searchParams.get("token")?.trim() ?? "";

  const [loading, setLoading] =
    useState(false);

  const [resetComplete, setResetComplete] =
    useState(false);

  async function handleResetPassword(values: {
    password: string;
    confirmPassword: string;
  }) {
    if (loading || resetComplete) {
      return;
    }

    if (!token) {
      toast.error(
        "This password reset link is invalid or incomplete.",
      );

      return;
    }

    try {
      setLoading(true);

const response = await fetch(
  "/api/auth/confirm-reset-password",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    }),
  },
);

      const data: unknown =
        await response.json();

      if (
        typeof data !== "object" ||
        data === null
      ) {
        toast.error(
          "Unable to update your password.",
        );

        return;
      }

      if (!response.ok) {
        const errorMessage =
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Unable to update your password.";

        toast.error(errorMessage);

        return;
      }

      setResetComplete(true);

      toast.success(
        "Your password has been updated successfully.",
      );
    } catch (error) {
      console.error(
        "Password reset confirmation error:",
        error,
      );

      toast.error(
        "Unable to update your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full max-w-[460px]">
          <div
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
              text-center
            "
          >
            <h1
              className="
                text-[26px]
                font-extrabold
                text-[var(--foreground)]
              "
            >
              Invalid Reset Link
            </h1>

            <p
              className="
                mt-3
                text-[14px]
                leading-7
                text-[var(--foreground-muted)]
              "
            >
              This password reset link is
              missing its security token.
              Please request a new reset
              link.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ResetPasswordForm
        loading={loading}
        disabled={resetComplete}
        onSubmit={handleResetPassword}
      />
    </AuthLayout>
  );
}