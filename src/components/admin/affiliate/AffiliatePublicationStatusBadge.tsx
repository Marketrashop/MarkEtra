"use client";

import type {
  AdminAffiliatePublicationStatus,
} from "@/types/admin-affiliate.types";

type AffiliatePublicationStatusBadgeProps = {
  status: AdminAffiliatePublicationStatus;
};

export default function AffiliatePublicationStatusBadge({
  status,
}: AffiliatePublicationStatusBadgeProps) {
  let background =
    "var(--user-badge-warning-bg)";

  let color =
    "var(--user-badge-warning-text)";

  let label = "DRAFT";

  if (
    status === "SUBMITTED"
  ) {
    label = "SUBMITTED";
  }

  if (
    status === "IN_REVIEW"
  ) {
    label = "IN REVIEW";
  }

  if (
    status === "APPROVED"
  ) {
    background =
      "var(--user-badge-success-bg)";

    color =
      "var(--user-badge-success-text)";

    label = "APPROVED";
  }

  if (
    status === "PUBLISHED"
  ) {
    background =
      "var(--user-badge-success-bg)";

    color =
      "var(--user-badge-success-text)";

    label = "PUBLISHED";
  }

  if (
    status === "REJECTED"
  ) {
    background =
      "var(--user-badge-danger-bg)";

    color =
      "var(--user-badge-danger-text)";

    label = "REJECTED";
  }

  return (
    <span
      className="
        inline-flex
        shrink-0
        items-center
        rounded-full
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        sm:px-2.5
        sm:py-1
        sm:text-[10px]
      "
      style={{
        background,
        color,
      }}
    >
      {label}
    </span>
  );
}