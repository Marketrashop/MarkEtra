"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  AuthLayout,
  ForgotPasswordForm,
} from "@/components/auth";

export default function ForgotPasswordPageClient() {
  const [loading, setLoading] = useState(false);
  const [resetDisabled, setResetDisabled] = useState(false);

  async function handleForgotPassword(values: {
    email: string;
  }) {
    if (loading || resetDisabled) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data: unknown = await response.json();

      if (
        typeof data !== "object" ||
        data === null
      ) {
        toast.error(
          "Unable to process password reset request.",
        );

        return;
      }

      if (!response.ok) {
        if (response.status === 429) {
          setResetDisabled(true);

          toast.error(
            "You have reached the password reset limit. Please wait 24 hours before requesting another reset.",
          );

          return;
        }

        const errorMessage =
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Unable to process password reset request.";

        toast.error(errorMessage);

        return;
      }

      const remaining =
        "remaining" in data &&
        typeof data.remaining === "number"
          ? data.remaining
          : null;

if (remaining === 0) {
  toast.success(
    "Reset email sent. You have used all 3 password reset requests for the next 24 hours.",
  );
} else if (remaining === 1) {
  toast.success(
    "Reset email sent. You have 1 password reset attempt remaining in the next 24 hours.",
  );
} else if (remaining !== null) {
  toast.success(
    `Reset email sent. You have ${remaining} password reset attempts remaining in the next 24 hours.`,
  );
} else {
  toast.success(
    "If an account with that email exists, a password reset email has been sent.",
  );
}

if (remaining === 0) {
  setResetDisabled(true);
}
    } catch (error) {
      console.error(
        "Password reset request error:",
        error,
      );

      toast.error(
        "Unable to send reset link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <ForgotPasswordForm
        loading={loading}
        disabled={resetDisabled}
        onSubmit={handleForgotPassword}
      />
    </AuthLayout>
  );
}