"use client";

import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;

  totalRatings?: number;

  size?: number;

  showValue?: boolean;

  showCount?: boolean;

  className?: string;
};

function clampRating(
  value: number
) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(
    5,
    Math.max(0, value)
  );
}

export default function RatingStars({
  rating,
  totalRatings = 0,
  size = 18,
  showValue = false,
  showCount = false,
  className = "",
}: RatingStarsProps) {
  const value =
    clampRating(rating);

  return (
    <div
      className={[
        "inline-flex items-center gap-2",
        className,
      ].join(" ")}
    >
      <div
        className="
          flex
          items-center
          gap-1
        "
        aria-label={`Rated ${value.toFixed(
          1
        )} out of 5`}
      >
        {Array.from({
          length: 5,
        }).map((_, index) => {
          const filled =
            value >= index + 1;

          const partial =
            !filled &&
            value > index;

          return (
            <div
              key={index}
              className="
                relative
                h-fit
                w-fit
              "
            >
              <Star
                size={size}
                strokeWidth={1.8}
                className="
                  text-[var(--border)]
                "
              />

              {(filled ||
                partial) && (
                <div
                  className="
                    absolute
                    inset-0
                    overflow-hidden
                  "
                  style={{
                    width: filled
                      ? "100%"
                      : `${
                          (value -
                            index) *
                          100
                        }%`,
                  }}
                >
                  <Star
                    size={size}
                    strokeWidth={1.8}
                    fill="currentColor"
                    className="
                      text-yellow-500
                    "
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span
          className="
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {value.toFixed(1)}
        </span>
      )}

      {showCount && (
        <span
          className="
            text-sm
            text-[var(--muted-foreground)]
          "
        >
          ({totalRatings})
        </span>
      )}
    </div>
  );
}