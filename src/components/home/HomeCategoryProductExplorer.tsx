"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Pause,
  LoaderCircle,
  LayoutGrid,
  Smartphone,
  Laptop,
  Gamepad2,
  Dumbbell,
  HeartPulse,
  House,
  Cpu,
  ShoppingBag,
  Shapes,
  type LucideIcon,
} from "lucide-react";

import {
  Container,
} from "@/components/layout";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import HomeCategoryProductCard from "./HomeCategoryProductCard";

type HomeCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type HomeCategoryProductExplorerProps = {
  products: ProductCard[];
  categories: HomeCategoryOption[];
};

function getCategoryIcon(
  name: string,
): LucideIcon {
  const normalized =
    name
      .trim()
      .toLowerCase();

  if (
    normalized.includes("all")
  ) {
    return LayoutGrid;
  }

  if (
    normalized.includes("phone") ||
    normalized.includes("mobile") ||
    normalized.includes("accessor")
  ) {
    return Smartphone;
  }

  if (
    normalized.includes("comput") ||
    normalized.includes("laptop") ||
    normalized.includes("pc")
  ) {
    return Laptop;
  }

  if (
    normalized.includes("gaming") ||
    normalized.includes("game")
  ) {
    return Gamepad2;
  }

  if (
    normalized.includes("sport") ||
    normalized.includes("fitness")
  ) {
    return Dumbbell;
  }

  if (
    normalized.includes("health") ||
    normalized.includes("beauty")
  ) {
    return HeartPulse;
  }

  if (
    normalized.includes("home") ||
    normalized.includes("kitchen") ||
    normalized.includes("living")
  ) {
    return House;
  }

  if (
    normalized.includes("gadget") ||
    normalized.includes("electronic")
  ) {
    return Cpu;
  }

  if (
    normalized.includes("fashion") ||
    normalized.includes("cloth") ||
    normalized.includes("wear")
  ) {
    return ShoppingBag;
  }

  return Shapes;
}

const DISPLAY_LIMIT = 12;
const AUTO_SCROLL_SPEED = 0.25;
const SAFARI_AUTO_SCROLL_SPEED = 0.5;

