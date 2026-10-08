"use client";

import Image from "next/image";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
} from "lucide-react";

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

const DISPLAY_LIMIT = 10;
const ROTATION_INTERVAL =
  5 * 60 * 1000;

function shuffleProducts(
  products: DashboardFeaturedProduct[],
) {
  const result = [
    ...products,
  ];

  for (
    let index =
      result.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1),
      );

    [
      result[index],
      result[randomIndex],
    ] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

function buildDisplaySet(
  pool: DashboardFeaturedProduct[],
  usedIds: Set<string>,
) {
  if (
    pool.length <=
    DISPLAY_LIMIT
  ) {
    return pool;
  }

  const unused =
    pool.filter(
      (product) =>
        !usedIds.has(
          product.id,
        ),
    );

  const shuffledUnused =
    shuffleProducts(
      unused,
    );

  const nextSet =
    shuffledUnused.slice(
      0,
      DISPLAY_LIMIT,
    );

  if (
    nextSet.length ===
    DISPLAY_LIMIT
  ) {
    return nextSet;
  }

  const remaining =
    pool.filter(
      (product) =>
        !nextSet.some(
          (item) =>
            item.id ===
            product.id,
        ),
    );

  const shuffledRemaining =
    shuffleProducts(
      remaining,
    );

  return [
    ...nextSet,
    ...shuffledRemaining.slice(
      0,
      DISPLAY_LIMIT -
        nextSet.length,
    ),
  ];
}

