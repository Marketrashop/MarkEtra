"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
} from "lucide-react";

import PremiumToastIcon from "./PremiumToastIcon";
import PremiumToastProgress from "./PremiumToastProgress";

import {
  PREMIUM_TOAST_ANIMATION,
  PREMIUM_TOAST_CLOSE_SIZE,
  PREMIUM_TOAST_RADIUS,
  PREMIUM_TOAST_SHADOW,
  PREMIUM_TOAST_WIDTH,
  PREMIUM_TOAST_Z_INDEX,
} from "./premium-toast.constants";

import type {
  PremiumToastState,
} from "./premium-toast.types";

type PremiumToastOverlayProps = {
  toast: PremiumToastState | null;

  onClose: () => void;
};

export default function PremiumToastOverlay({
  toast,
  onClose,
}: PremiumToastOverlayProps) {
  return (
    <AnimatePresence>
      {toast?.open && (
        <motion.div
          key={toast.id}
          initial={{
            opacity: 0,
            y: -18,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -14,
            scale: 0.97,
          }}
          transition={{
            duration:
              PREMIUM_TOAST_ANIMATION,
          }}
          className="
            fixed
            left-1/2
            top-5
            w-[calc(100vw-32px)]
            overflow-hidden
          "
          style={{
            maxWidth:
              PREMIUM_TOAST_WIDTH,

            borderRadius:
              PREMIUM_TOAST_RADIUS,

            zIndex:
              PREMIUM_TOAST_Z_INDEX,

            transform:
              "translateX(-50%)",

            boxShadow:
              PREMIUM_TOAST_SHADOW,

            background:
              "var(--premium-toast-bg)",

            border:
              "1px solid var(--premium-toast-border)",

            backdropFilter:
              "blur(var(--premium-toast-blur))",
          }}
        >
          <div
            className="
              flex
              items-start
              gap-4
              p-5
            "
          >
            <PremiumToastIcon
              variant={
                toast.variant ??
                "success"
              }
            />

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <h3
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[var(--foreground)]
                "
              >
                {toast.title}
              </h3>

              {toast.description && (
                <p
                  className="
                    mt-1
                    text-[13px]
                    leading-6
                    text-[var(--foreground-muted)]
                  "
                >
                  {toast.description}
                </p>
              )}

              {toast.actionLabel &&
                toast.onAction && (
                  <button
                    type="button"
                    onClick={
                      toast.onAction
                    }
                    className="
                      mt-3
                      text-[13px]
                      font-semibold
                      text-[var(--premium-toast-info)]
                      transition-opacity
                      hover:opacity-75
                    "
                  >
                    {toast.actionLabel}
                  </button>
                )}
            </div>

            {toast.dismissible !==
              false && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-colors
                  hover:bg-black/5
                  dark:hover:bg-white/5
                "
                style={{
                  width:
                    PREMIUM_TOAST_CLOSE_SIZE,

                  height:
                    PREMIUM_TOAST_CLOSE_SIZE,
                }}
              >
                <X
                  size={17}
                />
              </button>
            )}
          </div>

          <PremiumToastProgress
            variant={
              toast.variant ??
              "success"
            }
            duration={
              toast.duration
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}