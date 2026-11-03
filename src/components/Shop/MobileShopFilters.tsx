"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  useMotionValue,
  animate,
} from "framer-motion";

import { NavigationLink } from "@/components/ui/Preloader";

type Category = {
  id: string;
  name: string;
};

type MobileShopFiltersProps = {
  categories: Category[];
  selectedCategoryId?: string | null;
  productCount?: number;
};

/* ---------- floating button: scroll behavior ---------- */

const HIDE_ON_SCROLL = true; // set to false to keep it always visible
const SHOW_AFTER_IDLE_MS = 450; // how long after scrolling stops it returns
const SCROLL_THRESHOLD = 6; // ignores tiny scroll jitter
const NEAR_TOP = 80; // never hide near the top of the page

/* ---------- icons ---------- */

function SlidersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* ---------- bottom sheet ---------- */

function FilterSheet({
  open,
  onClose,
  categories,
  selectedCategoryId,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategoryId: string | null;
}) {
  const controls = useDragControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const rowClass = (active: boolean) =>
    `flex h-12 w-full items-center justify-between rounded-2xl px-4 text-[15px] font-medium transition-colors duration-200 ${
      active
        ? "bg-[rgba(86,88,236,0.16)] text-[var(--foreground)]"
        : "text-[var(--foreground-muted)] active:bg-white/5"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[85dvh] flex-col rounded-t-[28px] border-t border-white/10 bg-[var(--surface)] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", damping: 34, stiffness: 340 }
            }
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) {
                onClose();
              }
            }}
          >
            <div
              className="touch-none select-none px-5 pb-3 pt-3"
              onPointerDown={(event) => controls.start(event)}
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-white/20" />

              <div className="mt-4 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  Categories
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[var(--foreground-muted)] active:bg-white/10"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div
              className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-4"
              onClick={onClose}
            >
              <NavigationLink
                href="?"
                className={rowClass(!selectedCategoryId)}
              >
                <span>All Products</span>

                {!selectedCategoryId && (
                  <span className="text-[var(--primary)]">
                    <CheckIcon />
                  </span>
                )}
              </NavigationLink>

              {categories.map((category) => {
                const active = selectedCategoryId === category.id;

                return (
                  <NavigationLink
                    key={category.id}
                    href={`?category=${category.id}`}
                    className={rowClass(active)}
                  >
                    <span>{category.name}</span>

                    {active && (
                      <span className="text-[var(--primary)]">
                        <CheckIcon />
                      </span>
                    )}
                  </NavigationLink>
                );
              })}
            </div>

            <div
              className="flex gap-3 border-t border-white/10 px-5 pt-4"
              style={{
                paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
              }}
            >
              {selectedCategoryId && (
                <div onClick={onClose} className="shrink-0">
                  <NavigationLink
                    href="?"
                    className="flex h-12 items-center justify-center rounded-2xl border border-white/10 px-5 text-[14px] font-medium text-[var(--foreground-muted)] active:bg-white/5"
                  >
                    Clear
                  </NavigationLink>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="
                  h-12
                  flex-1
                  rounded-2xl
                  border-2
                  border-[#7778FF]
                  bg-[#5658EC]
                  text-[15px]
                  font-semibold
                  text-white
                  shadow-[0_3px_10px_rgba(86,88,236,0.25)]
                  active:bg-[#6B6DFF]
                  active:scale-[0.98]
                "
              >
                View products
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- main component ---------- */

export default function MobileShopFilters({
  categories,
  selectedCategoryId = null,
}: MobileShopFiltersProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const lastValidPosition = useRef({ x: 0, y: 0 });

  const wasDragged = useRef(false);
  const isDragging = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [selectedCategoryId]);

  // Hide the button while scrolling down, bring it back on scroll up or
  // when scrolling stops.
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

    const topSafeZone = 70;
    const sidePadding = 8;
    const bottomPadding = 8;

    const bottomZoneHeight = 110;

    const spring = {
      type: "spring",
      stiffness: 420,
      damping: 32,
    } as const;

    const moveTo = (left: number, top: number) => {
      const target = {
        x: x.get() + left - rect.left,
        y: y.get() + top - rect.top,
      };

      animate(x, target.x, spring);
      animate(y, target.y, spring);

      return target;
    };

    // Dropped in the top zone: glide back to the last good spot.
    if (rect.top < topSafeZone) {
      animate(x, lastValidPosition.current.x, spring);
      animate(y, lastValidPosition.current.y, spring);
      return;
    }

    const maxLeft = viewportWidth - rect.width - sidePadding;
    const bottomTop = viewportHeight - rect.height - bottomPadding;

    // Dropped anywhere along the bottom: keep its horizontal position,
    // settle flush on the bottom edge.
    const inBottomZone = rect.bottom >= viewportHeight - bottomZoneHeight;

    if (inBottomZone) {
      const targetLeft = Math.min(Math.max(rect.left, sidePadding), maxLeft);

      lastValidPosition.current = moveTo(targetLeft, bottomTop);
      return;
    }

    // Otherwise: snap to the nearest side.
    const centerX = rect.left + rect.width / 2;
    const snapToLeft = centerX < viewportWidth / 2;

    const targetTop = Math.min(Math.max(rect.top, topSafeZone), bottomTop);
    const targetLeft = snapToLeft ? sidePadding : maxLeft;

    lastValidPosition.current = moveTo(targetLeft, targetTop);
  };

  return (
    <>
      {mounted &&
        createPortal(
          <>
            <div
              ref={constraintsRef}
              className="
                pointer-events-none
                fixed
                inset-0
                z-40
                lg:hidden
              "
            >
              <motion.button
                ref={buttonRef}
                type="button"
                onPointerDown={() => {
                  wasDragged.current = false;
                }}
                onClick={() => {
                  if (wasDragged.current) {
                    wasDragged.current = false;
                    return;
                  }

                  setOpen(true);
                }}
                aria-label="Open filters"
                aria-haspopup="dialog"
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
                  fixed
                  bottom-1
                  left-1/2
                  -ml-[22px]
                  will-change-transform
                  flex
                  h-11
                  w-11
                  touch-none
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#7778FF]
                  bg-[#5658EC]
                  text-white
                  shadow-[0_3px_10px_rgba(86,88,236,0.25)]
                  cursor-grab
                  active:cursor-grabbing
                "
              >
                <SlidersIcon />

                {selectedCategoryId && (
                  <span
                    className="
                      absolute
                      right-0.5
                      top-0.5
                      h-2.5
                      w-2.5
                      rounded-full
                      border-2
                      border-[var(--primary)]
                      bg-white
                    "
                  />
                )}
              </motion.button>
            </div>

            <FilterSheet
              open={open}
              onClose={() => setOpen(false)}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
            />
          </>,
          document.body,
        )}
    </>
  );
}