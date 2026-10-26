"use client";

import Image from "next/image";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

export type DashboardFeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
};

type DashboardFeaturedProductsProps = {
  products: DashboardFeaturedProduct[];
};

/* One spotlight product + a grid of supporting products. */
const DISPLAY_LIMIT = 7;
const ROTATION_INTERVAL = 5 * 60 * 1000;
const SWAP_FADE_MS = 250;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Picks the next set to show. Products from the current set are avoided
 * whenever the pool is big enough, so every rotation feels fresh.
 */
function pickNextSet(
  pool: DashboardFeaturedProduct[],
  current: DashboardFeaturedProduct[],
) {
  if (pool.length <= DISPLAY_LIMIT) return pool;

  const currentIds = new Set(current.map((product) => product.id));
  const fresh = shuffle(pool.filter((product) => !currentIds.has(product.id)));

  if (fresh.length >= DISPLAY_LIMIT) return fresh.slice(0, DISPLAY_LIMIT);

  const fillers = shuffle(pool.filter((product) => currentIds.has(product.id)));

  return [...fresh, ...fillers].slice(0, DISPLAY_LIMIT);
}

function getDiscountPercent(price: number, compareAtPrice: number | null) {
  if (compareAtPrice === null || compareAtPrice <= price) return null;

  return Math.round((1 - price / compareAtPrice) * 100);
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
      -{percent}%
    </span>
  );
}


function Price({
  price,
  compareAtPrice,
  large = false,
  onImage = false,
}: {
  price: number;
  compareAtPrice: number | null;
  large?: boolean;
  onImage?: boolean;
}) {
  // Follow ProductPrice.tsx: price is the current selling price and
  // compareAtPrice is the original price shown when it is provided.
  const hasDiscount = compareAtPrice !== null;
  const savings = hasDiscount ? compareAtPrice - price : null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {hasDiscount && (
        <span
          className={`tabular-nums line-through ${
            large ? "text-sm" : "text-[11px] sm:text-xs"
          } ${onImage ? "text-white/60" : "text-[var(--user-text-muted)]"}`}
        >
          {currency.format(compareAtPrice)}
        </span>
      )}

      <span
        className={`font-semibold tabular-nums ${
          large ? "text-xl sm:text-2xl" : "text-sm sm:text-[15px]"
        } ${onImage ? "text-white" : "text-[var(--user-title)]"}`}
      >
        {currency.format(price)}
      </span>


    </div>
  );
}

function ImageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--user-text-muted)]">
      No image
    </div>
  );
}

const cardFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--user-card-bg)]";

/* ------------------------------------------------------------------ */
/* Spotlight (hero) card                                               */
/* ------------------------------------------------------------------ */

