"use client";

import Image from "next/image";

import {
  BarChart3,
  CalendarDays,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  AffiliateListing,
  AffiliatePublicationStatus,
} from "@/types/affiliate.types";

type AffiliateListingCardProps = {
  listing: AffiliateListing;

  onView?: (
    listing: AffiliateListing,
  ) => void;

  onViewInterests?: (
    listing: AffiliateListing,
  ) => void;
};

export default function AffiliateListingCard({
  listing,
  onView,
  onViewInterests,
}: AffiliateListingCardProps) {
  const primaryImage =
    listing.product.images.find(
      (image) =>
        image.isPrimary,
    ) ??
    listing.product.images[0] ??
    null;

  const hasDiscount =
    listing.product.compareAtPrice !==
      null &&
    listing.product.compareAtPrice >
      listing.product.price;

  const publishedDate =
    listing.publishedAt
      ? new Date(
          listing.publishedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        )
      : "Not published";

  const interestCount =
    listing.interests.length;

  return (
    <article
      className="
        overflow-hidden
        rounded-lg
        border
        transition-all
        duration-200
        hover:shadow-md
        sm:rounded-[var(--user-radius-md)]
      "
      style={{
        background:
          "var(--user-card-bg)",

        borderColor:
          "var(--user-card-border)",

        boxShadow:
          "var(--user-card-shadow)",
      }}
    >
      <div
        className="
          flex
          gap-2.5
          p-2.5
          sm:gap-3
          sm:p-3.5
        "
      >
        <div
          className="
            relative
            h-20
            w-20
            shrink-0
            overflow-hidden
            rounded-lg
            bg-[var(--user-surface-secondary)]
            sm:h-28
            sm:w-28
            sm:rounded-xl
          "
        >
          {primaryImage ? (
            <Image
              src={
                primaryImage.imageUrl ??
                `/api/image/${primaryImage.imageKey}`
              }
              alt={
                primaryImage.altText ??
                listing.product.name
              }
              fill
              sizes="
                (max-width:640px) 80px,
                112px
              "
              className="
                object-cover
                transition-transform
                duration-300
                hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                px-2
                text-center
                text-[9px]
                sm:text-[10px]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              No image
            </div>
          )}
        </div>

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-1.5
              sm:gap-2
            "
          >
            <div
              className="
                min-w-0
              "
            >
              <h3
                className="
                  line-clamp-2
                  text-[11px]
                  font-semibold
                  leading-4
                  sm:text-sm
                  sm:leading-5
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                {
                  listing.product
                    .name
                }
              </h3>

              <div
                className="
                  mt-1
                  flex
                  flex-wrap
                  items-baseline
                  gap-x-1.5
                  gap-y-0.5
                  sm:gap-x-2
                "
              >
                {hasDiscount && (
                  <span
                    className="
                      text-[9px]
                      line-through
                      sm:text-[10px]
                    "
                    style={{
                      color:
                        "var(--user-text-muted)",
                    }}
                  >
                    $
                    {listing.product.compareAtPrice!.toFixed(
                      2,
                    )}
                  </span>
                )}

                <span
                  className="
                    text-[13px]
                    font-bold
                    sm:text-sm
                  "
                  style={{
                    color:
                      "var(--user-title)",
                  }}
                >
                  $
                  {listing.product.price.toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>

            <PublicationBadge
              status={
                listing.publicationStatus
              }
            />
          </div>

          <div
            className="
              mt-2.5
              grid
              grid-cols-2
              gap-x-3
              gap-y-1.5
              sm:mt-3
              sm:grid-cols-3
              sm:gap-x-4
              sm:gap-y-2
            "
          >
            <Stat
              icon={
                <BarChart3
                  size={11}
                />
              }
              label="Sales"
              value={listing.totalSales.toLocaleString()}
            />

            <Stat
              icon={
                <TrendingUp
                  size={11}
                />
              }
              label="Earned"
              value={`$${listing.totalCommission.toFixed(
                2,
              )}`}
            />

            <Stat
              icon={
                <CalendarDays
                  size={11}
                />
              }
              label="Published"
              value={publishedDate}
            />
          </div>
        </div>
      </div>

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          border-t
          px-2.5
          py-2
          sm:gap-3
          sm:px-3.5
          sm:py-2.5
        "
        style={{
          borderColor:
            "var(--user-divider)",
        }}
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
          "
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          <Heart
            size={11}
          />

          <span
            className="
              truncate
              text-[9px]
              sm:text-[10px]
            "
          >
            Affiliate product
          </span>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1
            sm:gap-1.5
          "
        >
          {interestCount >
            0 && (
            <Button
              type="button"
              onClick={() =>
                onViewInterests?.(
                  listing,
                )
              }
              className="
                shrink-0
                !h-7
                !px-2
                !text-[9px]
                !rounded-md
                sm:!h-8
                sm:!px-2.5
                sm:!text-[10px]
                sm:!rounded-lg
              "
              style={{
                background:
                  "var(--user-surface-secondary)",

                color:
                  "var(--user-text-muted)",

                border:
                  "1px solid var(--user-card-border)",
              }}
            >
<MessageCircle
  size={11}
  className="mr-1 sm:mr-1.5"
/>

{interestCount}
<span className="hidden sm:inline ml-1">
  Interest
  {interestCount === 1
    ? ""
    : "s"}
</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={() =>
              onView?.(
                listing,
              )
            }
            className="
              shrink-0
              !h-7
              !px-2.5
              !text-[10px]
              !rounded-md
              sm:!h-8
              sm:!px-3
              sm:!text-[11px]
              sm:!rounded-lg
            "
            style={{
              background:
                "var(--user-button-secondary-bg)",

              color:
                "var(--user-button-secondary-text)",

              border:
                "1px solid var(--user-button-secondary-border)",
            }}
          >
            <Eye
              size={12}
              className="mr-1 sm:mr-1.5"
            />

            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

type StatProps = {
  icon: React.ReactNode;

  label: string;

  value: string;
};

function Stat({
  icon,
  label,
  value,
}: StatProps) {
  return (
    <div className="min-w-0">
      <div
        className="
          flex
          items-center
          gap-1
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {icon}

        <span
          className="
            text-[8px]
            sm:text-[9px]
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-0.5
          truncate
          text-[10px]
          font-semibold
          sm:text-[11px]
        "
        style={{
          color:
            "var(--user-title)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

type PublicationBadgeProps = {
  status: AffiliatePublicationStatus;
};

function PublicationBadge({
  status,
}: PublicationBadgeProps) {
  let background = "var(--user-badge-warning-bg)";
  let color = "var(--user-badge-warning-text)";
  let label = "DRAFT";

  if (status === "SUBMITTED") {
    background = "#FEF3C7";
    color = "#B45309";
    label = "SUBMITTED";
  }

  if (status === "IN_REVIEW") {
    background = "#DBEAFE";
    color = "#1D4ED8";
    label = "IN REVIEW";
  }

  if (status === "APPROVED") {
    background = "#F3E8FF";
    color = "#7E22CE";
    label = "APPROVED";
  }

  if (status === "PUBLISHED") {
    background = "#DCFCE7";
    color = "#15803D";
    label = "PUBLISHED";
  }

  if (status === "REJECTED") {
    background = "#FEE2E2";
    color = "#B91C1C";
    label = "REJECTED";
  }

  return (
    <span
      className="
        shrink-0
        rounded-full
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        sm:px-2
        sm:py-1
        sm:text-[9px]
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