"use client";

import { motion } from "framer-motion";

import ExperienceCounter from "./ExperienceCounter";
import {
  EXPERIENCE_CARD_HOVER_SHADOW,
  EXPERIENCE_CARD_HOVER_Y,
  EXPERIENCE_CARD_RADIUS,
  EXPERIENCE_CARD_REST_SHADOW,
  EXPERIENCE_CARD_TRANSITION,
  EXPERIENCE_ICON,
  EXPERIENCE_ICON_SIZE,
} from "./experience.constants";
import { ExperienceItem } from "./experience.types";

type ExperienceCardProps = {
  item: ExperienceItem;
};

export default function ExperienceCard({
  item,
}: ExperienceCardProps) {
  const Icon = item.icon;

  return (
    <motion.article
      whileHover={{
        y: EXPERIENCE_CARD_HOVER_Y,
        boxShadow: EXPERIENCE_CARD_HOVER_SHADOW,
      }}
      transition={{
        duration: EXPERIENCE_CARD_TRANSITION,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        overflow-hidden

        border-2
        border-[#282E7E]

        bg-[var(--surface-card)]

        px-8
        py-10

        text-center
      "
      style={{
        borderRadius: EXPERIENCE_CARD_RADIUS,
        boxShadow: EXPERIENCE_CARD_REST_SHADOW,
      }}
    >
      {/* Top diagonal */}
      <div
        className="
          absolute
          left-0
          top-0

          h-full
          w-full

          -translate-y-1/2
          -rotate-[36deg]

          bg-[#5658EC]/10

          pointer-events-none
        "
      />

      {/* Bottom diagonal */}
      <div
        className="
          absolute
          left-0
          bottom-0

          h-full
          w-full

          translate-y-1/2
          rotate-[36deg]

          bg-[#5658EC]/10

          pointer-events-none
        "
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="
            mx-auto
            mb-5

            flex
            items-center
            justify-center

            rounded-full

            bg-[#5658EC]/20
          "
          style={{
            width: EXPERIENCE_ICON_SIZE,
            height: EXPERIENCE_ICON_SIZE,
          }}
        >
          <Icon
            size={EXPERIENCE_ICON}
            className="text-[#5658EC]"
            strokeWidth={2.3}
          />
        </div>

{/* Counter */}
<div
  className="
    mb-3

    text-[27px]
    font-bold
    leading-none

    text-[var(--experience-text)]

    sm:text-[32px]
    lg:text-[34px]
  "
>
  <ExperienceCounter 
  value={item.value} 
  suffix={item.suffix} />
</div>

{/* Title */}
<h3
  className="
    mx-auto

    whitespace-nowrap

    text-[15px]
    font-bold
    leading-tight

    text-[var(--experience-text)]

    sm:text-[17px]
    lg:text-[18px]
  "
>
  {item.title}
</h3>
      </div>
    </motion.article>
  );
}