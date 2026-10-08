"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  CheckCircle2,
  MailCheck,
  RotateCw,
} from "lucide-react";

import AuthButton from "./AuthButton";
import AuthCard from "./AuthCard";

type VerifyEmailContentProps = {
  email?: string;
  token?: string;
  loading?: boolean;
  onResend?: () => void;
  resendDisabled?: boolean;
};

export default function VerifyEmailContent({
  email,
  token,
  loading: externalLoading = false,
  onResend,
  resendDisabled = false,
}: VerifyEmailContentProps) {
  const [loading, setLoading] =
    useState(false);

  const [verified, setVerified] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function verifyEmail() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          },
        );

        const data: unknown =
          await response.json();

        if (
          typeof data !== "object" ||
          data === null ||
          !("success" in data)
        ) {
          throw new Error(
            "Unable to verify email address",
          );
        }

        if (
          data.success !== true
        ) {
          const message =
            "error" in data &&
            typeof data.error ===
              "string"
              ? data.error
              : "Unable to verify email address";

          throw new Error(message);
        }

        if (!cancelled) {
          setVerified(true);
        }
      } catch (
        verificationError
      ) {
        if (!cancelled) {
          setError(
            verificationError instanceof
              Error
              ? verificationError.message
              : "Unable to verify email address",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (verified) {
    return (
      <AuthCard>
        <div className="text-center">
          <div
            className="
              mx-auto

              flex

              h-14
              w-14

              sm:h-16
              sm:w-16

              items-center

              justify-center

              rounded-full

              bg-[var(--primary)]/10

              text-[var(--primary)]
            "
          >
            <CheckCircle2
              size={28}
            />
          </div>

          <h1
            className="
              mt-5

              text-[22px]

              font-extrabold

              leading-tight

              text-[var(--foreground)]

              sm:mt-6

              sm:text-[26px]
            "
          >
            Email Verified
          </h1>

          <p
            className="
              mt-2

              text-[13px]

              leading-6

              text-[var(--foreground-muted)]

              sm:mt-3

              sm:text-[14px]

              sm:leading-7
            "
          >
            Your MarkEtra account
            has been successfully
            verified.
          </p>

          {email && (
            <p
              className="
                mt-2

                text-[14px]

                font-semibold

                text-[var(--foreground)]

                sm:text-[15px]
              "
            >
              {email}
            </p>
          )}

          <div className="mt-6 sm:mt-8">
            <Link
              href="/Auth"
              className="
                block

                text-center

                text-[13px]

                font-semibold

                text-[var(--primary)]

                transition-opacity

                duration-300

                hover:opacity-80

                sm:text-[14px]
              "
            >
              Continue to Sign In
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center">
        <div
          className="
            mx-auto

            flex

            h-14
            w-14

            sm:h-16
            sm:w-16

            items-center

            justify-center

            rounded-full

            bg-[var(--primary)]/10

            text-[var(--primary)]
          "
        >
          <MailCheck
            size={28}
          />
        </div>

        <h1
          className="
            mt-5

            text-[22px]

            font-extrabold

            leading-tight

            text-[var(--foreground)]

            sm:mt-6

            sm:text-[26px]
          "
        >
          Verify Your Email
        </h1>

        {loading ? (
          <p
            className="
              mt-2

              text-[13px]

              leading-6

              text-[var(--foreground-muted)]

              sm:mt-3

              sm:text-[14px]

              sm:leading-7
            "
          >
            Verifying your email
            address...
          </p>
        ) : error ? (
          <>
            <p
              className="
                mt-2

                text-[13px]

                leading-6

                text-[var(--foreground-muted)]

                sm:mt-3

                sm:text-[14px]

                sm:leading-7
              "
            >
              {error}
            </p>

            <div className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
              <AuthButton
                loading={
                  externalLoading
                }
                disabled={
                  resendDisabled
                }
                onClick={
                  onResend
                }
                loadingText="Sending Verification Email..."
                leftIcon={
                  <RotateCw
                    size={16}
                  />
                }
                variant="secondary"
              >
                Resend Email
              </AuthButton>

              <Link
                href="/Auth"
                className="
                  block

                  text-center

                  text-[13px]

                  font-medium

                  text-[var(--primary)]

                  transition-opacity

                  duration-300

                  hover:opacity-80

                  sm:text-[14px]
                "
              >
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <p
              className="
                mt-2

                text-[13px]

                leading-6

                text-[var(--foreground-muted)]

                sm:mt-3

                sm:text-[14px]

                sm:leading-7
              "
            >
              We've sent a verification
              link to
            </p>

            {email && (
              <p
                className="
                  mt-2

                  text-[14px]

                  font-semibold

                  text-[var(--foreground)]

                  sm:text-[15px]
                "
              >
                {email}
              </p>
            )}

            <p
              className="
                mt-4

                text-[13px]

                leading-6

                text-[var(--foreground-muted)]

                sm:mt-5

                sm:text-[14px]

                sm:leading-7
              "
            >
              Click the link in your
              inbox to activate your
              account. If you don't see
              it, check your spam or junk
              folder.
            </p>

            <div className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
              <AuthButton
                loading={
                  externalLoading
                }
                disabled={
                  resendDisabled
                }
                onClick={
                  onResend
                }
                loadingText="Sending Verification Email..."
                leftIcon={
                  <RotateCw
                    size={16}
                  />
                }
                variant="secondary"
              >
                Resend Email
              </AuthButton>

              <Link
                href="/Auth"
                className="
                  block

                  text-center

                  text-[13px]

                  font-medium

                  text-[var(--primary)]

                  transition-opacity

                  duration-300

                  hover:opacity-80

                  sm:text-[14px]
                "
              >
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthCard>
  );
}