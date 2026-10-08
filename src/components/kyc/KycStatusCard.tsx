"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type {
  KycStatus,
} from "./kyc.types";

type KycStatusCardProps = {
  status: KycStatus;

  submittedAt: string;

  reviewedAt?: string | null;

  rejectionReason?: string | null;
};

export default function KycStatusCard({
  status,
  submittedAt,
  reviewedAt,
  rejectionReason,
}: KycStatusCardProps) {
  const config = {
    NOT_SUBMITTED: {
      icon: Clock3,

      title: "Verification Required",

      description:
        "You have not submitted your identity verification yet. Complete your KYC to unlock all account features.",

      badge:
        "bg-[var(--user-badge-warning-bg)] text-[var(--user-badge-warning-text)]",
    },

    PENDING: {
      icon: Clock3,

      title: "Verification Pending",

      description:
        "Your KYC documents have been submitted successfully. Our compliance team is currently reviewing them.",

      badge:
        "bg-[var(--user-badge-warning-bg)] text-[var(--user-badge-warning-text)]",
    },

    APPROVED: {
      icon: CheckCircle2,

      title: "Verification Approved",

      description:
        "Your identity has been verified successfully. Your account is now fully verified.",

      badge:
        "bg-[var(--user-badge-success-bg)] text-[var(--user-badge-success-text)]",
    },

    REJECTED: {
      icon: XCircle,

      title: "Verification Rejected",

      description:
        "Unfortunately, your verification could not be approved. Please review the reason below and submit a new verification.",

      badge:
        "bg-[var(--user-badge-danger-bg)] text-[var(--user-badge-danger-text)]",
    },
  }[status];

  const Icon = config.icon;

  return (
    <section
      className="
        rounded-[var(--user-radius-lg)]
        border
        border-[var(--user-card-border)]
        bg-[var(--user-surface)]
        p-3
        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:gap-5
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            ${config.badge}
            sm:h-14
            sm:w-14
          `}
        >
          <Icon
            size={20}
            className="sm:hidden"
          />

          <Icon
            size={28}
            className="hidden sm:block"
          />
        </div>

        <div className="flex-1">
          <h2
            className="
              text-base
              font-bold
              text-[var(--user-title)]
              sm:text-xl
            "
          >
            {config.title}
          </h2>

          <p
            className="
              mt-1.5
              text-[11px]
              leading-5
              text-[var(--user-text-muted)]
              sm:mt-2
              sm:text-sm
              sm:leading-6
            "
          >
            {config.description}
          </p>

          <div
            className="
              mt-4
              space-y-1.5
              text-[11px]
              text-[var(--user-text)]
              sm:mt-6
              sm:space-y-2
              sm:text-sm
            "
          >
            <div>
              <span className="font-medium">
                Submitted:
              </span>{" "}
              {submittedAt}
            </div>

            {reviewedAt && (
              <div>
                <span className="font-medium">
                  Reviewed:
                </span>{" "}
                {reviewedAt}
              </div>
            )}

            {status === "REJECTED" &&
              rejectionReason && (
                <div
                  className="
                    mt-3
                    rounded-[var(--user-radius-md)]
                    border
                    border-[var(--user-danger-border)]
                    bg-[var(--user-danger-bg)]
                    p-2.5
                    sm:mt-4
                    sm:p-4
                  "
                >
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      text-[var(--user-danger-text)]
                      sm:text-sm
                    "
                  >
                    Rejection Reason
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-[11px]
                      leading-5
                      text-[var(--user-text)]
                      sm:mt-2
                      sm:text-sm
                      sm:leading-normal
                    "
                  >
                    {rejectionReason}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}