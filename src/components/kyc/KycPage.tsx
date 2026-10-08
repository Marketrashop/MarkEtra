"use client";

import { useEffect, useState } from "react";

import {
  DashboardPage,
} from "@/components/dashboard";

import KycForm from "./KycForm";
import KycStatusCard from "./KycStatusCard";

import { getKyc } from "./kyc.service";

import type {
  KycStatus,
} from "./kyc.types";

export default function KycPage() {
  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState<KycStatus | undefined>();

  const [
    submittedAt,
    setSubmittedAt,
  ] = useState<string>();

  const [
    reviewedAt,
    setReviewedAt,
  ] = useState<string | null>();

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState<string | null>();

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getKyc();

        const record =
          response.data;

        if (!record) {
          return;
        }

        setStatus(record.status);
        setSubmittedAt(
          record.submittedAt,
        );
        setReviewedAt(
          record.reviewedAt,
        );
        setRejectionReason(
          record.rejectionReason,
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <DashboardPage
        environment="user"
        breadcrumb={[
          {
            label: "Identity Verification",
          },
        ]}
      >
        <div
          className="
            py-10
            text-center
            text-xs
            text-[var(--user-text-muted)]
            sm:py-16
            sm:text-sm
          "
        >
          Loading...
        </div>
      </DashboardPage>
    );
  }

  const showForm =
    !status ||
    status === "NOT_SUBMITTED" ||
    status === "REJECTED";

  return (
    <DashboardPage
      environment="user"
      breadcrumb={[
        {
          label: "Identity Verification",
        },
      ]}
      containerClassName="
        pb-12
        sm:pb-16
        lg:pb-24
      "
    >
      <div
        className="
          space-y-3.5
          sm:space-y-5
        "
      >
        <div>

          <p
            className="
              mt-1.5
              max-w-2xl
              text-[11px]
              leading-5
              text-[var(--user-text-muted)]
              sm:mt-2
              sm:text-sm
              sm:leading-6
            "
          >
            Verify your identity to unlock
            withdrawals and maintain a secure
            account. Please ensure all
            information matches your government
            issued identity document.
          </p>
        </div>

        {showForm ? (
          <>
            {status === "REJECTED" && (
              <KycStatusCard
                status={status}
                submittedAt={
                  submittedAt ?? ""
                }
                reviewedAt={
                  reviewedAt
                }
                rejectionReason={
                  rejectionReason
                }
              />
            )}

            <KycForm />
          </>
        ) : (
          <KycStatusCard
            status={status}
            submittedAt={
              submittedAt ?? ""
            }
            reviewedAt={
              reviewedAt
            }
            rejectionReason={
              rejectionReason
            }
          />
        )}
      </div>
    </DashboardPage>
  );
}