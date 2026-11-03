"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { NavigationLink } from "@/components/ui/Preloader";

const TOP_SAFE_ZONE = 80;
const BOTTOM_SAFE_ZONE = 100;
const LEFT_SAFE_ZONE = 24;
const RIGHT_SAFE_ZONE = 24;

const HIDE_ON_SCROLL = true;
const SHOW_AFTER_IDLE_MS = 450;
const SCROLL_THRESHOLD = 6;
const NEAR_TOP = 80;

const PRELOADER_EXITED_EVENT = "marketra:preloader-exited";
const PRELOADER_FALLBACK_MS = 6000;

const INTRO_KEY = "shopNavigatorIntroLastSeen";
const INTRO_RESET_MS = 24 * 60 * 60 * 1000;
const ENTRANCE_DELAY_MS = 500;
const LABEL_SHOW_AT_MS = 1000;
const LABEL_HIDE_AT_MS = 5500;
const INTRO_END_FULL_MS = 6500;
const INTRO_END_PULSE_MS = 3000;
const LABEL_TEXT = "Explore Store";

type IntroPhase = "none" | "pulse" | "full";
type Side = "left" | "right";

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
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  const [phase, setPhase] = useState<IntroPhase>("none");
  const [showLabel, setShowLabel] = useState(false);
  const [side, setSide] = useState<Side>("right");

  const reduceMotion = useReducedMotion();

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

    if (document.documentElement.dataset.preloader === "exited") {
      setStarted(true);
      return;
    }

    const start = () => setStarted(true);

    window.addEventListener(PRELOADER_EXITED_EVENT, start, { once: true });

    const fallback = window.setTimeout(start, PRELOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener(PRELOADER_EXITED_EVENT, start);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

let nextPhase: IntroPhase = "none";

try {
  const lastSeen = Number(localStorage.getItem(INTRO_KEY));
  const now = Date.now();

  const shouldShowIntro =
    !Number.isFinite(lastSeen) ||
    lastSeen <= 0 ||
    now - lastSeen >= INTRO_RESET_MS;

  if (shouldShowIntro) {
    nextPhase = "full";
    localStorage.setItem(INTRO_KEY, String(now));
  }
} catch {

}

    const timers: number[] = [];

    timers.push(window.setTimeout(() => setReady(true), ENTRANCE_DELAY_MS));

    if (nextPhase !== "none") {
      setPhase(nextPhase);

      if (nextPhase === "full") {
        timers.push(
          window.setTimeout(
            () => setShowLabel(true),
            ENTRANCE_DELAY_MS + LABEL_SHOW_AT_MS,
          ),
          window.setTimeout(
            () => setShowLabel(false),
            ENTRANCE_DELAY_MS + LABEL_HIDE_AT_MS,
          ),
          window.setTimeout(
            () => setPhase("none"),
            ENTRANCE_DELAY_MS + INTRO_END_FULL_MS,
          ),
        );
      } else {
        timers.push(
          window.setTimeout(
            () => setPhase("none"),
            ENTRANCE_DELAY_MS + INTRO_END_PULSE_MS,
          ),
        );
      }
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [started]);

  const endIntro = () => {
    setShowLabel(false);
    setPhase("none");
  };

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
    const maxLeft = viewportWidth - rect.width - RIGHT_SAFE_ZONE;

    const maxTop = viewportHeight - rect.height - BOTTOM_SAFE_ZONE;

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

    const targetTop = Math.min(Math.max(rect.top, TOP_SAFE_ZONE), maxTop);

    const targetLeft = snapToLeft ? minLeft : maxLeft;

    setSide(snapToLeft ? "left" : "right");
    lastValidPosition.current = moveTo(targetLeft, targetTop);
  };

  const visible = ready && !hidden;

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
                pointerEvents: visible ? "auto" : "none",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: visible ? 1 : 0,
                scale: ready ? (hidden ? 0.8 : 1) : 0.6,
              }}
              transition={{
                opacity: { duration: 0.2, ease: "easeOut" },
                scale: { type: "spring", stiffness: 380, damping: 22 },
              }}
              onPointerDown={() => {
                wasDragged.current = false;
              }}
              onDragStart={() => {
                wasDragged.current = true;
                isDragging.current = true;
                setHidden(false);
                endIntro();
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

              {phase !== "none" && !reduceMotion && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[2px] -z-10 rounded-full bg-[#5658EC]"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                  transition={{
                    duration: 1.4,
                    ease: "easeOut",
                    delay: 0.3,
                    repeat: phase === "full" ? 2 : 0,
                    repeatDelay: 0.4,
                  }}
                />
              )}

              <AnimatePresence>
                {showLabel && (
                  <span
                    key="label"
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-0 flex items-center ${
                      side === "right" ? "right-full mr-2.5" : "left-full ml-2.5"
                    }`}
                  >
                    <motion.span
                      initial={{
                        opacity: 0,
                        x: side === "right" ? 10 : -10,
                        scale: 0.92,
                      }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: side === "right" ? 10 : -10,
                        scale: 0.92,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >

                      <motion.span
                        animate={
                          reduceMotion
                            ? undefined
                            : { x: [0, side === "right" ? 3 : -3, 0] }
                        }
                        transition={{
                          duration: 1.2,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="
                          relative
                          block
                          whitespace-nowrap
                          rounded-full
                          border
                          border-white/15
                          bg-[var(--surface)]
                          px-3
                          py-1.5
                          text-[12px]
                          font-medium
                          text-[var(--foreground)]
                          shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)]
                        "
                      >
                        {LABEL_TEXT}

                        {/* Tail */}
                        <span
                          className={`
                            absolute
                            top-1/2
                            h-2.5
                            w-2.5
                            -translate-y-1/2
                            rotate-45
                            bg-[var(--surface)]
                            ${
                              side === "right"
                                ? "-right-[5px] border-r border-t border-white/15"
                                : "-left-[5px] border-b border-l border-white/15"
                            }
                          `}
                        />
                      </motion.span>
                    </motion.span>
                  </span>
                )}
              </AnimatePresence>

              <NavigationLink
                href="/Shop"
                aria-label="Go to shop"
                draggable={false}
                onClick={(event) => {
                  if (wasDragged.current) {
                    event.preventDefault();
                    wasDragged.current = false;
                    return;
                  }

                  endIntro();
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