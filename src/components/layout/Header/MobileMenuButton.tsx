"use client";

import { motion } from "framer-motion";

type MobileMenuButtonProps = {
  onClick: () => void;
  isOpen: boolean;
};

export default function MobileMenuButton({
  onClick,
  isOpen,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label={
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      }
      aria-expanded={isOpen}
      onClick={onClick}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--icon-color)]
        shadow-sm
        transition-all
        duration-200
        hover:border-[var(--primary)]
        hover:bg-[var(--muted)]
        hover:text-[var(--primary)]
        active:scale-95
        lg:hidden
      "
    >
      <span
        className="
          relative
          flex
          h-5
          w-5
          flex-col
          items-center
          justify-center
        "
      >
        <motion.span
          className="
            absolute
            h-[2px]
            w-[19px]
            rounded-full
            bg-current
          "
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -6,
          }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        <motion.span
          className="
            absolute
            h-[2px]
            w-[19px]
            rounded-full
            bg-current
          "
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />

        <motion.span
          className="
            absolute
            h-[2px]
            w-[19px]
            rounded-full
            bg-current
          "
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 6,
          }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </span>
    </button>
  );
}