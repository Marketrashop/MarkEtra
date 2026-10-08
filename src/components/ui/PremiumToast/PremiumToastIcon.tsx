"use client";

import {
  motion,
} from "framer-motion";

import {
  Check,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import {
  PREMIUM_TOAST_ICON_SIZE,
} from "./premium-toast.constants";

import {
  getToastGlow,
  getToastIconColor,
} from "./premium-toast.utils";

import type {
  PremiumToastVariant,
} from "./premium-toast.types";

type PremiumToastIconProps = {
  variant: PremiumToastVariant;
};

export default function PremiumToastIcon({
  variant,
}: PremiumToastIconProps) {
  const color =
    getToastIconColor(
      variant,
    );

  const Icon =
    variant === "success"
      ? Check
      : variant === "warning"
        ? TriangleAlert
        : variant === "error"
          ? XCircle
          : Info;

  return (
    <motion.div
      initial={{
        scale: 0.82,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        relative
        shrink-0
        rounded-full
      "
      style={{
        width:
          PREMIUM_TOAST_ICON_SIZE,

        height:
          PREMIUM_TOAST_ICON_SIZE,

        background: `
          radial-gradient(
            circle at 30% 30%,
            color-mix(
              in srgb,
              ${color} 22%,
              white
            ),
            color-mix(
              in srgb,
              ${color} 8%,
              transparent
            )
          )
        `,

        border: `
          1px solid
          color-mix(
            in srgb,
            ${color} 24%,
            transparent
          )
        `,

        boxShadow:
          getToastGlow(
            variant,
          ),
      }}
    >
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          rounded-full
          backdrop-blur-xl
        "
      >
        <Icon
          size={24}
          strokeWidth={
            2.3
          }
          style={{
            color,
          }}
        />
      </div>

      <div
        className="
          absolute
          left-2
          top-2
          h-1.5
          w-1.5
          rounded-full
          bg-white/90
        "
      />
    </motion.div>
  );
}