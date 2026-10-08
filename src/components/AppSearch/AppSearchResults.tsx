"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useNavigationLoader } from "@/components/ui/Preloader";

import {
  useAuth,
} from "@/context/AuthContext";

import type {
  ProductCard,
} from "@/lib/products";

type AppSearchResultsProps = {
  loading: boolean;

  query: string;

  results: ProductCard[];

  onSelect: () => void;
};

export default function AppSearchResults({
  loading,
  query,
  results,
  onSelect,
}: AppSearchResultsProps) {
  const {
    user,
  } = useAuth();

  const router =
    useRouter();

  const {
    startNavigation,
  } = useNavigationLoader();

  if (loading) {
    return (
      <div
        className="
          py-8
          text-center
          text-[11px]
          text-[var(--foreground-muted)]
          sm:py-12
          sm:text-sm
        "
      >
        Searching...
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div
        className="
          py-8
          text-center
          sm:py-12
        "
      >
        <p
          className="
            text-[12px]
            font-medium
            text-[var(--foreground)]
            sm:text-[15px]
          "
        >
          No products found.
        </p>

        <p
          className="
            mt-1.5
            text-[10px]
            text-[var(--foreground-muted)]
            sm:mt-2
            sm:text-sm
          "
        >
          Try a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div>
      {results.map(
        (
          product,
          index,
        ) => {
          const image =
            product.images.find(
              (
                image,
              ) => image.isPrimary,
            ) ??
            product.images[0];

          const href = user
            ? `/Market-Place/${product.slug}`
            : `/Product/${product.slug}`;

          const compareAtPrice =
            product.compareAtPrice;

          const hasDiscount =
            compareAtPrice !== null &&
            compareAtPrice !== undefined;

          return (
            <Link
              key={product.id}
              href={href}
              onClick={(event) => {
                event.preventDefault();

                startNavigation();

                onSelect();

                router.push(href);
              }}
              className="
                relative
                flex
                items-center
                gap-2
                py-2
                transition-opacity
                duration-200
                hover:opacity-80
                sm:gap-3
                sm:py-3
              "
            >
              <div
                className="
                  relative
                  h-10
                  w-10
                  flex-shrink-0
                  overflow-hidden
                  rounded-lg
                  bg-[var(--surface-card)]
                  sm:h-14
                  sm:w-14
                  sm:rounded-xl
                "
              >
                {image && (
                  <Image
                    src={
                      image.imageUrl ??
                      ""
                    }
                    alt={
                      image.altText ??
                      product.name
                    }
                    fill
                    sizes="56px"
                    className="
                      object-cover
                    "
                  />
                )}
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <h3
                  className="
                    truncate
                    text-[11px]
                    font-semibold
                    text-[var(--foreground)]
                    sm:text-[15px]
                  "
                >
                  {product.name}
                </h3>

                <div
                  className="
                    mt-0.5
                    flex
                    flex-wrap
                    items-end
                    gap-1.5
                    sm:mt-1
                    sm:gap-2
                  "
                >
                  {hasDiscount && (
                    <span
                      className="
                        text-[9px]
                        font-medium
                        text-[var(--foreground-muted)]
                        line-through
                        sm:text-[12px]
                      "
                    >
                      ${compareAtPrice.toFixed(2)}
                    </span>
                  )}

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      text-[var(--primary)]
                      sm:text-[15px]
                    "
                  >
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {index !==
                results.length -
                  1 && (
                <div
                  className="
                    absolute
                    bottom-0
                    left-[52px]
                    right-0
                    h-px
                    bg-[var(--border)]
                    sm:left-[72px]
                  "
                />
              )}
            </Link>
          );
        },
      )}
    </div>
  );
}