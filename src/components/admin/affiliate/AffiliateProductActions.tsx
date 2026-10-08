"use client";

import {
  Check,
  Eye,
  Loader2,
  MessageSquare,
  Send,
  X,
} from "lucide-react";

import type {
  AdminAffiliateListing,
  AdminAffiliatePublicationStatus,
} from "@/types/admin-affiliate.types";

import type {
  AffiliateProductAction,
} from "./types";

type AffiliateProductActionsProps = {
  listing: AdminAffiliateListing;

  loadingAction:
    | AffiliateProductAction
    | null;

  onReview: (
    listingId: string,
  ) => void;

  onApprove: (
    listingId: string,
  ) => void;

  onReject: (
    listingId: string,
  ) => void;

  onPublish: (
    listingId: string,
  ) => void;

  onView: (
    listing: AdminAffiliateListing,
  ) => void;
};

export default function AffiliateProductActions({
  listing,
  loadingAction,
  onReview,
  onApprove,
  onReject,
  onPublish,
  onView,
}: AffiliateProductActionsProps) {
  const {
    publicationStatus,
  } = listing;

  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-1
        sm:gap-1.5
      "
    >
      <ActionButton
        label="View"
        icon={
          <Eye
            size={11}
            strokeWidth={2}
            className="sm:h-[13px] sm:w-[13px]"
          />
        }
        onClick={() =>
          onView(listing)
        }
      />

      {publicationStatus ===
        "SUBMITTED" && (
        <ActionButton
          label="Review"
          icon={
            <MessageSquare
              size={11}
              strokeWidth={2}
              className="sm:h-[13px] sm:w-[13px]"
            />
          }
          loading={
            loadingAction ===
            "review"
          }
          onClick={() =>
            onReview(
              listing.id,
            )
          }
          warning
        />
      )}

      {publicationStatus ===
        "IN_REVIEW" && (
        <>
          <ActionButton
            label="Approve"
            icon={
              <Check
                size={11}
                strokeWidth={2}
                className="sm:h-[13px] sm:w-[13px]"
              />
            }
            loading={
              loadingAction ===
              "approve"
            }
            onClick={() =>
              onApprove(
                listing.id,
              )
            }
            success
          />

          <ActionButton
            label="Reject"
            icon={
              <X
                size={11}
                strokeWidth={2}
                className="sm:h-[13px] sm:w-[13px]"
              />
            }
            loading={
              loadingAction ===
              "reject"
            }
            onClick={() =>
              onReject(
                listing.id,
              )
            }
            danger
          />
        </>
      )}

      {publicationStatus ===
        "APPROVED" && (
        <ActionButton
          label="Publish"
          icon={
            <Send
              size={11}
              strokeWidth={2}
              className="sm:h-[13px] sm:w-[13px]"
            />
          }
          loading={
            loadingAction ===
            "publish"
          }
          onClick={() =>
            onPublish(
              listing.id,
            )
          }
          primary
        />
      )}

      {publicationStatus ===
        "PUBLISHED" && (
        <span
          className="
            inline-flex
            h-6
            items-center
            rounded-md
            px-1.5
            text-[8px]
            font-semibold
            sm:h-7
            sm:px-2
            sm:text-[9px]
          "
          style={{
            background:
              "#22C55E",

            color:
              "#FFFFFF",
          }}
        >
          Live
        </span>
      )}

      {publicationStatus ===
        "REJECTED" && (
        <span
          className="
            inline-flex
            h-6
            items-center
            rounded-md
            px-1.5
            text-[8px]
            font-semibold
            sm:h-7
            sm:px-2
            sm:text-[9px]
          "
          style={{
            background:
              "#EF4444",

            color:
              "#FFFFFF",
          }}
        >
          Rejected
        </span>
      )}
    </div>
  );
}

type ActionButtonProps = {
  label: string;

  icon: React.ReactNode;

  onClick: () => void;

  loading?: boolean;

  primary?: boolean;

  success?: boolean;

  danger?: boolean;

  warning?: boolean;
};

function ActionButton({
  label,
  icon,
  onClick,
  loading = false,
  primary = false,
  success = false,
  danger = false,
  warning = false,
}: ActionButtonProps) {
  let background =
    "var(--surface)";

  let color =
    "var(--foreground-muted)";

  let border =
    "var(--border)";

  if (primary) {
    background =
      "#A855F7";

    color =
      "#FFFFFF";

    border =
      "#A855F7";
  }

  if (success) {
    background =
      "#22C55E";

    color =
      "#FFFFFF";

    border =
      "#22C55E";
  }

  if (danger) {
    background =
      "#EF4444";

    color =
      "#FFFFFF";

    border =
      "#EF4444";
  }

  if (warning) {
    background =
      "#F59E0B";

    color =
      "#FFFFFF";

    border =
      "#F59E0B";
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="
        inline-flex
        h-6
        items-center
        justify-center
        gap-1
        rounded
        border
        px-1.5
        text-[8px]
        font-semibold
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        hover:brightness-105
        sm:h-7
        sm:gap-1.5
        sm:rounded-md
        sm:px-2
        sm:text-[9px]
      "
      style={{
        background,
        color,
        borderColor: border,
      }}
    >
      {loading ? (
        <Loader2
          size={11}
          className="animate-spin sm:h-[13px] sm:w-[13px]"
        />
      ) : (
        icon
      )}

      {label}
    </button>
  );
}