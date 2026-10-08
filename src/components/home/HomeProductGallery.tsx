"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  Container,
} from "@/components/layout";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import HomeProductGalleryCard from "./HomeProductGalleryCard";

type HomeProductGalleryProps = {
  products: ProductCard[];
};

const DISPLAY_LIMIT = 12;
const AUTO_SCROLL_SPEED = 0.35;
const SAFARI_AUTO_SCROLL_SPEED = 0.5;
const RESUME_DELAY = 1800;

function shuffleProducts(
  products: ProductCard[],
) {
  const shuffled = [
    ...products,
  ];

  for (
    let index =
      shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1),
      );

    [
      shuffled[index],
      shuffled[randomIndex],
    ] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function selectDiverseProducts(
  products: ProductCard[],
) {
  const shuffled =
    shuffleProducts(products);

  const selected: ProductCard[] = [];
  const usedCategories =
    new Set<string>();

  for (const product of shuffled) {
    if (
      selected.length >=
      DISPLAY_LIMIT
    ) {
      break;
    }

    const categories =
      product.categories ?? [];

    const categoryKey =
      categories
        .map(
          ({ category }) =>
            category.slug ??
            category.id,
        )
        .join("|");

    if (
      categoryKey &&
      !usedCategories.has(
        categoryKey,
      )
    ) {
      selected.push(product);
      usedCategories.add(
        categoryKey,
      );
    }
  }

  if (
    selected.length <
    DISPLAY_LIMIT
  ) {
    const selectedIds =
      new Set(
        selected.map(
          (product) =>
            product.id,
        ),
      );

    for (const product of shuffled) {
      if (
        selected.length >=
        DISPLAY_LIMIT
      ) {
        break;
      }

      if (
        !selectedIds.has(
          product.id,
        )
      ) {
        selected.push(product);
        selectedIds.add(
          product.id,
        );
      }
    }
  }

  return selected;
}

