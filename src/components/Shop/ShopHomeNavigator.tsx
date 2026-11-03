"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate } from "framer-motion";
import { NavigationLink } from "@/components/ui/Preloader";

const TOP_SAFE_ZONE = 80;
const BOTTOM_SAFE_ZONE = 100;
const LEFT_SAFE_ZONE = 24;
const RIGHT_SAFE_ZONE = 24;
const SIDE_PADDING = 8;

const HIDE_ON_SCROLL = true;
const SHOW_AFTER_IDLE_MS = 450;
const SCROLL_THRESHOLD = 6;
const NEAR_TOP = 80;

const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 32,
} as const;

function StoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10h18" />
      <path d="M4 10l1.5-6h13L20 10" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
      <path d="M3 10a2 2 0 0 0 4 0" />
      <path d="M7 10a2 2 0 0 0 4 0" />
      <path d="M11 10a2 2 0 0 0 4 0" />
      <path d="M15 10a2 2 0 0 0 4 0" />
      <path d="M19 10a2 2 0 0 0 2 0" />
    </svg>
  );
}

export default function ShopHomeNavigator() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const lastValidPosition = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);
  const isDragging = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!HIDE_ON_SCROLL) return;

    let lastY = window.scrollY;
    let idleTimer: number | undefined;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        const currentY = window.scrollY;
        const delta = currentY - lastY;
        lastY = currentY;

        if (isDragging.current) return;

        if (Math.abs(delta) > SCROLL_THRESHOLD) {
          setHidden(delta > 0 && currentY > NEAR_TOP);
        }

        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(
          () => setHidden(false),
          SHOW_AFTER_IDLE_MS,
        );
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
    };
  }, []);

const handleDragEnd = () => {
  const button = buttonRef.current;
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minLeft = LEFT_SAFE_ZONE;
  const maxLeft =
    viewportWidth - rect.width - RIGHT_SAFE_ZONE;

  const maxTop =
    viewportHeight - rect.height - BOTTOM_SAFE_ZONE;

  const moveTo = (left: number, top: number) => {
    const target = {
      x: x.get() + left - rect.left,
      y: y.get() + top - rect.top,
    };

    animate(x, target.x, SPRING);
    animate(y, target.y, SPRING);

    return target;
  };

  if (
    rect.top < TOP_SAFE_ZONE ||
    rect.left < minLeft ||
    rect.right > viewportWidth - RIGHT_SAFE_ZONE
  ) {
    animate(x, lastValidPosition.current.x, SPRING);
    animate(y, lastValidPosition.current.y, SPRING);
    return;
  }

  const centerX = rect.left + rect.width / 2;
  const snapToLeft = centerX < viewportWidth / 2;

  const targetTop = Math.min(
    Math.max(rect.top, TOP_SAFE_ZONE),
    maxTop,
  );

  const targetLeft = snapToLeft ? minLeft : maxLeft;

  lastValidPosition.current = moveTo(targetLeft, targetTop);
};

  return (
    <>
      {mounted &&
        createPortal(
          <div
            ref={constraintsRef}
            className="pointer-events-none fixed inset-0 z-[80]"
          >
            <motion.div
              ref={buttonRef}
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              dragElastic={0.08}
              style={{
                x,
                y,
                pointerEvents: hidden ? "none" : "auto",
              }}
              animate={{
                opacity: hidden ? 0 : 1,
                scale: hidden ? 0.8 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onPointerDown={() => {
                wasDragged.current = false;
              }}
              onDragStart={() => {
                wasDragged.current = true;
                isDragging.current = true;
                setHidden(false);
              }}
              onDragEnd={() => {
                isDragging.current = false;
                handleDragEnd();
              }}
              whileTap={{ scale: 0.95 }}
              className="
                pointer-events-auto
                fixed
                top-1/2
                right-6
                -mt-[22px]
                will-change-transform
                flex
                h-11
                w-11
                touch-none
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-[#5658EC]
                text-white
                shadow-[0_2px_5px_rgba(0,0,0,0.12),0_1px_3px_rgba(86,88,236,0.12)]
                cursor-grab
                active:cursor-grabbing
              "
            >
<NavigationLink
  href="/Shop"
  aria-label="Go to shop"
  draggable={false}
  onClick={(event) => {
    if (wasDragged.current) {
      event.preventDefault();
      wasDragged.current = false;
    }
  }}
  className="flex h-full w-full items-center justify-center rounded-full"
>
  <StoreIcon />
</NavigationLink>
            </motion.div>
          </div>,
          document.body,
        )}
    </>
  );
}