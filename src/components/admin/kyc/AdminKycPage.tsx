"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  KycRecord,
  KycStatus,
} from "@/components/kyc/kyc.types";

import AdminKycTable from "./AdminKycTable";
import KycReviewModal from "./KycReviewModal";

import { useRouter } from "next/navigation";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { AdminPageHeader } from "@/components/admin";

type AdminKycPageProps = {
  submissions: KycRecord[];
};

export default function AdminKycPage({
  submissions,
}: AdminKycPageProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    KycStatus | "ALL"
  >("ALL");

  const [
    selectedSubmissionId,
    setSelectedSubmissionId,
  ] = useState<string | null>(
    null,
  );

  const [
    reviewModalOpen,
    setReviewModalOpen,
  ] = useState(false);

  const router =
    useRouter();

  const filtered =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return submissions.filter(
        (submission) => {
          const matchesStatus =
            status === "ALL" ||
            submission.status ===
              status;

          const matchesSearch =
            !query ||
            submission.firstName
              .toLowerCase()
              .includes(query) ||
            submission.lastName
              .toLowerCase()
              .includes(query) ||
            submission.nationality
              .toLowerCase()
              .includes(query);

          return (
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      submissions,
      search,
      status,
    ]);

  const stats =
    useMemo(
      () => ({
        total:
          submissions.length,

        pending:
          submissions.filter(
            (item) =>
              item.status ===
              "PENDING",
          ).length,

        approved:
          submissions.filter(
            (item) =>
              item.status ===
              "APPROVED",
          ).length,

        rejected:
          submissions.filter(
            (item) =>
              item.status ===
              "REJECTED",
          ).length,
      }),
      [submissions],
    );

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label:
            "KYC Verification",
        },
      ]}
    >
      <div
        className="
          space-y-3
          sm:space-y-5
        "
      >
        <AdminPageHeader
          title="KYC Verification"
          description="Review and manage customer identity verification requests."
        />

        <div
          className="
            grid
            grid-cols-2
            gap-2
            xl:grid-cols-4
            sm:gap-3
          "
        >
          <StatCard
            title="Total"
            value={
              stats.total
            }
          />

          <StatCard
            title="Pending"
            value={
              stats.pending
            }
          />

          <StatCard
            title="Approved"
            value={
              stats.approved
            }
          />

          <StatCard
            title="Rejected"
            value={
              stats.rejected
            }
          />
        </div>

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:gap-3
          "
        >
          <input
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search by name or nationality..."
            className="
              h-8
              flex-1
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-input-bg)]
              px-2.5
              text-[10px]
              text-[var(--admin-input-text)]
              placeholder:text-[var(--admin-text-muted)]
              outline-none
              transition-colors
              duration-[var(--admin-transition)]
              focus:border-[var(--admin-primary)]
              sm:h-11
              sm:rounded-xl
              sm:px-4
              sm:text-sm
            "
          />

          <select
            value={
              status
            }
            onChange={(
              event,
            ) =>
              setStatus(
                event.target
                  .value as
                  | KycStatus
                  | "ALL",
              )
            }
            className="
              h-8
              w-full
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-input-bg)]
              px-2
              text-[10px]
              text-[var(--admin-input-text)]
              outline-none
              transition-colors
              duration-[var(--admin-transition)]
              focus:border-[var(--admin-primary)]
              sm:h-11
              sm:w-48
              sm:rounded-xl
              sm:px-4
              sm:text-sm
            "
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        <div
          className="
            overflow-hidden
            rounded-lg
            border
            border-[var(--admin-table-border)]
            bg-[var(--admin-table-bg)]
            shadow-[var(--admin-card-shadow)]
            sm:rounded-[var(--admin-card-radius)]
          "
        >
          <div
            className="
              max-h-[600px]
              overflow-auto
            "
          >
            <AdminKycTable
              submissions={
                filtered
              }
              onReview={(
                id,
              ) => {
                setSelectedSubmissionId(
                  id,
                );
                setReviewModalOpen(
                  true,
                );
              }}
            />
          </div>
        </div>

        <KycReviewModal
          open={
            reviewModalOpen
          }
          submissionId={
            selectedSubmissionId
          }
          onClose={() => {
            setReviewModalOpen(
              false,
            );
            setSelectedSubmissionId(
              null,
            );
          }}
          onReviewed={() => {
            router.refresh();
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}

type StatCardProps = {
  title: string;
  value: number;
};

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        sm:rounded-xl
        sm:p-4
      "
    >
      <p
        className="
          text-[8px]
          uppercase
          tracking-[0.06em]
          text-[var(--admin-text-muted)]
          sm:text-xs
          sm:tracking-wide
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          text-[var(--admin-title)]
          sm:mt-2
          sm:text-2xl
        "
      >
        {value}
      </p>
    </div>
  );
}