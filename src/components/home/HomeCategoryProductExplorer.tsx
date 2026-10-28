"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Dumbbell,
  Gamepad2,
  HeartPulse,
  House,
  Laptop,
  LayoutGrid,
  LoaderCircle,
  Shapes,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout";

import type { ProductCard } from "@/lib/products/product.types";

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

const DISPLAY_LIMIT = 12;

/* Keyword -> icon. First match wins. */
const CATEGORY_ICONS: Array<[string[], LucideIcon]> = [
  [["phone", "mobile", "accessor"], Smartphone],
  [["comput", "laptop", "pc"], Laptop],
  [["gaming", "game"], Gamepad2],
  [["sport", "fitness"], Dumbbell],
  [["health", "beauty"], HeartPulse],
  [["home", "kitchen", "living"], House],
  [["gadget", "electronic"], Cpu],
  [["fashion", "cloth", "wear"], ShoppingBag],
];

function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.trim().toLowerCase();

  const match = CATEGORY_ICONS.find(([keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  return match ? match[1] : Shapes;
}

type RailState = {
  canPrev: boolean;
  canNext: boolean;
  thumbWidth: number; // % of track
  thumbOffset: number; // % of track
};

const INITIAL_RAIL_STATE: RailState = {
  canPrev: false,
  canNext: true,
  thumbWidth: 30,
  thumbOffset: 0,
};

export default function HomeCategoryProductExplorer({
  products,
  categories,
}: HomeCategoryProductExplorerProps) {
  const railRef = useRef<HTMLUListElement | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | null
  >(null);

  const [isNavigatingToShop, setIsNavigatingToShop] = useState(false);

  const [railState, setRailState] = useState<RailState>(INITIAL_RAIL_STATE);

  /* Only show categories that actually have products, with counts. */
  const visibleCategories = useMemo(() => {
    const counts = new Map<string, number>();

    for (const product of products) {
      for (const { category } of product.categories) {
        counts.set(category.id, (counts.get(category.id) ?? 0) + 1);
      }
    }

    return categories
      .filter((category) => counts.has(category.id))
      .map((category) => ({
        ...category,
        count: counts.get(category.id) ?? 0,
      }));
  }, [categories, products]);

  const categoryProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products;
    }

    return products.filter((product) =>
      product.categories.some(
        ({ category }) => category.id === selectedCategoryId,
      ),
    );
  }, [products, selectedCategoryId]);

  const filteredProducts = useMemo(
    () => categoryProducts.slice(0, DISPLAY_LIMIT),
    [categoryProducts],
  );

  const selectedCategoryName = selectedCategoryId
    ? (visibleCategories.find((category) => category.id === selectedCategoryId)
        ?.name ?? "this category")
    : "all products";

  /* Keep arrows + progress bar in sync with the rail's scroll position. */
  const syncRailState = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxScroll = rail.scrollWidth - rail.clientWidth;

    if (maxScroll <= 1) {
      setRailState({
        canPrev: false,
        canNext: false,
        thumbWidth: 100,
        thumbOffset: 0,
      });

      return;
    }

    const thumbWidth = Math.max(
      (rail.clientWidth / rail.scrollWidth) * 100,
      12,
    );

    const progress = rail.scrollLeft / maxScroll;

    setRailState({
      canPrev: rail.scrollLeft > 4,
      canNext: rail.scrollLeft < maxScroll - 4,
      thumbWidth,
      thumbOffset: progress * (100 - thumbWidth),
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    syncRailState();

    const observer = new ResizeObserver(syncRailState);

    observer.observe(rail);

    return () => observer.disconnect();
  }, [filteredProducts, syncRailState]);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: direction * rail.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Shop by category products"
      className="relative overflow-hidden py-3 sm:py-8"
      style={{ backgroundColor: "var(--home-category-bg)" }}
    >
      {/* Category background */}
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
          backgroundImage: "var(--home-category-background-image)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, black 34%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 10%, black 34%, black 100%)",
        }}
      />

      {/* Background image overlay */}
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
          relative
          z-10
          lg:max-w-[1320px]
          xl:max-w-[1400px]
          2xl:max-w-[1500px]
        "
      >
        {/* Desktop arrows (touch devices just swipe) */}
        <div className="flex justify-end">
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <RailArrow
              direction="prev"
              disabled={!railState.canPrev}
              onClick={() => scrollRail(-1)}
            />

            <RailArrow
              direction="next"
              disabled={!railState.canNext}
              onClick={() => scrollRail(1)}
            />
          </div>
        </div>

        {/* Category filter */}
        <div
          className="
            -mx-1
            mt-1.5
            sm:mt-3
            overflow-x-auto
            px-1
            py-1
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            role="group"
            aria-label="Filter products by category"
            className="flex w-max items-center gap-1 sm:gap-1.5"
          >
            <CategoryChip
              label="All products"
              count={products.length}
              active={selectedCategoryId === null}
              onClick={() => setSelectedCategoryId(null)}
            />

            {visibleCategories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.name}
                count={category.count}
                active={selectedCategoryId === category.id}
                onClick={() => setSelectedCategoryId(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Product rail */}
        <motion.div
          key={selectedCategoryId ?? "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-2 sm:mt-3"
        >
          <ul
            ref={railRef}
            onScroll={syncRailState}
            aria-label={`Products: ${selectedCategoryName}`}
            className="
              flex
              snap-x
              snap-mandatory
              gap-1.5
              overflow-x-auto
              scroll-smooth
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-4
            "
          >
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="
                  w-[148px]
                  shrink-0
                  snap-start
                  sm:w-[220px]
                  lg:w-[250px]
                  xl:w-[270px]
                  [&>*]:w-full
                "
              >
                <HomeCategoryProductCard product={product} />
              </li>
            ))}
          </ul>

          {/* Scroll progress */}
          <div
            aria-hidden="true"
            className="
              relative
              mt-1.5
              sm:mt-2
              h-[2px]
              overflow-hidden
              rounded-full
              bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]
            "
          >
            <div
              className="
                absolute
                inset-y-0
                rounded-full
                bg-[var(--product-gallery-accent)]
                transition-[left,width]
                duration-150
                ease-out
              "
              style={{
                width: `${railState.thumbWidth}%`,
                left: `${railState.thumbOffset}%`,
              }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <div
          className="
            mt-2
            flex
            flex-col
            items-stretch
            gap-1.5
            sm:gap-2
            sm:mt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-[11px] text-[var(--foreground-muted)] sm:text-[13px]">
            Discover something you’ll love in our store.
          </p>

          <Link
            href="/Shop"
            onClick={() => setIsNavigatingToShop(true)}
            aria-busy={isNavigatingToShop}
            className="
              inline-flex
              h-8
              sm:h-9
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[var(--home-category-control-border)]
              bg-[var(--home-category-control-bg)]
              px-3
              sm:px-4
              text-[11px]
              sm:text-xs
              font-semibold
              text-[var(--home-category-control-text)]
              transition-colors
              duration-200
              hover:border-[var(--product-gallery-accent)]
              hover:bg-[var(--product-gallery-accent)]
              hover:text-white
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[var(--product-gallery-accent)]
              active:scale-[0.98]
            "
          >
            {isNavigatingToShop ? (
              <>
                <LoaderCircle
                  size={16}
                  strokeWidth={2.2}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Loading shop
              </>
            ) : (
              <>
                View all products
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </>
            )}
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

type CategoryChipProps = {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
};

function CategoryChip({ label, count, active, onClick }: CategoryChipProps) {
  const Icon = label === "All products" ? LayoutGrid : getCategoryIcon(label);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex
        h-7
        sm:h-8
        shrink-0
        items-center
        gap-1
        sm:gap-1.5
        rounded-full
        border
        pl-2
        pr-2
        sm:pl-2.5
        sm:pr-2.5
        text-[11px]
        sm:text-xs
        font-semibold
        whitespace-nowrap
        transition-colors
        duration-200
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[var(--product-gallery-accent)]
        ${
          active
            ? `
              border-[var(--product-gallery-accent)]
              bg-[var(--product-gallery-accent)]
              text-white
            `
            : `
              border-[var(--home-category-filter-border)]
              bg-[var(--home-category-filter-bg)]
              text-[var(--home-category-filter-text)]
              hover:border-[color-mix(in_srgb,var(--product-gallery-accent)_55%,transparent)]
              hover:text-[var(--foreground)]
            `
        }
      `}
    >
      <Icon size={12} strokeWidth={1.9} className="sm:h-[14px] sm:w-[14px]" aria-hidden="true" />

      <span>{label}</span>

      <span
        className={`
          rounded-full
          px-1
          text-[9px]
          sm:text-[10px]
          font-semibold
          tabular-nums
          leading-3
          sm:leading-4
          ${
            active
              ? "bg-white/20 text-white"
              : "bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] text-[var(--foreground-muted)]"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

type RailArrowProps = {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
};

function RailArrow({ direction, disabled, onClick }: RailArrowProps) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous products" : "Next products"}
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        border
        border-[var(--home-category-control-border)]
        bg-[var(--home-category-control-bg)]
        text-[var(--home-category-control-text)]
        transition
        duration-200
        hover:border-[var(--product-gallery-accent)]
        hover:text-[var(--product-gallery-accent)]
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[var(--product-gallery-accent)]
        active:scale-95
        disabled:pointer-events-none
        disabled:opacity-35
      "
    >
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}