"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

import { heroData } from "./hero.data";
import {
  HERO_VIDEO_BUTTON_SIZE,
  HERO_VIDEO_ICON_SIZE,
  HERO_VIDEO_SHADOW,
} from "./hero.constants";

const waves = [0, 3, 6];

export default function HeroVideoButton() {
  return (
    <Link
      href={heroData.videoButton.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={heroData.videoButton.ariaLabel}
      className="relative inline-flex items-center justify-center"
    >
      {/* Animated Waves */}
      {waves.map((delay) => (
        <motion.span
          key={delay}
          className="
            absolute
            rounded-full
            bg-[var(--primary)]
          "
          style={{
            width: HERO_VIDEO_BUTTON_SIZE + 18,
            height: HERO_VIDEO_BUTTON_SIZE + 18,
          }}
          initial={{
            scale: 0.75,
            opacity: 0,
          }}
          animate={{
            scale: [0.75, 1.15],
            opacity: [0, 0.12, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      ))}

      {/* Play Button */}
      <motion.div
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.96,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          relative
          z-10
          flex
          items-center
          justify-center
          rounded-full
          bg-white
        "
        style={{
          width: HERO_VIDEO_BUTTON_SIZE,
          height: HERO_VIDEO_BUTTON_SIZE,
          boxShadow: HERO_VIDEO_SHADOW,
        }}
      >
<Play
  fill="currentColor"
  strokeWidth={2}
  className="ml-[2px] text-[var(--hero-badge-bg)]"
  style={{
    width: HERO_VIDEO_ICON_SIZE,
    height: HERO_VIDEO_ICON_SIZE,
  }}
/>
      </motion.div>
    </Link>
  );
}