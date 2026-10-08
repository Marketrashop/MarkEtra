"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function NavigationLoader() {
  return (
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
        duration: 0.18,
      }}
      className="
        fixed
        inset-0
        z-[9998]
        flex
        items-center
        justify-center
        bg-[#030712]/80
        backdrop-blur-xl
      "
    >

<div className="absolute inset-0 overflow-hidden z-0">
  <motion.div
    className="
      absolute
      left-[-12rem]
      top-[-10rem]
      h-[30rem]
      w-[30rem]
      rounded-full
      bg-[#6366F1]/30
      blur-[140px]
    "
    animate={{
      x: [0, 120, 40, 0],
      y: [0, 60, 120, 0],
      scale: [1, 1.2, 1.05, 1],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <motion.div
    className="
      absolute
      right-[-10rem]
      top-[20%]
      h-[28rem]
      w-[28rem]
      rounded-full
      bg-[#3B82F6]/25
      blur-[140px]
    "
    animate={{
      x: [0, -120, -30, 0],
      y: [0, -80, 50, 0],
      scale: [1.1, 1, 1.25, 1.1],
    }}
    transition={{
      duration: 24,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <motion.div
    className="
      absolute
      bottom-[-12rem]
      left-1/2
      h-[34rem]
      w-[34rem]
      -translate-x-1/2
      rounded-full
      bg-[#8B5CF6]/25
      blur-[160px]
    "
    animate={{
      x: [-80, 80, -40, -80],
      y: [0, -70, -20, 0],
      scale: [1, 1.15, 0.95, 1],
    }}
    transition={{
      duration: 28,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</div>

<div
  className="
    absolute
    inset-0
    z-10
    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(0,0,0,0.55)_100%)]
  "
/>

<div
  className="
    relative
    z-20
    flex
    flex-col
    items-center
    gap-6
    select-none
  "
>
        <div className="relative h-28 w-28">
          <motion.div
className="
  absolute
  inset-[7px]
  overflow-hidden
  rounded-full
  border
  border-white/8
  bg-white/5
  backdrop-blur-6xl
"
animate={{
  scale: [1, 1.035, 1],
  borderColor: [
    "rgba(255,255,255,.10)",
    "rgba(129,140,248,.65)",
    "rgba(255,255,255,.10)",
  ],
  boxShadow: [
    "0 0 70px rgba(99,102,241,.25)",
    "0 0 180px rgba(99,102,241,.85)",
    "0 0 70px rgba(99,102,241,.25)",
  ],
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
}}
>
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
<motion.div
  className="
    pointer-events-none
    absolute
    inset-y-0
    -left-1/2
    w-1/3
    -skew-x-12
    bg-gradient-to-r
    from-transparent
    via-white/20
    to-transparent
    blur-md
  "
  animate={{
    x: ["-120%", "260%"],
  }}
  transition={{
    duration: 2.5,
    repeat: Infinity,
    repeatDelay: 1.5,
    ease: "easeInOut",
  }}
/>                
<div className="relative flex items-center justify-center">
<motion.div
  animate={{
    x: [-1, 1, -1],
    rotate: [-3, 3, -3],
    filter: [
      "drop-shadow(0 0 0px rgba(99,102,241,0))",
      "drop-shadow(0 0 18px rgba(99,102,241,.55))",
      "drop-shadow(0 0 0px rgba(99,102,241,0))",
    ],
  }}
  transition={{
    duration: 1.8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
    <ShoppingCart
      size={42}
      strokeWidth={2.2}
      className="text-[#6366F1]"
    />
  </motion.div>

  <motion.div
    className="
      absolute
      bottom-[1px]
      left-[8px]
      h-[6px]
      w-[6px]
      rounded-full
      border
      border-[#818CF8]
    "
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#818CF8]" />
    <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#818CF8]" />
  </motion.div>

  <motion.div
    className="
      absolute
      bottom-[1px]
      right-[7px]
      h-[6px]
      w-[6px]
      rounded-full
      border
      border-[#818CF8]
    "
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#818CF8]" />
    <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#818CF8]" />
  </motion.div>

  <motion.div
    className="
      absolute
      h-[9px]
      w-[9px]
      rounded-[2px]
      border
      border-[#A5B4FC]/60
      bg-[#818CF8]/80
      shadow-[0_0_8px_rgba(99,102,241,.35)]
    "
    initial={{
      y: -18,
      opacity: 0,
      scale: 0.7,
    }}
    animate={{
      y: [-18, -10, 4],
      opacity: [0, 1, 0],
      scale: [0.7, 1, 0.45],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.55, 1],
    }}
  />
</div>
            </div>
          </motion.div>
        </div>

        <motion.span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.45em]
            text-[var(--foreground)]
          "
          animate={{
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          MARKETRA
        </motion.span>
      </div>
    </motion.div>
  );
}