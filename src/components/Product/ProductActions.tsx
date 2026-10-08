"use client";

import {
  HandCoins,
  Loader2,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

type ProductActionsProps = {
  onAffiliate?: () => void;

  affiliateLabel?: string;

  onAddToCart?: () => void;

  onBuyNow?: () => void;

  disabled?: boolean;

  addingToCart?: boolean;

  buyingNow?: boolean;

  affiliateLoading?: boolean;
};

export default function ProductActions({
  onAffiliate,

  affiliateLabel = "Become Affiliate",

  onAddToCart,

  onBuyNow,

  disabled = false,

  addingToCart = false,

  buyingNow = false,

  affiliateLoading = false,
}: ProductActionsProps) {
const purchaseActionsDisabled =
  disabled ||
  addingToCart ||
  buyingNow ||
  affiliateLoading;

const affiliateDisabled =
  addingToCart ||
  buyingNow ||
  affiliateLoading;

  return (
    <div
      className="
        mt-5

        flex

        flex-col

        gap-3
      "
    >
      {/* Become Affiliate */}

      <button
        type="button"
        disabled={affiliateDisabled}
        onClick={onAffiliate}
        className="
          flex

          h-10

          sm:h-11

          items-center

          justify-center

          gap-1.5
          sm:gap-2

          rounded-lg

          border

          border-[var(--primary)]

          bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]

          px-4
          sm:px-5

          text-[13px]
          sm:text-[14px]

          font-semibold

          text-[var(--primary)]

          transition-all

          duration-300

          enabled:hover:bg-[var(--primary)]

          enabled:hover:text-[var(--services-cta-primary-text)]

          disabled:cursor-not-allowed

          disabled:opacity-50
        "
      >
        {affiliateLoading ? (
          <>
            <Loader2
              size={16}
              strokeWidth={2.2}
              className="animate-spin"
            />

            Processing...
          </>
        ) : (
          <>
            <HandCoins
              size={16}
              strokeWidth={2.2}
            />

            {affiliateLabel}
          </>
        )}
      </button>

      {/* Purchase Buttons */}

      <div
        className="
          grid

          gap-2.5

          sm:grid-cols-2
        "
      >
        <button
          type="button"
disabled={
  purchaseActionsDisabled
}
          onClick={onAddToCart}
          className="
            flex

            h-10
            sm:h-11

            items-center

            justify-center

            gap-1.5
            sm:gap-2

            rounded-lg

            border

            border-[var(--border)]

            bg-[var(--surface)]

            px-3.5
            sm:px-4

            text-[13px]
            sm:text-[14px]

            font-semibold

            text-[var(--foreground)]

            transition-all

            duration-300

            enabled:hover:border-[var(--primary)]

            enabled:hover:bg-[var(--surface-card)]

            enabled:hover:text-[var(--primary)]

            disabled:cursor-not-allowed

            disabled:opacity-50
          "
        >
          {addingToCart ? (
            <>
              <Loader2
                size={15}
                strokeWidth={2.2}
                className="animate-spin"
              />

              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCart
                size={15}
                strokeWidth={2.2}
              />

              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
disabled={
  purchaseActionsDisabled
}
          onClick={onBuyNow}
          className="
            flex

            h-10
            sm:h-11

            items-center

            justify-center

            gap-1.5
            sm:gap-2

            rounded-lg

            border

            border-[var(--services-cta-primary-bg)]

            bg-[var(--services-cta-primary-bg)]

            px-3.5
            sm:px-4

            text-[13px]
            sm:text-[14px]

            font-semibold

            text-[var(--services-cta-primary-text)]

            shadow-md

            transition-all

            duration-300

            enabled:hover:scale-[1.02]

            enabled:hover:opacity-90

            enabled:hover:shadow-lg

            disabled:cursor-not-allowed

            disabled:opacity-50
          "
        >
          {buyingNow ? (
            <>
              <Loader2
                size={15}
                strokeWidth={2.2}
                className="animate-spin"
              />

              Processing...
            </>
          ) : (
            <>
              <ShoppingBag
                size={15}
                strokeWidth={2.2}
              />

              Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}