export default function DashboardFeaturedProducts({
  products,
}: DashboardFeaturedProductsProps) {
  const [
    displayedProducts,
    setDisplayedProducts,
  ] = useState<
    DashboardFeaturedProduct[]
  >(() =>
    products.slice(
      0,
      DISPLAY_LIMIT,
    ),
  );

  const [
    usedIds,
    setUsedIds,
  ] = useState<Set<string>>(
    () =>
      new Set(
        products
          .slice(
            0,
            DISPLAY_LIMIT,
          )
          .map(
            (product) =>
              product.id,
          ),
      ),
  );

  const hasEnoughProducts =
    products.length >=
    DISPLAY_LIMIT;

  useEffect(() => {
    if (
      products.length === 0 ||
      !hasEnoughProducts
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setUsedIds(
          (currentUsedIds) => {
            let nextUsedIds =
              currentUsedIds;

            const unusedCount =
              products.filter(
                (product) =>
                  !currentUsedIds.has(
                    product.id,
                  ),
              ).length;

            if (
              unusedCount <
              DISPLAY_LIMIT
            ) {
              nextUsedIds =
                new Set();
            }

            return nextUsedIds;
          },
        );

        setDisplayedProducts(
          (currentDisplayed) => {
            const currentUsedIds =
              new Set(
                currentDisplayed.map(
                  (product) =>
                    product.id,
                ),
              );

            const availableForNextSet =
              products.filter(
                (product) =>
                  !currentUsedIds.has(
                    product.id,
                  ),
              );

            let nextSet =
              availableForNextSet.length >=
              DISPLAY_LIMIT
                ? shuffleProducts(
                    availableForNextSet,
                  ).slice(
                    0,
                    DISPLAY_LIMIT,
                  )
                : [];

            if (
              nextSet.length <
              DISPLAY_LIMIT
            ) {
              const usedInCurrentRotation =
                new Set(
                  nextSet.map(
                    (product) =>
                      product.id,
                  ),
                );

              const refillPool =
                shuffleProducts(
                  products.filter(
                    (product) =>
                      !usedInCurrentRotation.has(
                        product.id,
                      ),
                  ),
                );

              nextSet = [
                ...nextSet,
                ...refillPool.slice(
                  0,
                  DISPLAY_LIMIT -
                    nextSet.length,
                ),
              ];
            }

            return nextSet;
          },
        );
      }, ROTATION_INTERVAL);

    return () =>
      window.clearInterval(
        interval,
      );
  }, [
    products,
    hasEnoughProducts,
  ]);

  const visibleProducts =
    useMemo(
      () =>
        displayedProducts.slice(
          0,
          DISPLAY_LIMIT,
        ),
      [displayedProducts],
    );

  return (
    <section
      className="
        mb-8
        overflow-hidden
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        shadow-[var(--user-card-shadow)]
        sm:mb-12
        sm:rounded-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2.5
          px-3
          py-2.5
          sm:gap-4
          sm:px-5
          sm:py-4
        "
      >
        <div className="min-w-0">
          <h2
            className="
              text-[12px]
              font-semibold
              tracking-tight
              text-[var(--user-title)]
              sm:text-base
            "
          >
            Featured Products
          </h2>

          <p
            className="
              mt-0.5
              truncate
              text-[9px]
              leading-4
              text-[var(--user-text-muted)]
              sm:text-[11px]
              sm:leading-5
            "
          >
            A selection of products worth
            exploring.
          </p>
        </div>

        <NavigationLink
          href="/Market-Place"
          className="
            inline-flex
            shrink-0
            items-center
            gap-1
            rounded-lg
            px-2
            py-1.5
            text-[9px]
            font-medium
            text-[var(--primary)]
            transition
            hover:opacity-80
            sm:gap-1.5
            sm:px-2.5
            sm:text-[11px]
          "
        >
          Explore Store

          <ArrowRight
            size={11}
            className="sm:h-[13px] sm:w-[13px]"
          />
        </NavigationLink>
      </div>

      <div
        className="
          border-t
          border-[var(--user-card-border)]
          px-2.5
          py-2.5
          sm:px-4
          sm:py-4
        "
      >
        {products.length ===
        0 ? (
          <div
            className="
              rounded-lg
              border
              border-[var(--user-card-border)]
              bg-[var(--user-stat-bg)]
              px-3
              py-6
              text-center
              text-[10px]
              text-[var(--user-text-muted)]
              sm:px-4
              sm:py-8
              sm:text-[11px]
            "
          >
            No featured products are
            available right now.
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
              sm:gap-2.5
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {visibleProducts.map(
              (product) => (
                <NavigationLink
                  key={product.id}
                  href={`/Market-Place/${encodeURIComponent(
                    product.slug,
                  )}`}
                  className="
                    group
                    min-w-0
                    overflow-hidden
                    rounded-lg
                    border
                    border-[var(--user-card-border)]
                    bg-[var(--user-stat-bg)]
                    transition
                    duration-200
                    hover:border-[var(--primary)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[4/4.5]
                      overflow-hidden
                      bg-[var(--user-card-bg)]
                    "
                  >
                    {product.imageUrl ? (
                      <Image
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                        fill
                        sizes="
                          (max-width: 640px) 45vw,
                          (max-width: 1024px) 30vw,
                          (max-width: 1280px) 23vw,
                          18vw
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-[1.03]
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                          px-2
                          text-center
                          text-[8px]
                          text-[var(--user-text-muted)]
                          sm:px-3
                          sm:text-[9px]
                        "
                      >
                        No image
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      px-2
                      py-2
                      sm:px-2.5
                      sm:py-2.5
                    "
                  >
                    <p
                      className="
                        truncate
                        text-[9px]
                        font-medium
                        text-[var(--user-title)]
                        sm:text-[11px]
                      "
                    >
                      {product.name}
                    </p>

                    <div
                      className="
                        mt-0.5
                        flex
                        items-center
                        gap-1
                        sm:mt-1
                        sm:gap-1.5
                      "
                    >
                      <span
                        className="
                          text-[9px]
                          font-semibold
                          text-[var(--user-title)]
                          sm:text-[11px]
                        "
                      >
                        $
                        {product.price.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits:
                              2,

                            maximumFractionDigits:
                              2,
                          },
                        )}
                      </span>

                      {product.compareAtPrice !==
                        null &&
                        product.compareAtPrice >
                          product.price && (
                          <span
                            className="
                              truncate
                              text-[8px]
                              line-through
                              text-[var(--user-text-muted)]
                              sm:text-[9px]
                            "
                          >
                            $
                            {product.compareAtPrice.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits:
                                  2,

                                maximumFractionDigits:
                                  2,
                              },
                            )}
                          </span>
                        )}
                    </div>
                  </div>
                </NavigationLink>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}