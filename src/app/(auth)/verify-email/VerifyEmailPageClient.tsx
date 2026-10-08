"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { VerifyEmailContent } from "@/components/auth";

export default function VerifyEmailPageClient() {
  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email") ??
    undefined;

  const token =
    searchParams.get("token") ??
    undefined;

  const [
    resendLoading,
    setResendLoading,
  ] = useState(false);

  const [
    resendDisabled,
    setResendDisabled,
  ] = useState(false);

  async function handleResend() {
    if (
      resendLoading ||
      resendDisabled
    ) {
      return;
    }

    if (!email) {
      toast.error(
        "We need your email address to resend the verification email.",
      );

      return;
    }

    try {
      setResendLoading(true);

      const response = await fetch(
        "/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data: unknown =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 429
        ) {
          setResendDisabled(true);

          toast.error(
            "You have reached the verification email limit. Please wait 24 hours before requesting another email.",
          );

          return;
        }

        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error ===
            "string"
            ? data.error
            : "Unable to resend verification email.";

        toast.error(message);

        return;
      }

const remaining =
  typeof data === "object" &&
  data !== null &&
  "remaining" in data &&
  typeof data.remaining === "number"
    ? data.remaining
    : null;

if (remaining === 0) {
  setResendDisabled(true);

  toast.success(
    "Verification email sent. You have used all 4 verification email requests for the next 24 hours.",
  );
} else if (remaining === 1) {
  toast.success(
    "Verification email sent. You have 1 verification email attempt remaining in the next 24 hours.",
  );
} else if (remaining !== null) {
  toast.success(
    `Verification email sent. You have ${remaining} verification email attempts remaining in the next 24 hours.`,
  );
} else {
  toast.success(
    "Verification email sent. Please check your inbox.",
  );
}

    } catch (error) {
      console.error(
        "Resend verification request error:",
        error,
      );

      toast.error(
        "Unable to send verification email. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <VerifyEmailContent
      email={email}
      token={token}
      loading={resendLoading}
      onResend={handleResend}
      resendDisabled={
        resendDisabled
      }
    />
  );
}
