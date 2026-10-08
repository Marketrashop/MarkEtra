"use client";

import { useEffect, useState } from "react";

import {
  getKycSubmission,
  reviewKyc,
} from "./kyc.service";

import type {
  KycRecord,
} from "@/components/kyc/kyc.types";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;

  submissionId: string | null;

  onClose: () => void;

  onReviewed: () => void;
};

export default function KycReviewModal({
  open,
  submissionId,
  onClose,
  onReviewed,
}: Props) {
  const [record, setRecord] =
    useState<KycRecord | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [
    approveLoading,
    setApproveLoading,
  ] = useState(false);

  const [
    rejectLoading,
    setRejectLoading,
  ] = useState(false);

  const [
    rejectModalOpen,
    setRejectModalOpen,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const isApproved =
    record?.status ===
    "APPROVED";

  useEffect(() => {
    if (!open || !submissionId) {
      return;
    }

    const id = submissionId;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const data =
          await getKycSubmission(id);

        if (cancelled) {
          return;
        }

        setRecord(data);

        setRejectionReason(
          data.rejectionReason ?? ""
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [open, submissionId]);

  useEffect(() => {
    if (!open) {
      setRecord(null);
      setRejectionReason("");
    }
  }, [open]);

  async function approve() {
    if (!submissionId) {
      return;
    }

    setApproveLoading(true);

    try {
      await reviewKyc(
        submissionId,
        {
          action: "approve",
        }
      );

      toast.success(
        "KYC approved successfully."
      );

      onReviewed();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to approve KYC."
      );
    } finally {
      setApproveLoading(false);
    }
  }

  async function reject() {
    if (!submissionId) {
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error(
        "Please provide a rejection reason."
      );

      return;
    }

    setRejectLoading(true);

    try {
      await reviewKyc(
        submissionId,
        {
          action: "reject",
          rejectionReason,
        }
      );

      toast.success(
        "KYC rejected successfully."
      );

      setRejectModalOpen(false);
      setRejectionReason("");

      onReviewed();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reject KYC."
      );
    } finally {
      setRejectLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[var(--admin-modal-overlay)]
        p-2
        sm:p-4
      "
    >
      <div
        className="
          max-h-[96vh]
          w-full
          max-w-5xl
          overflow-y-auto
          rounded-lg
          border
          border-[var(--admin-modal-border)]
          bg-[var(--admin-modal-bg)]
          shadow-[var(--admin-modal-shadow)]
          sm:max-h-[90vh]
          sm:rounded-[var(--admin-modal-radius)]
        "
      >
        <div
          className="
            border-b
            border-[var(--admin-card-border)]
            bg-[var(--admin-modal-header-bg)]
            px-3
            py-2.5
            sm:p-6
          "
        >
          <h2
            className="
              text-[13px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-xl
            "
          >
            Review KYC
          </h2>
        </div>

        {loading || !record ? (
          <div
            className="
              p-6
              text-center
              text-[10px]
              text-[var(--admin-text)]
              sm:p-8
              sm:text-sm
            "
          >
            Loading...
          </div>
        ) : (
          <>
            <div
              className="
                space-y-4
                p-3
                sm:space-y-8
                sm:p-6
              "
            >
              <section
                className="
                  grid
                  gap-2.5
                  md:grid-cols-2
                  sm:gap-4
                "
              >
                <Info
                  label="First Name"
                  value={
                    record.firstName
                  }
                />

                <Info
                  label="Last Name"
                  value={
                    record.lastName
                  }
                />

                <Info
                  label="Date of Birth"
                  value={
                    record.dateOfBirth
                  }
                />

                <Info
                  label="Nationality"
                  value={
                    record.nationality
                  }
                />

                <Info
                  label="Address"
                  value={
                    record.residentialAddress
                  }
                />

                <Info
                  label="Country"
                  value={
                    record.country
                  }
                />
              </section>

              <section
                className="
                  grid
                  gap-3
                  md:grid-cols-3
                  sm:gap-6
                "
              >
                <ImageCard
                  title="Front Document"
                  image={
                    record.frontDocumentKey
                  }
                />

                {record.backDocumentKey && (
                  <ImageCard
                    title="Back Document"
                    image={
                      record.backDocumentKey
                    }
                  />
                )}

                <ImageCard
                  title="Selfie"
                  image={
                    record.selfieKey
                  }
                />
              </section>
            </div>

            <div
              className="
                flex
                flex-col-reverse
                gap-1.5
                border-t
                border-[var(--admin-card-border)]
                bg-[var(--admin-modal-footer-bg)]
                p-3
                sm:flex-row
                sm:justify-end
                sm:gap-3
                sm:p-6
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={
                  approveLoading ||
                  rejectLoading
                }
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[var(--admin-button-secondary-border)]
                  bg-[var(--admin-button-secondary-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-secondary-text)]
                  transition
                  hover:opacity-90
                  focus:outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:h-10
                  sm:rounded-xl
                  sm:px-5
                  sm:text-sm
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  approveLoading ||
                  rejectLoading ||
                  isApproved
                }
                onClick={() =>
                  setRejectModalOpen(true)
                }
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  rounded-md
                  bg-[var(--admin-button-danger-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-danger-text)]
                  transition
                  hover:opacity-90
                  focus:outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:h-10
                  sm:rounded-xl
                  sm:px-5
                  sm:text-sm
                "
              >
                <>
                  {rejectLoading && (
                    <Loader2
                      className="
                        mr-1.5
                        inline-block
                        h-3
                        w-3
                        animate-spin
                        sm:mr-2
                        sm:h-4
                        sm:w-4
                      "
                    />
                  )}

                  {rejectLoading
                    ? "Rejecting..."
                    : "Reject"}
                </>
              </button>

              <button
                type="button"
                disabled={
                  approveLoading ||
                  rejectLoading ||
                  isApproved
                }
                onClick={
                  approve
                }
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  px-2.5
                  text-[9px]
                  font-medium
                  transition
                  hover:opacity-90
                  focus:outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:h-10
                  sm:rounded-xl
                  sm:px-5
                  sm:text-sm
                "
                style={{
                  background:
                    "var(--admin-table-header-bg)",
                  color:
                    "var(--admin-table-title)",
                  borderColor:
                    "var(--admin-card-border)",
                  boxShadow:
                    "0 1px 3px var(--admin-card-shadow)",
                }}
              >
                <>
                  {approveLoading && (
                    <Loader2
                      className="
                        mr-1.5
                        inline-block
                        h-3
                        w-3
                        animate-spin
                        sm:mr-2
                        sm:h-4
                        sm:w-4
                      "
                    />
                  )}

                  {approveLoading
                    ? "Approving..."
                    : "Approve"}
                </>
              </button>
            </div>
          </>
        )}
      </div>

      {rejectModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/50
            p-2
            sm:p-4
          "
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-lg
              border
              border-[var(--admin-modal-border)]
              bg-[var(--admin-modal-bg)]
              p-3
              shadow-[var(--admin-modal-shadow)]
              sm:rounded-[var(--admin-modal-radius)]
              sm:p-6
            "
          >
            <h3
              className="
                text-[13px]
                font-semibold
                text-[var(--admin-title)]
                sm:text-lg
              "
            >
              Reject KYC
            </h3>

            <p
              className="
                mt-1.5
                text-[9px]
                leading-3.5
                text-[var(--admin-text)]
                sm:mt-2
                sm:text-sm
                sm:leading-normal
              "
            >
              Please provide a reason for rejecting this submission.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(
                  event.target.value
                )
              }
              rows={4}
              className="
                mt-3
                w-full
                rounded-md
                border
                border-[var(--admin-input-border)]
                bg-[var(--admin-input-bg)]
                p-2
                text-[10px]
                text-[var(--admin-input-text)]
                outline-none
                sm:mt-5
                sm:rounded-[var(--admin-input-radius)]
                sm:p-4
                sm:text-sm
              "
            />

            <div
              className="
                mt-3
                flex
                justify-end
                gap-1.5
                sm:mt-6
                sm:gap-3
              "
            >
              <button
                type="button"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectionReason("");
                }}
                disabled={rejectLoading}
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[var(--admin-button-secondary-border)]
                  bg-[var(--admin-button-secondary-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-secondary-text)]
                  transition
                  hover:opacity-90
                  focus:outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:h-10
                  sm:rounded-xl
                  sm:px-5
                  sm:text-sm
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={reject}
                disabled={
                  rejectLoading ||
                  isApproved
                }
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  rounded-md
                  bg-[var(--admin-button-danger-bg)]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-[var(--admin-button-danger-text)]
                  transition
                  hover:opacity-90
                  focus:outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:h-10
                  sm:rounded-xl
                  sm:px-5
                  sm:text-sm
                "
              >
                {rejectLoading ? (
                  <>
                    <Loader2
                      className="
                        mr-1.5
                        inline-block
                        h-3
                        w-3
                        animate-spin
                        sm:mr-2
                        sm:h-4
                        sm:w-4
                      "
                    />
                    Rejecting...
                  </>
                ) : (
                  "Reject KYC"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        className="
          text-[9px]
          text-[var(--admin-muted)]
          sm:text-sm
        "
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          text-[10px]
          leading-4
          text-[var(--admin-text)]
          sm:mt-1
          sm:text-sm
          sm:leading-normal
        "
      >
        {value}
      </p>
    </div>
  );
}

function ImageCard({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div>
      <p
        className="
          mb-1.5
          text-[9px]
          text-[var(--admin-muted)]
          sm:mb-3
          sm:text-sm
        "
      >
        {title}
      </p>

      <Image
        src={
          getCloudinaryImageUrl(image) ??
          ""
        }
        alt={title}
        width={500}
        height={500}
        className="
          aspect-square
          w-full
          rounded-md
          object-cover
          sm:rounded-xl
        "
      />
    </div>
  );
}