export default function HomeCategoryProductExplorer({
  products,
  categories,
}: HomeCategoryProductExplorerProps) {
  const railRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const loopSetRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const touchStartX =
    useRef<number | null>(
      null,
    );

  const touchStartY =
    useRef<number | null>(
      null,
    );

  const animationFrameRef =
    useRef<number | null>(
      null,
    );

const wheelInteractionTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const isNormalizingScroll =
    useRef(false);

const autoScrollAccumulatorRef =
  useRef(0);

const isSafariRef =
  useRef(false);

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState<string | null>(
    null,
  );

  const [
    autoScroll,
    setAutoScroll,
  ] = useState(false);

  const [
    isInteracting,
    setIsInteracting,
  ] = useState(false);

const [isRailHovered, setIsRailHovered] =
  useState(false);

const [
  isNavigatingToShop,
  setIsNavigatingToShop,
] = useState(false);

  const [
    showAutoScrollPrompt,
    setShowAutoScrollPrompt,
  ] = useState(false);

  const [
    manualInteractionCount,
    setManualInteractionCount,
  ] = useState(0);

  const [
    autoScrollDeclined,
    setAutoScrollDeclined,
  ] = useState(false);

  const visibleCategories =
    useMemo(() => {
      const categoryIds =
        new Set(
          products.flatMap(
            (product) =>
              product.categories.map(
                ({ category }) =>
                  category.id,
              ),
          ),
        );

      return categories.filter(
        (category) =>
          categoryIds.has(
            category.id,
          ),
      );
    }, [
      categories,
      products,
    ]);

  const filteredProducts =
    useMemo(() => {
      const source =
        selectedCategoryId
          ? products.filter(
              (product) =>
                product.categories.some(
                  ({
                    category,
                  }) =>
                    category.id ===
                    selectedCategoryId,
                ),
            )
          : products;

      return source.slice(
        0,
        DISPLAY_LIMIT,
      );
    }, [
      products,
      selectedCategoryId,
    ]);

  const selectedCategoryName =
    selectedCategoryId
      ? visibleCategories.find(
          (category) =>
            category.id ===
            selectedCategoryId,
        )?.name
      : "All Products";

  /*
   * Keep three copies of the same
   * product sequence.
   *
   * The user starts in the middle
   * copy. When they approach either
   * outer copy, the rail silently
   * moves them back by one complete
   * set width.
   */
  const loopedProducts =
    useMemo(() => {
      return [
        ...filteredProducts,
        ...filteredProducts,
        ...filteredProducts,
      ];
    }, [
      filteredProducts,
    ]);

  const registerManualInteraction =
    () => {
      if (
        autoScroll ||
        autoScrollDeclined ||
        showAutoScrollPrompt
      ) {
        return;
      }

      setManualInteractionCount(
        (current) => {
          const next =
            current + 1;

          if (next >= 2) {
            setShowAutoScrollPrompt(
              true,
            );
          }

          return next;
        },
      );
    };

  useEffect(() => {
    const rail =
      railRef.current;

    const loopSet =
      loopSetRef.current;

    if (
      !rail ||
      !loopSet ||
      filteredProducts.length === 0
    ) {
      return;
    }

    requestAnimationFrame(() => {
      const setWidth =
        loopSet.offsetWidth;

      if (setWidth <= 0) {
        return;
      }

      isNormalizingScroll.current =
        true;

      rail.scrollLeft =
        setWidth;

      isNormalizingScroll.current =
        false;
    });
  }, [
    filteredProducts,
  ]);

  const handleRailScroll = () => {
    const rail =
      railRef.current;

    const loopSet =
      loopSetRef.current;

    if (
      !rail ||
      !loopSet ||
      isNormalizingScroll.current ||
      filteredProducts.length === 0
    ) {
      return;
    }

    const setWidth =
      loopSet.offsetWidth;

    if (setWidth <= 0) {
      return;
    }

    const currentScroll =
      rail.scrollLeft;

    if (
      currentScroll <
      setWidth * 0.5
    ) {
      isNormalizingScroll.current =
        true;

      rail.scrollLeft =
        currentScroll +
        setWidth;

      isNormalizingScroll.current =
        false;

      return;
    }

    if (
      currentScroll >
      setWidth * 1.5
    ) {
      isNormalizingScroll.current =
        true;

      rail.scrollLeft =
        currentScroll -
        setWidth;

      isNormalizingScroll.current =
        false;
    }
  };

useEffect(() => {
  isSafariRef.current =
    /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
}, []);

useEffect(() => {
  const rail = railRef.current;

  if (!rail) {
    return;
  }

  const animate = () => {
    if (
      autoScroll &&
      !isInteracting &&
      !isRailHovered
    ) {
      if (isSafariRef.current) {
        /*
         * Safari does not reliably preserve
         * the same sub-pixel scroll movement
         * as Chromium browsers.
         *
         * Keep the fractional movement
         * internally and apply whole-pixel
         * changes to scrollLeft.
         */
        autoScrollAccumulatorRef.current +=
          SAFARI_AUTO_SCROLL_SPEED;

        if (
          autoScrollAccumulatorRef.current >= 1
        ) {
          const pixelsToMove =
            Math.floor(
              autoScrollAccumulatorRef.current,
            );

          rail.scrollLeft +=
            pixelsToMove;

          autoScrollAccumulatorRef.current -=
            pixelsToMove;
        }
      } else {
        /*
         * Preserve the original smooth
         * movement everywhere else.
         */
        rail.scrollLeft +=
          AUTO_SCROLL_SPEED;
      }
    } else {

      if (!autoScroll) {
        autoScrollAccumulatorRef.current = 0;
      }
    }

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate,
      );
  };

  animationFrameRef.current =
    window.requestAnimationFrame(
      animate,
    );

  return () => {
    if (
      animationFrameRef.current !==
      null
    ) {
      window.cancelAnimationFrame(
        animationFrameRef.current,
      );

      animationFrameRef.current = null;
    }
  };
}, [
  autoScroll,
  isInteracting,
  isRailHovered,
]);

