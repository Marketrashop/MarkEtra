"use client";

import Image from "next/image";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  X,
} from "lucide-react";

import type {
  AffiliateListing,
  AffiliatePublicationStatus,
} from "@/types/affiliate.types";

type AffiliateListingDetailsDialogProps = {
  listing:
    | AffiliateListing
    | null;

  open: boolean;

  onClose: () => void;
};

export default function AffiliateListingDetailsDialog({
  listing,
  open,
  onClose,
}: AffiliateListingDetailsDialogProps) {
  if (!open || !listing) {
    return null;
  }

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
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : "Not published";

  const submittedDate =
    listing.submittedAt
      ? new Date(
          listing.submittedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : null;

  const reviewedDate =
    listing.reviewedAt
      ? new Date(
          listing.reviewedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : null;

  const lastSaleDate =
    listing.lastSaleAt
      ? new Date(
          listing.lastSaleAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : "No sales yet";

  const removedDate =
    listing.removedAt
      ? new Date(
          listing.removedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : null;

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ) {
    if (
      event.key ===
      "Escape"
    ) {
      onClose();
    }
  }

  return (
    <div
      role="presentation"
      tabIndex={-1}
      onKeyDown={
        handleKeyDown
      }
      onMouseDown={
        handleBackdropClick
      }
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        p-2
        backdrop-blur-sm
        sm:p-5
        lg:p-6
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="affiliate-listing-details-title"
        className="
          flex
          max-h-[96vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-xl
          border
          sm:max-h-[92vh]
          sm:rounded-2xl
        "
        style={{
          background:
            "var(--user-card-bg)",

          borderColor:
            "var(--user-card-border)",

          boxShadow:
            "0 24px 70px rgba(0, 0, 0, 0.22)",
        }}
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            border-b
            px-3
            py-2.5
            sm:gap-3
            sm:px-5
            sm:py-3
          "
          style={{
            borderColor:
              "var(--user-divider)",
          }}
        >
          <div className="min-w-0">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                sm:text-[10px]
                sm:tracking-[0.14em]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              Affiliate Listing
            </p>

            <h2
              id="affiliate-listing-details-title"
              className="
                mt-0.5
                truncate
                text-sm
                font-bold
                sm:text-lg
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
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close details"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              transition-opacity
              hover:opacity-70
              sm:h-8
              sm:w-8
            "
            style={{
              color:
                "var(--user-title)",
              background:
                "var(--user-hover)",
            }}
          >
            <X
              size={14}
              className="sm:hidden"
            />
            <X
              size={16}
              className="hidden sm:block"
            />
          </button>
        </div>

        <div
          className="
            overflow-y-auto
            p-3
            sm:p-5
          "
        >
          <div
            className="
              grid
              gap-3.5
              sm:gap-5
              lg:grid-cols-[220px_minmax(0,1fr)]
              lg:items-start
            "
          >
            <div
              className="
                relative
                aspect-square
                max-h-[240px]
                overflow-hidden
                rounded-lg
                bg-[var(--user-surface-secondary)]
                sm:max-h-none
                sm:rounded-xl
              "
            >
              {primaryImage ? (
                <Image
                  src={
                    primaryImage.imageUrl
                  }
                  alt={
                    primaryImage.altText ??
                    listing.product.name
                  }
                  fill
                  sizes="
                    (max-width:1024px) 100vw,
                    220px
                  "
                  className="
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                    text-[10px]
                    sm:text-xs
                  "
                  style={{
                    color:
                      "var(--user-text-muted)",
                  }}
                >
                  No image available
                </div>
              )}
            </div>

            <div
              className="
                min-w-0
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-1.5
                  sm:gap-2
                "
              >
                <PublicationBadge
                  status={
                    listing.publicationStatus
                  }
                />

                {listing.publishedAt && (
                  <span
                    className="
                      text-[9px]
                      sm:text-[11px]
                    "
                    style={{
                      color:
                        "var(--user-text-muted)",
                    }}
                  >
                    Published{" "}
                    {
                      publishedDate
                    }
                  </span>
                )}
              </div>

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  items-baseline
                  gap-x-1.5
                  gap-y-0.5
                  sm:mt-3
                  sm:gap-x-2
                  sm:gap-y-1
                "
              >
                {hasDiscount && (
                  <span
                    className="
                      text-[11px]
                      line-through
                      sm:text-sm
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
                    text-xl
                    font-extrabold
                    sm:text-2xl
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

              <p
                className="
                  mt-2
                  text-[11px]
                  leading-5
                  sm:mt-3
                  sm:text-sm
                  sm:leading-6
                "
                style={{
                  color:
                    "var(--user-text-secondary)",
                }}
              >
                {
                  listing.product
                    .description
                }
              </p>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-1.5
                  sm:mt-4
                  sm:gap-2
                "
              >
                <Metric
                  icon={
                    <BarChart3
                      size={12}
                      className="sm:hidden"
                    />
                  }
                  label="Sales"
                  value={listing.totalSales.toLocaleString()}
                />

                <Metric
                  icon={
                    <CircleDollarSign
                      size={12}
                      className="sm:hidden"
                    />
                  }
                  label="Revenue"
                  value={`$${listing.totalRevenue.toFixed(
                    2,
                  )}`}
                />

                <Metric
                  icon={
                    <CheckCircle2
                      size={12}
                      className="sm:hidden"
                    />
                  }
                  label="Commission"
                  value={`$${listing.totalCommission.toFixed(
                    2,
                  )}`}
                />
              </div>
            </div>
          </div>

          <div
            className="
              mt-3
              grid
              gap-1.5
              sm:mt-5
              sm:gap-3
              sm:grid-cols-2
            "
          >
            <DetailRow
              icon={
                <CalendarDays
                  size={13}
                  className="sm:hidden"
                />
              }
              label="Publication"
              value={
                publicationLabel(
                  listing.publicationStatus,
                )
              }
            />

            {submittedDate && (
              <DetailRow
                icon={
                  <Clock3
                    size={13}
                    className="sm:hidden"
                  />
                }
                label="Submitted"
                value={
                  submittedDate
                }
              />
            )}

            {reviewedDate && (
              <DetailRow
                icon={
                  <CheckCircle2
                    size={13}
                    className="sm:hidden"
                  />
                }
                label="Reviewed"
                value={
                  reviewedDate
                }
              />
            )}

            <DetailRow
              icon={
                <CalendarDays
                  size={13}
                  className="sm:hidden"
                />
              }
              label="Published"
              value={
                publishedDate
              }
            />

            <DetailRow
              icon={
                <Clock3
                  size={13}
                  className="sm:hidden"
                />
              }
              label="Last Sale"
              value={
                lastSaleDate
              }
            />

            <DetailRow
              icon={
                <BarChart3
                  size={13}
                  className="sm:hidden"
                />
              }
              label="Product ID"
              value={
                listing.productId
              }
              breakValue
            />

            <DetailRow
              icon={
                <CircleDollarSign
                  size={13}
                  className="sm:hidden"
                />
              }
              label="Subscription ID"
              value={
                listing.subscriptionId
              }
              breakValue
            />

            {listing.rejectionReason && (
              <DetailRow
                icon={
                  <X
                    size={13}
                    className="sm:hidden"
                  />
                }
                label="Rejection Reason"
                value={
                  listing.rejectionReason
                }
              />
            )}

            {removedDate && (
              <DetailRow
                icon={
                  <Clock3
                    size={13}
                    className="sm:hidden"
                  />
                }
                label="Removed"
                value={
                  removedDate
                }
              />
            )}
          </div>

          <div
            className="
              mt-3
              flex
              flex-col
              gap-2
              border-t
              pt-3
              sm:mt-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:pt-4
            "
            style={{
              borderColor:
                "var(--user-divider)",
            }}
          >
            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  sm:text-[10px]
                  sm:tracking-[0.12em]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Product Slug
              </p>

              <p
                className="
                  mt-0.5
                  break-all
                  text-[10px]
                  font-medium
                  sm:mt-1
                  sm:text-xs
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                {
                  listing.product
                    .slug
                }
              </p>
            </div>

            <a
              href={`/Market-Place/${listing.product.slug}`}
              className="
                inline-flex
                h-8
                shrink-0
                items-center
                justify-center
                gap-1
                rounded-md
                px-2.5
                text-[10px]
                font-semibold
                transition-opacity
                hover:opacity-80
                sm:h-auto
                sm:gap-1.5
                sm:rounded-lg
                sm:px-3
                sm:py-2
                sm:text-xs
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
              View Product

              <ExternalLink
                size={12}
                className="sm:hidden"
              />
              <ExternalLink
                size={13}
                className="hidden sm:block"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

type MetricProps = {
  icon: React.ReactNode;

  label: string;

  value: string;
};

function Metric({
  icon,
  label,
  value,
}: MetricProps) {
  return (
    <div
      className="
        rounded-lg
        border
        p-2
        sm:rounded-xl
        sm:p-3
      "
      style={{
        background:
          "var(--user-surface-secondary)",

        borderColor:
          "var(--user-divider)",
      }}
    >
      <div
        className="
          flex
          items-center
          gap-1
          sm:gap-1.5
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {icon}

        <span
          className="
            truncate
            text-[8px]
            font-medium
            sm:text-[10px]
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-0.5
          truncate
          text-[11px]
          font-bold
          sm:mt-1
          sm:text-sm
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

type DetailRowProps = {
  icon: React.ReactNode;

  label: string;

  value: string;

  breakValue?: boolean;
};

function DetailRow({
  icon,
  label,
  value,
  breakValue = false,
}: DetailRowProps) {
  return (
    <div
      className="
        rounded-lg
        border
        p-2
        sm:rounded-xl
        sm:p-3
      "
      style={{
        background:
          "var(--user-card-bg)",

        borderColor:
          "var(--user-divider)",
      }}
    >
      <div
        className="
          flex
          items-center
          gap-1
          sm:gap-1.5
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {icon}

        <span
          className="
            truncate
            text-[8px]
            font-medium
            sm:text-[10px]
          "
        >
          {label}
        </span>
      </div>

      <p
        className={`
          mt-0.5
          text-[10px]
          font-semibold
          sm:mt-1
          sm:text-xs
          ${
            breakValue
              ? "break-all"
              : "truncate"
          }
        `}
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
  let background =
    "var(--user-badge-warning-bg)";

  let color =
    "var(--user-badge-warning-text)";

  let label =
    "DRAFT";

  if (
    status ===
    "SUBMITTED"
  ) {
    label =
      "SUBMITTED";
  }

  if (
    status ===
    "IN_REVIEW"
  ) {
    label =
      "IN REVIEW";
  }

  if (
    status ===
    "APPROVED"
  ) {
    background =
      "var(--user-badge-success-bg)";

    color =
      "var(--user-badge-success-text)";

    label =
      "APPROVED";
  }

  if (
    status ===
    "PUBLISHED"
  ) {
    background =
      "var(--user-badge-success-bg)";

    color =
      "var(--user-badge-success-text)";

    label =
      "PUBLISHED";
  }

  if (
    status ===
    "REJECTED"
  ) {
    background =
      "var(--user-badge-danger-bg)";

    color =
      "var(--user-badge-danger-text)";

    label =
      "REJECTED";
  }

  return (
    <span
      className="
        rounded-full
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        sm:px-2.5
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

function publicationLabel(
  status: AffiliatePublicationStatus,
) {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "SUBMITTED":
      return "Awaiting admin review";

    case "IN_REVIEW":
      return "Under admin review";

    case "APPROVED":
      return "Approved";

    case "REJECTED":
      return "Rejected";

    case "PUBLISHED":
      return "Published";

    default:
      return "Unknown";
  }
}