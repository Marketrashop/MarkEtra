"use client";

import { useEffect, useRef } from "react";

import { MessageCircle } from "lucide-react";

import { motion } from "framer-motion";

export default function ChatLauncher() {
  const intervalRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(
          intervalRef.current,
        );
      }
    };
  }, []);

  function handleOpenChat() {
    if (typeof window === "undefined") {
      return;
    }

    const api = window.Tawk_API;

    if (!api) {
      return;
    }

    if (intervalRef.current) {
      window.clearInterval(
        intervalRef.current,
      );

      intervalRef.current = null;
    }

    api.showWidget?.();

    api.maximize?.();

    intervalRef.current =
      window.setInterval(() => {
        if (
          api.isChatMinimized?.()
        ) {
          api.hideWidget?.();

          window.clearInterval(
            intervalRef.current!,
          );

          intervalRef.current =
            null;
        }
      }, 16);
  }

  return (
<div
  className="
    fixed
    bottom-20
    right-5
    z-[75]

    lg:bottom-20
    lg:right-6
  "
>
  {/* Pulse */}
  <motion.div
    className="
      absolute
      inset-0
      rounded-full
      bg-[#5b5cf0]
    "
    animate={{
      scale: [1, 1.65],
      opacity: [0.35, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />

  <button
    type="button"
    aria-label="Open Live Chat"
    title="Live Chat"
    onClick={handleOpenChat}
    className="
      relative

      flex

      h-13
      w-13

      items-center
      justify-center

      rounded-full

      bg-[#5b5cf0]

      text-white

      shadow-[0_12px_35px_rgba(91,92,240,0.45)]

      transition-all
      duration-300

      hover:scale-105
      hover:shadow-[0_16px_45px_rgba(91,92,240,0.55)]

      active:scale-95

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-[#5b5cf0]/40
    "
  >
    <MessageCircle
      size={24}
      strokeWidth={2.2}
    />
  </button>
</div>
  );
}