"use client";

import Image from "next/image";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  Package,
  Shirt,
  Smartphone,
  Sparkles,
  Watch,
  Camera,
  type LucideIcon,
} from "lucide-react";

export type DashboardCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
};

type DashboardShopByCategoryProps = {
  categories: DashboardCategory[];
};

const getCategoryHref = (slug: string) =>
  `/Market-Place?category=${encodeURIComponent(slug)}`;

const ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /phone|mobile|tablet/i, icon: Smartphone },
  { match: /laptop|computer|pc|mac/i, icon: Laptop },
  { match: /game|gaming|console/i, icon: Gamepad2 },
  { match: /watch|wearable/i, icon: Watch },
  { match: /audio|headphone|earbud|speaker|sound/i, icon: Headphones },
  { match: /camera|photo/i, icon: Camera },
  { match: /home|kitchen|furniture|garden/i, icon: Home },
  { match: /fashion|cloth|shoe|wear|apparel/i, icon: Shirt },
  { match: /beauty|care|health|cosmetic/i, icon: Sparkles },
];

const FALLBACK_GRADIENTS = [
  "from-indigo-500/35 via-blue-900/40 to-slate-950/60",
  "from-sky-500/30 via-indigo-900/40 to-slate-950/60",
  "from-violet-500/30 via-indigo-900/40 to-slate-950/60",
  "from-cyan-500/25 via-blue-900/40 to-slate-950/60",
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--user-card-bg)]";

function getCategoryIcon(name: string): LucideIcon {
  return ICON_RULES.find((rule) => rule.match.test(name))?.icon ?? Package;
}

function CategoryTile({
  category,
  index,
}: {
  category: DashboardCategory;
  index: number;
}) {
  const Icon = getCategoryIcon(category.name);

  return (
    <NavigationLink
      href={getCategoryHref(category.slug)}
      aria-label={`Browse ${category.name}, ${category.productCount} ${category.productCount === 1 ? "product" : "products"}`}
      className={`group relative block aspect-[5/4] w-[112px] shrink-0 snap-start overflow-hidden rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] transition-colors hover:border-[var(--primary)] sm:aspect-[4/5] sm:w-[150px] sm:rounded-xl lg:w-[170px] ${focusRing}`}
    >
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt=""
          fill
          sizes="(max-width: 639px) 112px, (max-width: 1023px) 150px, 170px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]}`}
        >
          <Icon className="h-8 w-8 text-white/75 sm:h-11 sm:w-11" strokeWidth={1.4} />
        </div>
      )}

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <span
        aria-hidden="true"
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-2 sm:top-2 sm:h-7 sm:w-7"
      >
        <ArrowUpRight size={14} />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
        <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight text-white sm:text-sm">
          {category.name}
        </h3>
        <p className="mt-0.5 text-[10px] leading-tight text-white/75 sm:text-[11px]">
          {category.productCount.toLocaleString("en-US")}{" "}
          {category.productCount === 1 ? "product" : "products"}
        </p>
      </div>
    </NavigationLink>
  );
}

export default function DashboardShopByCategory({
  categories,
}: DashboardShopByCategoryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories]);

  const scrollByPage = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: direction * (scrollerRef.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  if (!categories.length) return null;

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="mb-5 overflow-hidden rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] shadow-[var(--user-card-shadow)] sm:mb-7 sm:rounded-2xl"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <h2
            id="shop-by-category-heading"
            className="text-sm font-semibold tracking-tight text-[var(--user-title)] sm:text-base"
          >
            Shop by category
          </h2>
          <p className="mt-0.5 hidden text-xs text-[var(--user-text-muted)] sm:block">
            Browse products by category
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Scroll categories left"
            className={`hidden h-7 w-7 items-center justify-center rounded-full border border-[var(--user-card-border)] text-[var(--user-title)] transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex ${focusRing}`}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Scroll categories right"
            className={`hidden h-7 w-7 items-center justify-center rounded-full border border-[var(--user-card-border)] text-[var(--user-title)] transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex ${focusRing}`}
          >
            <ChevronRight size={15} />
          </button>
          <NavigationLink
            href="/Market-Place"
            className={`inline-flex h-7 items-center gap-1 rounded-full border border-[var(--user-card-border)] px-2.5 text-[11px] font-medium text-[var(--user-title)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-8 sm:px-3 sm:text-xs ${focusRing}`}
          >
            All categories
            <ArrowRight size={12} />
          </NavigationLink>
        </div>
      </div>

      <div className="border-t border-[var(--user-card-border)] px-2.5 py-2 sm:px-4 sm:py-3">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3"
        >
          {categories.map((category, index) => (
            <CategoryTile key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
