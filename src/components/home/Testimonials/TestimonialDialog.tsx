"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Quote, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import RatingStars from "./RatingStars";
import {
  TESTIMONIAL_AVATAR_SIZE,
  TESTIMONIAL_QUOTE_OPACITY,
  TESTIMONIAL_QUOTE_SIZE,
  TESTIMONIAL_STAR_SIZE,
} from "./testimonials.constants";
import { Testimonial } from "./testimonials.types";

type TestimonialDialogProps = {
  testimonial: Testimonial | null;
  open: boolean;
  onClose: () => void;
};

export default function TestimonialDialog({
  testimonial,
  open,
  onClose,
}: TestimonialDialogProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && testimonial && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="
            fixed
            inset-0
            z-[999]

            flex
            items-center
            justify-center

            bg-[#020617]/70
            backdrop-blur-xl

            p-5
          "
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-title"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 16,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative

              w-full
              max-w-[700px]

              lg:max-w-[760px]

              max-h-[85vh]
              overflow-y-auto

              border

              bg-[var(--testimonial-card-bg)]
              border-[var(--border-color)]

              shadow-2xl
            "
            style={{
              borderRadius: 24,
            }}
          >
            {/* Close Button */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close testimonial"
              className="
                absolute
                right-5
                top-5
                z-20

                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-full

                bg-white/10

                transition-colors

                hover:bg-white/20
              "
            >
              <X size={18} />
            </button>

            {/* Decorative Quote */}

            <Quote
              size={
                TESTIMONIAL_QUOTE_SIZE + 50
              }
              strokeWidth={1.4}
              className="
                pointer-events-none

                absolute
                bottom-6
                right-6

                rotate-180

                text-[#5658EC]
              "
              style={{
                opacity:
                  TESTIMONIAL_QUOTE_OPACITY *
                  0.6,
              }}
            />

            <div
              className="
                relative
                z-10

                px-10
                py-8
              "
            >
              {/* Avatar */}

              <div
                className="
                  mx-auto
                  overflow-hidden
                  rounded-full
                "
                style={{
                  width:
                    TESTIMONIAL_AVATAR_SIZE +
                    20,
                  height:
                    TESTIMONIAL_AVATAR_SIZE +
                    20,
                }}
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={
                    TESTIMONIAL_AVATAR_SIZE +
                    20
                  }
                  height={
                    TESTIMONIAL_AVATAR_SIZE +
                    20
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* Name */}

              <h3
                id="testimonial-title"
                className="
                  mt-7

                  text-center
                  text-[30px]
                  font-bold

                  text-[var(--foreground)]
                "
              >
                {testimonial.name}
              </h3>

              {/* Designation */}

              <p
                className="
                  mt-2

                  text-center
                  text-[17px]

                  text-[var(--foreground-muted)]
                "
              >
                {testimonial.designation}
              </p>

              {/* Rating */}

              <div
                className="
                  mt-6

                  flex
                  justify-center
                "
              >
                <RatingStars
                  rating={
                    testimonial.rating
                  }
                  size={
                    TESTIMONIAL_STAR_SIZE + 2
                  }
                />
              </div>

              {/* Divider */}

              <div
                className="
                  mx-auto
                  my-8
                  h-px
                  max-w-[560px]

                  bg-[var(--border-color)]
                "
              />

              {/* Review */}

              <p
                className="
                  mx-auto
                  max-w-[560px]

                  text-center

                  text-[18px]
                  leading-[2.05]

                  text-[var(--foreground-muted)]
                "
              >
                {testimonial.review}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}