function SpotlightCard({ product }: { product: DashboardFeaturedProduct }) {
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  return (
    <NavigationLink
      href={`/Market-Place/${encodeURIComponent(product.slug)}`}
      className={`group relative block aspect-[5/3] overflow-hidden rounded-lg sm:aspect-[16/10] sm:rounded-xl border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[360px] ${cardFocus}`}
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <ImageFallback />
      )}

      {/* Legibility scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
      />

      {discount !== null && (
        <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 sm:left-4 sm:top-4">
          <DiscountBadge percent={discount} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2 sm:gap-3 sm:p-5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white sm:text-lg">
            {product.name}
          </h3>

          <div className="mt-1 sm:mt-1.5">
            <Price
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              large
              onImage
            />
          </div>
        </div>

<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-semibold text-neutral-900 transition sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm">
  Shop now
  <ArrowRight size={14} />
</span>
      </div>
    </NavigationLink>
  );
}

/* ------------------------------------------------------------------ */
/* Standard product tile                                               */
/* ------------------------------------------------------------------ */

function ProductTile({ product }: { product: DashboardFeaturedProduct }) {
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  return (
    <NavigationLink
      href={`/Market-Place/${encodeURIComponent(product.slug)}`}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] transition duration-200 sm:rounded-xl hover:border-[var(--primary)] ${cardFocus}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--user-card-bg)] sm:aspect-square">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 14vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ImageFallback />
        )}

        {discount !== null && (
          <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2">
            <DiscountBadge percent={discount} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-1.5 sm:gap-1 sm:p-3">
        <p className="line-clamp-2 min-h-[2.3em] text-[11px] font-medium leading-tight sm:min-h-[2.5em] sm:text-xs text-[var(--user-title)] sm:text-[13px]">
          {product.name}
        </p>

        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </NavigationLink>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function DashboardFeaturedProducts({
  products,
}: DashboardFeaturedProductsProps) {
  const [displayed, setDisplayed] = useState<DashboardFeaturedProduct[]>(() =>
    products.slice(0, DISPLAY_LIMIT),
  );
  const [isSwapping, setIsSwapping] = useState(false);

  const isPausedRef = useRef(false);
  const swapTimeoutRef = useRef<number | null>(null);

  const canRotate = products.length > DISPLAY_LIMIT;

  // Randomize the displayed products on mount/page refresh and whenever
  // the server supplies a different product pool.
  useEffect(() => {
    setDisplayed(pickNextSet(products, []));
  }, [products]);

  const rotate = useCallback(() => {
    if (swapTimeoutRef.current !== null) {
      window.clearTimeout(swapTimeoutRef.current);
    }

    setIsSwapping(true);

    swapTimeoutRef.current = window.setTimeout(() => {
      setDisplayed((current) => pickNextSet(products, current));
      setIsSwapping(false);
      swapTimeoutRef.current = null;
    }, SWAP_FADE_MS);
  }, [products]);

  // Auto-rotate, but never while the user is looking at / interacting
  // with the grid, or while the tab is hidden.
  useEffect(() => {
    if (!canRotate) return;

    const interval = window.setInterval(() => {
      if (isPausedRef.current || document.visibilityState === "hidden") return;
      rotate();
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [canRotate, rotate]);

  useEffect(
    () => () => {
      if (swapTimeoutRef.current !== null) {
        window.clearTimeout(swapTimeoutRef.current);
      }
    },
    [],
  );

  const [spotlight, ...rest] = displayed;

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="mb-5 overflow-hidden rounded-lg border border-[var(--user-card-border)] bg-[var(--user-card-bg)] shadow-[var(--user-card-shadow)] sm:mb-12 sm:rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2
            id="featured-products-heading"
            className="text-sm font-semibold tracking-tight text-[var(--user-title)] sm:text-lg"
          >
            Exceptional Picks for You
          </h2>

          <p className="mt-0.5 truncate text-[10px] text-[var(--user-text-muted)] sm:text-[13px]">
            Quality finds across multiple categories
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canRotate && (
            <button
              type="button"
              onClick={rotate}
              aria-label="Show different products"
              title="Show different products"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full sm:h-9 sm:w-9 border border-[var(--user-card-border)] text-[var(--user-text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] ${cardFocus}`}
            >
              <RefreshCw
                size={15}
                className={isSwapping ? "animate-spin" : ""}
              />
            </button>
          )}

          <NavigationLink
            href="/Market-Place"
            className={`inline-flex h-7 items-center gap-1 rounded-full border border-[var(--user-card-border)] px-2.5 text-[10px] font-medium sm:h-9 sm:gap-1.5 sm:px-3.5 sm:text-xs text-[var(--user-title)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:text-[13px] ${cardFocus}`}
          >
            Explore store
            <ArrowRight size={14} />
          </NavigationLink>
        </div>
      </div>

      {/* Body */}
      <div className="border-t border-[var(--user-card-border)] p-2 sm:p-5">
        {products.length === 0 || !spotlight ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-4 py-10 text-center">
            <p className="text-sm text-[var(--user-text-muted)]">
              No featured products yet. Check the store for new arrivals.
            </p>

            <NavigationLink
              href="/Market-Place"
              className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:text-sm ${cardFocus}`}
            >
              Browse the store
              <ArrowRight size={14} />
            </NavigationLink>
          </div>
        ) : (
          <div
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onFocusCapture={() => (isPausedRef.current = true)}
            onBlurCapture={() => (isPausedRef.current = false)}
            className={`grid gap-2 transition-opacity duration-200 motion-reduce:transition-none sm:gap-4 lg:grid-cols-12 ${
              isSwapping ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="lg:col-span-5">
              <SpotlightCard product={spotlight} />
            </div>

            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:col-span-7">
                {rest.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}