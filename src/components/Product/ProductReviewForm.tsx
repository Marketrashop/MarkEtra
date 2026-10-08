"use client";

import { useState } from "react";

import {
  Loader2,
  Star,
} from "lucide-react";

import { toast } from "sonner";

type ProductReviewFormProps = {
  onSubmit?: (
    review: {
      rating: number;
      comment: string;
    },
  ) => void;
};

export default function ProductReviewForm({
  onSubmit,
}: ProductReviewFormProps) {
  const [rating, setRating] =
    useState(0);

  const [
    hoveredRating,
    setHoveredRating,
  ] = useState(0);

  const [comment, setComment] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (rating === 0) {
      toast.error(
        "Please select a star rating.",
      );

      return;
    }

    if (comment.trim() === "") {
      toast.error(
        "Please write your review.",
      );

      return;
    }

    setSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1200),
    );

    onSubmit?.({
      rating,
      comment,
    });

    setRating(0);
    setHoveredRating(0);
    setComment("");

    toast.success(
      "Thank you! Your review has been submitted successfully.",
    );

    setSubmitting(false);
  }

  return (
    <section
      className="
        mt-5
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
      <h2
        className="
          text-[15px]
          font-semibold
          tracking-[-0.02em]
          text-[var(--foreground)]
          lg:text-[16px]
        "
      >
        Write a Review
      </h2>

      <p
        className="
          mt-1
          text-[12px]
          leading-5
          text-[var(--foreground-muted)]
          lg:text-[13px]
        "
      >
        Share your experience to help other shoppers.
      </p>

      <form
        onSubmit={handleSubmit}
        className="
          mt-4
          space-y-4
        "
      >
        <div>
          <label
            className="
              mb-1.5
              block
              text-[12px]
              font-semibold
              text-[var(--foreground)]
              lg:text-[13px]
            "
          >
            Your Rating
          </label>

          <div
            className="
              flex
              gap-1
            "
          >
            {Array.from({
              length: 5,
            }).map((_, index) => {
              const value =
                index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    setRating(value)
                  }
                  onMouseEnter={() =>
                    setHoveredRating(
                      value,
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredRating(0)
                  }
                  className="
                    transition-transform
                    duration-200
                    hover:scale-110
                    disabled:cursor-not-allowed
                  "
                >
                  <Star
                    size={18}
                    strokeWidth={2}
                    fill={
                      value <=
                      (hoveredRating ||
                        rating)
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      value <=
                      (hoveredRating ||
                        rating)
                        ? "text-yellow-400"
                        : "text-yellow-300"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="review"
            className="
              mb-1.5
              block
              text-[12px]
              font-semibold
              text-[var(--foreground)]
              lg:text-[13px]
            "
          >
            Your Review
          </label>

          <textarea
            id="review"
            rows={3}
            value={comment}
            disabled={submitting}
            onChange={(e) =>
              setComment(
                e.target.value,
              )
            }
            placeholder="Tell others what you liked or disliked about this product..."
            className="
              w-full
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-3
              py-2.5
              text-[13px]
              leading-5
              text-[var(--foreground)]
              outline-none
              transition-all
              duration-300
              placeholder:text-[var(--foreground-muted)]
              focus:border-[var(--primary)]
              focus:ring-2
              focus:ring-[var(--primary)]/20
              disabled:opacity-60
            "
          />

        </div>

        <button
          type="submit"
          disabled={submitting}
          className="
            flex
            h-9
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--services-cta-primary-bg)]
            bg-[var(--services-cta-primary-bg)]
            px-4
            text-[13px]
            font-semibold
            text-[var(--services-cta-primary-text)]
            shadow-sm
            transition-all
            duration-300
            enabled:hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {submitting ? (
            <>
              <Loader2
                size={15}
                className="mr-2 animate-spin"
              />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </section>
  );
}