useEffect(() => {
  return () => {
    if (
      animationFrameRef.current !==
      null
    ) {
      window.cancelAnimationFrame(
        animationFrameRef.current,
      );
    }

    if (
      wheelInteractionTimeoutRef.current !==
      null
    ) {
      clearTimeout(
        wheelInteractionTimeoutRef.current,
      );
    }
  };
}, []);

  const scrollRail = (
    direction: number,
  ) => {
    const rail =
      railRef.current;

    if (!rail) {
      return;
    }

    registerManualInteraction();

    rail.scrollBy({
      left:
        direction *
        Math.min(
          rail.clientWidth *
            0.72,
          520,
        ),
      behavior: "smooth",
    });
  };

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }

    touchStartX.current =
      touch.clientX;

    touchStartY.current =
      touch.clientY;

    setIsInteracting(true);
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch =
      event.changedTouches[0];

    if (!touch) {
      touchStartX.current = null;
      touchStartY.current = null;
      setIsInteracting(false);
      return;
    }

    const startX =
      touchStartX.current;

    const startY =
      touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    setIsInteracting(false);

    if (
      startX === null ||
      startY === null
    ) {
      return;
    }

    const deltaX =
      touch.clientX - startX;

    const deltaY =
      touch.clientY - startY;

    const horizontalDistance =
      Math.abs(deltaX);

    const verticalDistance =
      Math.abs(deltaY);

    if (
      horizontalDistance < 45 ||
      horizontalDistance <=
        verticalDistance
    ) {
      return;
    }

    registerManualInteraction();
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    setIsInteracting(false);
  };

const handleWheel = (
  event: React.WheelEvent<HTMLDivElement>,
) => {
  if (
    autoScroll ||
    autoScrollDeclined ||
    showAutoScrollPrompt
  ) {
    return;
  }

  const horizontalDistance =
    Math.abs(event.deltaX);

  const verticalDistance =
    Math.abs(event.deltaY);

  if (
    horizontalDistance < 8 ||
    horizontalDistance <=
      verticalDistance
  ) {
    return;
  }

  if (
    wheelInteractionTimeoutRef.current !==
    null
  ) {
    return;
  }

  registerManualInteraction();

  wheelInteractionTimeoutRef.current =
    setTimeout(() => {
      wheelInteractionTimeoutRef.current =
        null;
    }, 450);
};

  if (
    products.length === 0
  ) {
    return null;
  }

