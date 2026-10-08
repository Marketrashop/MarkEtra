"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
<motion.button
  type="button"
  aria-label="Scroll to top"
  onClick={scrollToTop}
  initial={{
    opacity: 0,
    y: 24,
    scale: 0.9,
  }}
  animate={{
    opacity: 1,
    y: [0, -5, 0, -3, 0],
    scale: 1,
  }}
  exit={{
    opacity: 0,
    y: 24,
    scale: 0.9,
  }}
transition={{
  opacity: {
    duration: 0.25,
  },
  scale: {
    duration: 0.25,
  },
  y: {
    duration: 2.2,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  },
}}
  whileHover={{
    scale: 1.1,
  }}
  whileTap={{
    scale: 0.95,
  }}
  style={{
    boxShadow: "var(--scroll-top-shadow)",
  }}
className="
fixed
bottom-8
right-6
z-50
flex
h-11
w-11
items-center
justify-center
rounded-lg
border-2
border-[var(--scroll-top-border)]
bg-[var(--scroll-top-bg)]
transition-colors
duration-200
hover:brightness-110
"
>
<ChevronsUp
  size={18}
  strokeWidth={3}
  className="text-[var(--scroll-top-icon)]"
/>
        </motion.button>
      )}
    </AnimatePresence>
  );
}