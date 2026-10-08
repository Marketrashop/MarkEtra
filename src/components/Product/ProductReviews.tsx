"use client";

import {
  BadgeCheck,
  Star,
} from "lucide-react";

import type {
  ProductReview,
} from "@/lib/products/product.types";

type ProductReviewsProps = {
  reviews: ProductReview[];
};

export default function ProductReviews({
  reviews,
}: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div
        className="
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-3
          text-center
          lg:p-4
        "
      >
        <h3
          className="
            text-[15px]
            font-semibold
            text-[var(--foreground)]
            lg:text-[16px]
          "
        >
          No Reviews Yet
        </h3>

        <p
          className="
            mt-1
            text-[12px]
            leading-5
            text-[var(--foreground-muted)]
            lg:text-[13px]
          "
        >
          Be the first person to review this product.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-3
        lg:space-y-4
      "
    >
      {reviews.map((review) => (
        <article
          key={review.id}
          className="
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-3
            transition-colors
            duration-300
            lg:p-4
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >
            <div
              className="
                flex
                items-center
                gap-2.5
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--primary)]/10
                  text-[12px]
                  font-bold
                  uppercase
                  text-[var(--primary)]
                  lg:h-9
                  lg:w-9
                  lg:text-[13px]
                "
              >
                {review.customerName.charAt(0)}
              </div>

              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                  "
                >
                  <h3
                    className="
                      text-[13px]
                      font-semibold
                      text-[var(--foreground)]
                      lg:text-[14px]
                    "
                  >
                    {review.customerName}
                  </h3>

                  {review.verifiedPurchase && (
                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-emerald-500/10
                        px-1.5
                        py-0.5
                        text-[9px]
                        font-semibold
                        text-emerald-500
                        lg:text-[10px]
                      "
                    >
                      <BadgeCheck size={10} />
                      Verified
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-[var(--foreground-muted)]
                    lg:text-[11px]
                  "
                >
                  {review.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-0.5
              "
              aria-label={`${review.rating} out of 5 stars`}
            >
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  strokeWidth={2}
                  fill={
                    index < review.rating
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    index < review.rating
                      ? "text-yellow-400"
                      : "text-yellow-300"
                  }
                />
              ))}
            </div>
          </div>

          {review.title && (
            <h4
              className="
                mt-3
                text-[13px]
                font-semibold
                text-[var(--foreground)]
                lg:text-[14px]
              "
            >
              {review.title}
            </h4>
          )}

          <p
            className="
              mt-1.5
              text-[12px]
              leading-5
              text-[var(--foreground-muted)]
              lg:text-[13px]
              lg:leading-6
            "
          >
            {review.comment}
          </p>
        </article>
      ))}
    </div>
  );
}