return (
  <section
    className="
      relative
      overflow-hidden
      py-10
      sm:py-12
      md:py-14
    "
    style={{
      backgroundColor:
        "var(--home-category-bg)",
    }}
  >

    {/* Category Background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "var(--home-category-background-image)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, black 34%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, black 34%, black 100%)",
        }}
      />

      {/* Background Image Overlay */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-[var(--home-category-overlay)]
        "
      />

<Container
  className="
    lg:max-w-[1320px]
    xl:max-w-[1400px]
    2xl:max-w-[1500px]
  "
>
        <div
          className="
            relative
            z-10
          "
        >
          {/* Section heading */}
          <div
            className="
              mx-auto
              max-w-[620px]
              px-3
              text-center
              sm:px-4
            "
          >
            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.2em]
                text-[var(--home-category-accent)]
                sm:text-[10px]
              "
            >
              Explore MarkEtra
            </span>

            <h2
              className="
                mt-1.5
                text-[23px]
                font-extrabold
                leading-[1.1]
                tracking-[-0.025em]
                text-[var(--foreground)]
                sm:mt-2
                sm:text-[30px]
                md:text-[34px]
              "
            >
              Shop by Category
            </h2>

            <p
              className="
                mx-auto
                mt-1.5
                max-w-[500px]
                text-[12px]
                leading-5
                text-[var(--foreground-muted)]
                sm:mt-2
                sm:text-[14px]
              "
            >
              Discover products across
              the marketplace.
            </p>
          </div>

          {/* Category selector */}
          <div
            className="
              mt-5
              flex
              items-center
              sm:mt-6
            "
          >
<div
  className="
    min-w-0
    flex-1
    overflow-x-auto
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
  "
style={{
  maskImage:
    "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
}}
>
              <div
                className="
                  flex
                  w-max
                  items-center
                  gap-1
                  px-1
                  sm:gap-1.5
                "
              >
                <CategoryButton
                  active={
                    selectedCategoryId ===
                    null
                  }
                  onClick={() =>
                    setSelectedCategoryId(
                      null,
                    )
                  }
                >
                  All Products
                </CategoryButton>

                {visibleCategories.map(
                  (category) => (
                    <CategoryButton
                      key={category.id}
                      active={
                        selectedCategoryId ===
                        category.id
                      }
                      onClick={() =>
                        setSelectedCategoryId(
                          category.id,
                        )
                      }
                    >
                      {category.name}
                    </CategoryButton>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Product rail */}
<div
  className="
    relative
    mt-5
    w-full
    sm:mt-6
  "
  onMouseEnter={() => {
    setIsInteracting(true);
    setIsRailHovered(true);
  }}
  onMouseLeave={() => {
    setIsInteracting(false);
    setIsRailHovered(false);
  }}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  onTouchCancel={handleTouchCancel}
  onWheel={handleWheel}
>

{/* Browsing paused indicator */}
<AnimatePresence>
  {autoScroll && isRailHovered && (
    <motion.div
      initial={{
        opacity: 0,
        y: -6,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -6,
        scale: 0.97,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="
        pointer-events-none
        absolute
        left-1/2
        top-2
        z-30
        -translate-x-1/2
        overflow-hidden
        rounded-xl
        border
        border-[var(--home-category-control-border)]
        bg-[color-mix(in_srgb,var(--home-category-control-bg)_94%,transparent)]
        px-3
        py-1.5
        shadow-[0_8px_24px_rgba(0,0,0,0.16)]
        backdrop-blur-xl
        sm:top-3
        sm:px-3.5
        sm:py-2
      "
    >
      <div className="flex items-center gap-2">
        <span
          className="
            h-5
            w-0.5
            shrink-0
            rounded-full
            bg-[var(--product-gallery-accent)]
            shadow-[0_0_8px_var(--product-gallery-accent)]
            sm:h-6
          "
        />

        <Pause
          size={11}
          strokeWidth={2.2}
          className="
            shrink-0
            text-[var(--product-gallery-accent)]
            sm:h-3
            sm:w-3
          "
        />

        <div className="flex flex-col leading-tight">
          <span
            className="
              text-[9px]
              font-semibold
              tracking-[-0.01em]
              text-[var(--home-category-control-text)]
              sm:text-[10px]
            "
          >
            Auto-scroll paused
          </span>

          <span
            className="
              mt-0.5
              max-w-[230px]
              text-[8px]
              font-medium
              leading-[1.35]
              text-[var(--foreground-muted)]
              sm:max-w-[260px]
              sm:text-[9px]
            "
          >
            Move your pointer away to resume, or keep it here to focus on products.
          </span>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

            {/* Auto-scroll prompt overlay */}
            <AnimatePresence>
              {showAutoScrollPrompt && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.24,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-30
                    flex
                    items-center
                    justify-center
                    p-3
                    sm:p-5
                  "
                >
                  {/* Subtle rail veil */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-[20px]
                      bg-black/12
                      backdrop-blur-[1px]
                    "
                  />

                  {/* Prompt */}
                  <div
                    className="
                      pointer-events-auto
                      relative
                      w-[calc(100%-24px)]
                      max-w-[350px]
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-white/10
                      bg-black/72
                      p-4
                      shadow-[0_20px_60px_rgba(0,0,0,0.42)]
                      backdrop-blur-2xl
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-[var(--product-gallery-accent)]
                        to-transparent
                        opacity-90
                      "
                    />

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[color-mix(in_srgb,var(--product-gallery-accent)_15%,transparent)]
                          text-[var(--product-gallery-accent)]
                          sm:h-9
                          sm:w-9
                        "
                      >
                        <ArrowRight
                          size={14}
                          strokeWidth={2.2}
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-[11px]
                            font-bold
                            text-white
                            sm:text-[12px]
                          "
                        >
                          Want a smoother
                          browse?
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[9px]
                            leading-[1.5]
                            text-white/55
                            sm:text-[10px]
                          "
                        >
                          Let the products
                          move automatically
                          while you explore.
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        justify-end
                        gap-1
                        sm:mt-4
                        sm:gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowAutoScrollPrompt(
                            false,
                          );

                          setAutoScrollDeclined(
                            true,
                          );
                        }}
                        className="
                          rounded-full
                          px-3
                          py-1.5
                          text-[9px]
                          font-semibold
                          text-white/50
                          transition
                          duration-200
                          hover:bg-white/5
                          hover:text-white
                          sm:px-3.5
                          sm:text-[10px]
                        "
                      >
                        No, thank you
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAutoScrollPrompt(
                            false,
                          );

                          setAutoScroll(
                            true,
                          );
                        }}
                        className="
                          rounded-full
                          bg-[var(--product-gallery-accent)]
                          px-3.5
                          py-1.5
                          text-[9px]
                          font-bold
                          text-white
                          shadow-[0_5px_18px_color-mix(in_srgb,var(--product-gallery-accent)_28%,transparent)]
                          transition
                          duration-200
                          hover:brightness-110
                          active:scale-[0.97]
                          sm:px-4
                          sm:text-[10px]
                        "
                      >
                        Yes, please
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Previous */}
            <button
              type="button"
              aria-label="Previous products"
              onClick={() =>
                scrollRail(-1)
              }
              className="
                absolute
                left-2
                top-1/2
                z-20
                flex
                h-7
                w-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-[var(--home-category-control-border)]
                bg-[var(--home-category-control-bg)]
                text-[var(--home-category-control-text)]
                shadow-[var(--home-category-control-shadow)]
                backdrop-blur-md
                transition
                duration-200
                hover:scale-105
                hover:bg-[var(--home-category-control-hover)]
                active:scale-95

                sm:left-3
                sm:h-9
                sm:w-9
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={2}
                className="
                  sm:h-4
                  sm:w-4
                "
              />
            </button>

            {/* Next */}
            <button
              type="button"
              aria-label="Next products"
              onClick={() =>
                scrollRail(1)
              }
              className="
                absolute
                right-2
                top-1/2
                z-20
                flex
                h-7
                w-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-[var(--home-category-control-border)]
                bg-[var(--home-category-control-bg)]
                text-[var(--home-category-control-text)]
                shadow-[var(--home-category-control-shadow)]
                backdrop-blur-md
                transition
                duration-200
                hover:scale-105
                hover:bg-[var(--home-category-control-hover)]
                active:scale-95

                sm:right-3
                sm:h-9
                sm:w-9
              "
            >
              <ArrowRight
                size={14}
                strokeWidth={2}
                className="
                  sm:h-4
                  sm:w-4
                "
              />
            </button>

            {/* Actual product rail */}
            <div
              ref={railRef}
              onScroll={
                handleRailScroll
              }
              className="
                flex
                gap-2.5
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden

                sm:gap-4
              "
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
            >
              {/* First copy */}
              <div
                className="
                  flex
                  shrink-0
                  gap-2.5

                  sm:gap-4
                "
              >
                {filteredProducts.map(
                  (product) => (
                    <HomeCategoryProductCard
                      key={`first-${product.id}`}
                      product={
                        product
                      }
                    />
                  ),
                )}
              </div>

              {/* Middle copy */}
              <div
                ref={loopSetRef}
                className="
                  flex
                  shrink-0
                  gap-2.5

                  sm:gap-4
                "
              >
                {filteredProducts.map(
                  (product) => (
                    <HomeCategoryProductCard
                      key={`middle-${product.id}`}
                      product={
                        product
                      }
                    />
                  ),
                )}
              </div>

              {/* Third copy */}
              <div
                className="
                  flex
                  shrink-0
                  gap-2.5

                  sm:gap-4
                "
              >
                {filteredProducts.map(
                  (product) => (
                    <HomeCategoryProductCard
                      key={`last-${product.id}`}
                      product={
                        product
                      }
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-3
              sm:mt-5
            "
          >
            <span
              className="
                min-w-0
                truncate
                text-[10px]
                font-semibold
                text-[var(--foreground-muted)]
                sm:text-[11px]
              "
            >
              {selectedCategoryName}
            </span>

<Link
  href="/Shop"
  onClick={() => {
    setIsNavigatingToShop(true);
  }}
  aria-busy={isNavigatingToShop}
  className="
    group
    inline-flex
    shrink-0
    items-center
    gap-1.5
    text-[11px]
    font-bold
    text-[var(--foreground)]
    transition-opacity
    duration-200
    hover:opacity-65
    sm:text-[13px]
  "
>
  <span
    className="
      relative
      inline-flex
      items-center
      gap-1.5
      pb-1
    "
  >
    <span
      className="
        relative
        inline-block
        transition-transform
        duration-150
        group-active:scale-[0.97]
        after:absolute
        after:bottom-0
        after:left-0
        after:h-[1.5px]
        after:w-20
        after:rounded-full
        after:bg-[var(--home-category-accent)]
        after:transition-all
        after:duration-300
        group-hover:after:w-full
        group-active:after:w-full
      "
    >
      {isNavigatingToShop
        ? "Please wait..."
        : "Explore All Categories"}
    </span>

    {isNavigatingToShop ? (
      <LoaderCircle
        size={13}
        strokeWidth={2.2}
        className="
          animate-spin
          text-[var(--home-category-accent)]
          sm:h-3.5
          sm:w-3.5
        "
        aria-hidden="true"
      />
    ) : (
      <ArrowRight
        size={14}
        strokeWidth={2.2}
        className="
          transition-transform
          duration-200
          group-hover:translate-x-1
        "
        aria-hidden="true"
      />
    )}
  </span>
</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

type CategoryButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function CategoryButton({
  active,
  children,
  onClick,
}: CategoryButtonProps) {
  const label =
    typeof children === "string"
      ? children
      : "";

  const Icon =
    getCategoryIcon(label);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
className={`
  group
  relative
  flex
  shrink-0
  items-center
  gap-1
  rounded-full
  border
  px-2
  py-[3px]
  text-[8px]
  font-semibold
  tracking-[-0.01em]
  transition-all
  duration-200

  sm:gap-1
  sm:px-2.5
  sm:py-1
  sm:text-[9px]

        ${
          active
            ? `
              border-[var(--product-gallery-accent)]
              bg-[var(--product-gallery-accent)]
              text-white
              shadow-[0_5px_16px_color-mix(in_srgb,var(--product-gallery-accent)_22%,transparent)]
            `
            : `
              border-[var(--home-category-filter-border)]
              bg-[var(--home-category-filter-bg)]
              text-[var(--home-category-filter-text)]
              backdrop-blur-md
              hover:border-[color-mix(in_srgb,var(--product-gallery-accent)_45%,transparent)]
              hover:bg-[color-mix(in_srgb,var(--product-gallery-accent)_8%,var(--home-category-filter-bg))]
              hover:text-[var(--foreground)]
            `
        }
      `}
    >
      <span
        className={`
          flex
          h-3.5
          w-3.5
          shrink-0
          items-center
          justify-center
          rounded-full
          transition-all
          duration-200

          sm:h-4
          sm:w-4

          ${
            active
              ? `
                bg-white/15
                text-white
              `
              : `
                bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)]
                text-[var(--home-category-filter-icon)]
                group-hover:bg-[color-mix(in_srgb,var(--product-gallery-accent)_12%,transparent)]
                group-hover:text-[var(--product-gallery-accent)]
              `
          }
        `}
      >
        <Icon
          size={9}
          strokeWidth={
            active ? 2.2 : 1.8
          }
          className="
            sm:h-2.5
            sm:w-2.5
          "
        />
      </span>

      <span className="whitespace-nowrap">
        {children}
      </span>
    </button>
  );
}