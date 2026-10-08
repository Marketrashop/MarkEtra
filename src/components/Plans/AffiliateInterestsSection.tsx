"use client";

import {
  MessageCircle,
  X,
} from "lucide-react";

import type {
  AffiliateInterest,
  AffiliateListing,
} from "@/types/affiliate.types";

import AffiliateInterestCard from "./AffiliateInterestCard";

type AffiliateInterestsSectionProps = {
  listing: AffiliateListing | null;

  open: boolean;

  onClose: () => void;

  onAccept?: (
    interest: AffiliateInterest,
  ) => void;

  onReject?: (
    interest: AffiliateInterest,
  ) => void;

  onNegotiate?: (
    interest: AffiliateInterest,
  ) => void;
};

export default function AffiliateInterestsSection({
  listing,
  open,
  onClose,
  onAccept,
  onReject,
  onNegotiate,
}: AffiliateInterestsSectionProps) {
  if (
    !open ||
    !listing
  ) {
    return null;
  }

  const interests =
    listing.interests;

  return (
    <div
      role="presentation"
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        bg-black/45
        p-2
        backdrop-blur-sm
        sm:p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${listing.product.name} interested buyers`}
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-lg
          border
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-xl
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
            items-center
            justify-between
            gap-3
            border-b
            px-3
            py-2.5
            sm:px-4
            sm:py-3
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
              sm:gap-2
            "
          >
            <div
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-md
                sm:h-7
                sm:w-7
                sm:rounded-lg
              "
              style={{
                background:
                  "var(--user-surface-secondary)",

                color:
                  "var(--user-text-muted)",
              }}
            >
              <MessageCircle
                size={13}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  sm:text-[8px]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Interested Buyers
              </p>

              <h2
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  font-bold
                  sm:text-sm
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
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            <span
              className="
                rounded-full
                border
                px-1.5
                py-0.5
                text-[7px]
                font-semibold
                sm:px-2
                sm:py-1
                sm:text-[8px]
              "
              style={{
                background:
                  "var(--user-surface-secondary)",

                color:
                  "var(--user-text-muted)",

                borderColor:
                  "var(--user-card-border)",
              }}
            >
              {
                interests.length
              }{" "}
              {interests.length ===
              1
                ? "Interest"
                : "Interests"}
            </span>

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Close"
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-md
                border
                transition
                hover:bg-[var(--user-surface-secondary)]
                sm:h-7
                sm:w-7
              "
              style={{
                background:
                  "var(--user-card-bg)",

                color:
                  "var(--user-text-muted)",

                borderColor:
                  "var(--user-card-border)",
              }}
            >
              <X
                size={12}
                className="sm:hidden"
              />

              <X
                size={14}
                className="hidden sm:block"
              />
            </button>
          </div>
        </div>

        <div
          className="
            min-h-0
            overflow-y-auto
            p-2.5
            sm:p-4
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-2
              sm:gap-2.5
              xl:grid-cols-2
            "
          >
            {interests.map(
              (interest) => (
                <AffiliateInterestCard
                  key={
                    interest.id
                  }
                  interest={
                    interest
                  }
                  onAccept={
                    onAccept
                  }
                  onReject={
                    onReject
                  }
                  onNegotiate={
                    onNegotiate
                  }
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}