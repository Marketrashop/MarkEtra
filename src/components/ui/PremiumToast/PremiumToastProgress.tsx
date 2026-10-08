"use client";

import {
  motion,
} from "framer-motion";

import {
  PREMIUM_TOAST_DURATION,
} from "./premium-toast.constants";

import {
  getToastProgressColor,
} from "./premium-toast.utils";

import type {
  PremiumToastVariant,
} from "./premium-toast.types";

type PremiumToastProgressProps = {
  variant: PremiumToastVariant;

  duration?: number;
};

export default function PremiumToastProgress({
  variant,
  duration = PREMIUM_TOAST_DURATION,
}: PremiumToastProgressProps) {
  return (
    <div
      className="
        absolute
        bottom-0
        left-0
        h-[3px]
        w-full
        overflow-hidden
        rounded-b-[inherit]
      "
    >
      <motion.div
        initial={{
          width: "100%",
        }}
        animate={{
          width: "0%",
        }}
        transition={{
          duration:
            duration / 1000,
          ease: "linear",
        }}
        className="
          h-full
          rounded-full
        "
        style={{
          background:
            getToastProgressColor(
              variant,
            ),
        }}
      />
    </div>
  );
}