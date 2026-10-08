"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Headset,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from "lucide-react";

const sparkles = [
  {
    top: -28,
    left: -26,
    size: 17,
    delay: 0,
  },
  {
    top: -18,
    right: -36,
    size: 15,
    delay: 0.4,
  },
  {
    bottom: 48,
    left: -32,
    size: 14,
    delay: 0.8,
  },
  {
    bottom: 18,
    right: -24,
    size: 15,
    delay: 1.2,
  },
  {
    top: 24,
    right: -46,
    size: 12,
    delay: 1.6,
  },
  {
    top: 58,
    left: -54,
    size: 11,
    delay: 2,
  },
  {
    bottom: 64,
    right: -52,
    size: 13,
    delay: 2.4,
  },
];

const floatingIcons = [
  {
    Icon: Gift,
    top: -58,
    left: -78,
    delay: 0,
    size: 36,
  },
  {
    Icon: Headset,
    top: -52,
    right: -84,
    delay: 0.7,
    size: 24,
  },
  {
    Icon: ShoppingBag,
    top: 50,
    left: -112,
    delay: 1.1,
    size: 20,
  },
  {
    Icon: Package,
    bottom: -46,
    left: -76,
    delay: 1.4,
    size: 28,
  },
{
  Icon: ShoppingCart,
  bottom: 52,
  top: 12,
  right: -112,
  delay: 1.8,
  size: 32,
},
  {
    Icon: Truck,
    bottom: -50,
    right: -82,
    delay: 2.1,
    size: 36,
  },
];

export default function PremiumLoader() {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[var(--background)]
      "
    >

{Array.from({ length: 18 }).map((_, index) => (
  <motion.div
    key={index}
    className="
      absolute
      rounded-full
      bg-[#6366F1]
    "
    style={{
      width: 2 + (index % 3),
      height: 2 + (index % 3),
      left: `${(index * 17) % 100}%`,
      top: `${(index * 23) % 100}%`,
      opacity: 0.06,
      filter:
        "blur(0.4px)",
    }}
    animate={{
      y: [
        -10,
        12,
        -10,
      ],
      x: [
        0,
        5,
        -3,
        0,
      ],
      opacity: [
        0.02,
        0.12,
        0.02,
      ],
      scale: [
        1,
        1.4,
        1,
      ],
    }}
    transition={{
      duration: 7 + (index % 5),
      delay: index * 0.25,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
))}

      <div
        className="
          relative
          flex
          flex-col
          items-center
          gap-7
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.35,
          }}
          className="
            relative
            select-none
            text-[30px]
            font-extrabold
            tracking-[-0.04em]
          "
        >
          {sparkles.map(
            (sparkle, index) => (
              <motion.div
                key={index}
                className="
                  absolute
                  flex
                  items-center
                  justify-center
                "
style={{
  ...sparkle,
  filter:
    "drop-shadow(0 0 8px rgba(99,102,241,.45))",
}}
animate={{
  opacity: [
    0.2,
    1,
    0.2,
  ],
  scale: [
    0.85,
    1.45,
    0.85,
  ],
  rotate: [
    0,
    180,
    360,
  ],
}}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: sparkle.delay,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width={sparkle.size}
                  height={sparkle.size}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2L13.9 10.1L22 12L13.9 13.9L12 22L10.1 13.9L2 12L10.1 10.1L12 2Z"
                    fill="#8B5CF6"
                  />
                </svg>
              </motion.div>
            ),
          )}

<motion.div
  className="absolute inset-0"
  animate={{
    rotate: [0, 360],
  }}
  transition={{
    duration: 38,
    repeat: Infinity,
    ease: "linear",
  }}
>
  {floatingIcons.map(
    (
{
  Icon,
  delay,
  size,
  ...style
},
      index,
    ) => (
      <motion.div
        key={index}
        className="
          absolute
          text-[#6366F1]
        "
style={{
  ...style,
  opacity: 0.4,
  filter: "drop-shadow(0 0 10px rgba(99,102,241,.28))",
}}
animate={{
  y: [
    0,
    -10,
    2,
    0,
  ],
  scale: [
    0.94,
    1.05,
    1,
    0.94,
  ],
  rotate: [
    -2,
    2,
    -2,
  ],
  opacity: [
    0.35,
    0.7,
    0.35,
  ],
}}
transition={{
  duration: 4.5,
  repeat: Infinity,
  delay,
  ease: "easeInOut",
}}
      >
<Icon
  size={size}
  strokeWidth={1.8}
/>
      </motion.div>
    ),
  )}
</motion.div>

<motion.div
  className="inline-flex items-center"
  animate={{
    scale: [1, 1.025, 1],
    y: [0, -1, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
<motion.span
  className="text-[var(--foreground)]"
  animate={{
    opacity: [0.92, 1, 0.92],
    scale: [1, 1.025, 1],
  }}
  transition={{
    duration: 2.8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  Mark
</motion.span>

<motion.span
  className="text-[#6366F1]"
  animate={{
    opacity: [0.9, 1, 0.9],
    scale: [1, 1.025, 1],
    textShadow: [
      "0 0 0px rgba(99,102,241,0)",
      "0 0 16px rgba(99,102,241,.45)",
      "0 0 0px rgba(99,102,241,0)",
    ],
  }}
  transition={{
    duration: 2.8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  Etra
</motion.span>
</motion.div>
        </motion.div>

        <div
          className="
            relative
            h-[3px]
            w-[170px]
            overflow-hidden
            rounded-full
            bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]
          "
        >
          <motion.div
            className="
              absolute
              left-0
              top-0
              h-full
              w-[45%]
              rounded-full
              bg-[#6366F1]
            "
            style={{
              boxShadow:
                "0 0 18px rgba(99,102,241,.85)",
            }}
            initial={{
              x: "-120%",
            }}
            animate={{
              x: "260%",
            }}
            transition={{
              repeat: Infinity,
              duration: 1.05,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          className="
            absolute
            h-44
            w-44
            rounded-full
            blur-3xl
          "
          style={{
background:
  "radial-gradient(circle, rgba(99,102,241,.28) 0%, rgba(99,102,241,.12) 55%, transparent 100%)",
          }}
animate={{
  scale: [
    1,
    1.24,
    1,
  ],
  opacity: [
    0.22,
    0.5,
    0.22,
  ],
}}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}