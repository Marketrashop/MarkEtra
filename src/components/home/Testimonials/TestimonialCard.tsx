"use client";

import Image from "next/image";
import { Quote } from "lucide-react";

import RatingStars from "./RatingStars";
import {
  TESTIMONIAL_AVATAR_SIZE,
  TESTIMONIAL_CARD_MIN_HEIGHT,
  TESTIMONIAL_CARD_PADDING,
  TESTIMONIAL_CARD_RADIUS,
  TESTIMONIAL_QUOTE_SIZE,
} from "./testimonials.constants";
import { Testimonial } from "./testimonials.types";

type TestimonialCardProps = {
  testimonial: Testimonial;
  onClick?: () => void;
};

export default function TestimonialCard({
  testimonial,
  onClick,
}: TestimonialCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Read ${testimonial.name}'s testimonial`}
      className={`
        relative
        w-full
        overflow-hidden

        ${TESTIMONIAL_CARD_PADDING}

        border
        border-transparent

        cursor-pointer

        text-left

        transition-all
        duration-300

        bg-[var(--testimonial-card-bg)]

        hover:-translate-y-1
        hover:border-[#5658EC]/40

        focus:outline-none
        focus-visible:border-[#5658EC]/40
        focus-visible:ring-2
        focus-visible:ring-[#5658EC]/20
      `}
      style={{
        borderRadius: TESTIMONIAL_CARD_RADIUS,
        minHeight: TESTIMONIAL_CARD_MIN_HEIGHT,
      }}
    >
      {/* Decorative Quote */}

      <Quote
        size={TESTIMONIAL_QUOTE_SIZE}
        strokeWidth={1.4}
        className="
          absolute
          bottom-5
          right-5

          rotate-180

          text-[#5658EC]
          opacity-[0.08]

          pointer-events-none
        "
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Avatar */}

        <div
          className="
            mx-auto
            mb-4

            overflow-hidden
            rounded-full
          "
          style={{
            width: TESTIMONIAL_AVATAR_SIZE,
            height: TESTIMONIAL_AVATAR_SIZE,
          }}
        >
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={TESTIMONIAL_AVATAR_SIZE}
            height={TESTIMONIAL_AVATAR_SIZE}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>

        {/* Review */}

        <p
          className="
            mb-4

            line-clamp-4

            text-[16px]
            leading-8

            text-[var(--foreground-muted)]
          "
        >
          {testimonial.review}
        </p>

        {/* Footer */}

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h4
              className="
                truncate

                text-[18px]
                font-bold

                text-[var(--foreground)]
              "
            >
              {testimonial.name}
            </h4>

            <p
              className="
                truncate

                text-[15px]

                text-[var(--foreground-muted)]
              "
            >
              {testimonial.designation}
            </p>
          </div>

          <RatingStars
            rating={testimonial.rating}
          />
        </div>
      </div>
    </button>
  );
}