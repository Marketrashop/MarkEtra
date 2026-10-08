import { Star } from "lucide-react";

import {
  STORE_RATING_SIZE,
} from "./storeProducts.constants";

import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

import type {
  StoreProductRatingProps,
} from "./storeProducts.types";

export default function StoreProductRating({
  product,

  variant = "default",
}: StoreProductRatingProps) {
  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

  return (
    <div
      className={`
        ${styles.ratingMarginTop}

        flex

        items-center

        gap-2
      `}
    >
      <div
        className="
          flex

          items-center

          gap-1
        "
      >
        {Array.from({
          length: 5,
        }).map((_, index) => {
          const filled =
            index <
            Math.round(
              product.averageRating,
            );

          return (
            <Star
              key={index}
              size={STORE_RATING_SIZE}
              strokeWidth={2}
              fill={
                filled
                  ? "currentColor"
                  : "none"
              }
              className={
                filled
                  ? "text-yellow-400"
                  : "text-yellow-300"
              }
            />
          );
        })}
      </div>

      <span
        className={`
          ${styles.review}

          font-medium

          text-[var(--foreground-muted)]
        `}
      >
        ({product.totalRatings})
      </span>
    </div>
  );
}