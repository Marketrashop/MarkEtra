"use client";

import {
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";

import { TESTIMONIAL_STAR_SIZE } from "./testimonials.constants";

type RatingStarsProps = {
  rating: number;
  size?: number;
};

export default function RatingStars({
  rating,
  size = TESTIMONIAL_STAR_SIZE,
}: RatingStarsProps) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-[2px]
      "
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;

        if (rating >= value) {
          return (
            <FaStar
              key={index}
              size={size}
              color="#FFB21D"
            />
          );
        }

        if (rating >= value - 0.5) {
          return (
            <FaStarHalfAlt
              key={index}
              size={size}
              color="#FFB21D"
            />
          );
        }

        return (
          <FaRegStar
            key={index}
            size={size}
            color="#FFB21D"
          />
        );
      })}
    </div>
  );
}