export default function HomeProductGallery({
  products,
}: HomeProductGalleryProps) {
const router =
  useRouter();

const [
  navigating,
  setNavigating,
] = useState(false);

  const railRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const animationFrameRef =
    useRef<number | null>(
      null,
    );

  const resumeTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

const autoScrollAccumulatorRef =
  useRef(0);

const isSafariRef =
  useRef(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const galleryProducts =
    useMemo(
      () =>
        selectDiverseProducts(
          products,
        ),
      [products],
    );

  const duplicatedProducts =
    useMemo(
      () => [
        ...galleryProducts,
        ...galleryProducts,
        ...galleryProducts,
      ],
      [galleryProducts],
    );

  const normalizeScrollPosition =
    useCallback(() => {
      const rail =
        railRef.current;

      if (!rail) {
        return;
      }

      const thirdWidth =
        rail.scrollWidth / 3;

      if (
        thirdWidth <= 0
      ) {
        return;
      }

      if (
        rail.scrollLeft >=
        thirdWidth * 2
      ) {
        rail.scrollLeft -=
          thirdWidth;
      }

      if (
        rail.scrollLeft <= 0
      ) {
        rail.scrollLeft +=
          thirdWidth;
      }
    }, []);

  const pauseTemporarily =
    useCallback(() => {
      setIsPaused(true);

      if (
        resumeTimeoutRef.current
      ) {
        clearTimeout(
          resumeTimeoutRef.current,
        );
      }

      resumeTimeoutRef.current =
        setTimeout(() => {
          setIsPaused(false);
        }, RESUME_DELAY);
    }, []);

  const scrollByAmount =
    useCallback(
      (direction: number) => {
        const rail =
          railRef.current;

        if (!rail) {
          return;
        }

        pauseTemporarily();

        const amount =
          Math.min(
            rail.clientWidth *
              0.72,
            600,
          );

        rail.scrollBy({
          left:
            direction *
            amount,
          behavior: "smooth",
        });

        window.setTimeout(
          normalizeScrollPosition,
          550,
        );
      },
      [
        normalizeScrollPosition,
        pauseTemporarily,
      ],
    );

useEffect(() => {
  isSafariRef.current =
    /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
}, []);

  useEffect(() => {
    const rail =
      railRef.current;

    if (!rail) {
      return;
    }

    const thirdWidth =
      rail.scrollWidth / 3;

    if (
      thirdWidth > 0
    ) {
      rail.scrollLeft =
        thirdWidth;
    }
  }, [galleryProducts]);

useEffect(() => {
  const rail = railRef.current;

  if (!rail) {
    return;
  }

  const animate = () => {
    if (!isPaused) {
      if (isSafariRef.current) {
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
        rail.scrollLeft +=
          AUTO_SCROLL_SPEED;
      }

      normalizeScrollPosition();
    } else {
      autoScrollAccumulatorRef.current = 0;
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
  isPaused,
  normalizeScrollPosition,
]);

  useEffect(() => {
    return () => {
      if (
        resumeTimeoutRef.current
      ) {
        clearTimeout(
          resumeTimeoutRef.current,
        );
      }

      if (
        animationFrameRef.current
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    };
  }, []);

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
    py-8
    sm:py-10
    md:py-14
  "
  style={{
    background:
      "var(--product-gallery-bg)",
  }}
>
{/* Trending background artwork */}
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
      "var(--product-gallery-bg-image)",
  }}
/>

{/* Readability overlay */}
<div
  className="
    pointer-events-none
    absolute
    inset-0
    z-[1]
  "
  style={{
    background:
      "color-mix(in srgb, var(--product-gallery-bg) var(--product-gallery-image-overlay), transparent)",
  }}
/>

{/* Subtle bottom blend */}
<div
  className="
    pointer-events-none
    absolute
    inset-x-0
    bottom-0
    z-[2]
    h-24
    sm:h-28
    md:h-32
  "
  style={{
    background:
      "linear-gradient(to bottom, transparent 0%, var(--product-gallery-bg) 100%)",
  }}
/>

<Container
  className="
    relative
    z-[3]
    lg:max-w-[1320px]
    xl:max-w-[1400px]
    2xl:max-w-[1500px]
  "
>
      <div
        className="
          mx-auto
          max-w-[680px]
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
              tracking-[0.18em]
              text-[var(--product-gallery-accent)]
              sm:text-[11px]
              sm:tracking-[0.2em]
            "
          >
            MarkEtra Picks
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
            Trending Now
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
            A quick look at products
            worth discovering across
            the MarkEtra store.
          </p>
        </div>

        <div
          className="
            relative
            mt-5
            sm:mt-7
            md:mt-8
          "
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
          onFocus={() =>
            setIsPaused(true)
          }
          onBlur={() =>
            setIsPaused(false)
          }
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-10
              w-8
              bg-gradient-to-r
              from-[var(--product-gallery-bg)]
              to-transparent
              sm:w-12
              md:w-24
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-10
              w-8
              bg-gradient-to-l
              from-[var(--product-gallery-bg)]
              to-transparent
              sm:w-12
              md:w-24
            "
          />

          <button
            type="button"
            aria-label="Previous products"
            onClick={() =>
              scrollByAmount(-1)
            }
            className="
              absolute
              left-1
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
              border-[var(--product-gallery-control-border)]
              bg-[var(--product-gallery-control-bg)]
              text-[var(--product-gallery-control-icon)]
              shadow-[var(--product-gallery-control-shadow)]
              backdrop-blur-md
              transition
              duration-200
              hover:scale-105
              hover:bg-[var(--product-gallery-control-hover)]
              active:scale-95
              sm:left-2
              sm:h-9
              sm:w-9
              md:left-1
              md:h-10
              md:w-10
            "
          >
            <ArrowLeft
              size={14}
              strokeWidth={2}
              className="
                sm:h-[17px]
                sm:w-[17px]
              "
            />
          </button>

          <button
            type="button"
            aria-label="Next products"
            onClick={() =>
              scrollByAmount(1)
            }
            className="
              absolute
              right-1
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
              border-[var(--product-gallery-control-border)]
              bg-[var(--product-gallery-control-bg)]
              text-[var(--product-gallery-control-icon)]
              shadow-[var(--product-gallery-control-shadow)]
              backdrop-blur-md
              transition
              duration-200
              hover:scale-105
              hover:bg-[var(--product-gallery-control-hover)]
              active:scale-95
              sm:right-2
              sm:h-9
              sm:w-9
              md:right-1
              md:h-10
              md:w-10
            "
          >
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="
                sm:h-[17px]
                sm:w-[17px]
              "
            />
          </button>

          <div
            ref={railRef}
            className="
              flex
              gap-2.5
              overflow-x-auto
              px-3
              pb-1.5
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-4
              sm:px-10
              sm:pb-2
              md:px-12
            "
            onScroll={() =>
              normalizeScrollPosition()
            }
            onWheel={() =>
              pauseTemporarily()
            }
            onTouchStart={() =>
              pauseTemporarily()
            }
          >
            {duplicatedProducts.map(
              (
                product,
                index,
              ) => (
                <HomeProductGalleryCard
                  key={`${product.id}-${index}`}
                  product={product}
                />
              ),
            )}
          </div>
        </div>

        <div
          className="
            mt-4
            text-center
            sm:mt-5
          "
        >
<Link
  href="/Shop"
  prefetch
  onClick={(event) => {
    event.preventDefault();

    if (navigating) {
      return;
    }

    setNavigating(true);

    router.push(
      "/Shop",
    );
  }}
  className="
    group
    inline-flex
    items-center
    gap-1.5
    text-[12px]
    font-bold
    text-[var(--foreground)]
    transition-opacity
    duration-200
    hover:opacity-65
    sm:gap-2
    sm:text-[14px]
  "
>
<span
  className="
    relative
    pb-1
    after:absolute
    after:bottom-0
    after:left-0
    after:h-[1.5px]
    after:w-15
    after:rounded-full
    after:bg-[var(--product-gallery-accent)]
    after:transition-all
    after:duration-300
    group-hover:after:w-full
  "
>
  {navigating
    ? "Please wait"
    : "Explore Store"}
</span>

  {!navigating && (
    <ArrowRight
      size={14}
      strokeWidth={2.2}
      className="
        transition-transform
        duration-200
        group-hover:translate-x-1
        sm:h-[15px]
        sm:w-[15px]
      "
    />
  )}

  {navigating && (
    <motion.span
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="
        h-3
        w-3
        animate-spin
        rounded-full
        border-2
        border-[var(--foreground)]
        border-t-transparent
        sm:h-3.5
        sm:w-3.5
      "
    />
  )}
</Link>
        </div>
      </Container>
    </section>
  );
}