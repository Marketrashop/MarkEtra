"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import HeaderIcons from "./HeaderIcons";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";

type MobileHeaderProps = {
  onMenuClick: () => void;
  isOpen: boolean;
  sticky?: boolean;
};

export default function MobileHeader({
  onMenuClick,
  isOpen,
  sticky = false,
}: MobileHeaderProps) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between px-4",
        sticky
          ? "h-16 bg-[var(--background)]/95 backdrop-blur-lg shadow-lg"
          : "h-[70px] bg-[var(--background)]"
      )}
    >
      <Logo size={sticky ? "sm" : "md"} />

      <div className="flex items-center gap-1.5">
        <HeaderIcons />

<MobileMenuButton
  onClick={onMenuClick}
  isOpen={isOpen}
/>
      </div>
    </div>
  );

  if (!sticky) {
    return (
      <div className="lg:hidden">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: -80,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-50 lg:hidden"
    >
      {content}
    </motion.div>
  );
}