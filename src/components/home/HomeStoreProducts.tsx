"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Container,
} from "@/components/layout";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import StoreProductCard from "@/components/Shop/StoreProducts/StoreProductCard";

type HomeStoreProductsProps = {
  products: ProductCard[];
};

const DISPLAY_LIMIT = 4;

const ROTATION_INTERVAL =
  5 * 60 * 1000;

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

function buildInitialSet(
  products: ProductCard[],
) {
  return shuffleProducts(
    products,
  ).slice(
    0,
    DISPLAY_LIMIT,
  );
}

function buildNextSet(
  products: ProductCard[],
  currentProducts: ProductCard[],
  usedIds: Set<string>,
) {
  const currentIds =
    new Set(
      currentProducts.map(
        (product) =>
          product.id,
      ),
    );

  const unusedProducts =
    products.filter(
      (product) =>
        !usedIds.has(
          product.id,
        ) &&
        !currentIds.has(
          product.id,
        ),
    );

  const selected =
    shuffleProducts(
      unusedProducts,
    ).slice(
      0,
      DISPLAY_LIMIT,
    );

  if (
    selected.length ===
    DISPLAY_LIMIT
  ) {
    return {
      products: selected,
      usedIds: new Set([
        ...usedIds,
        ...selected.map(
          (product) =>
            product.id,
        ),
      ]),
    };
  }

  const selectedIds =
    new Set(
      selected.map(
        (product) =>
          product.id,
      ),
    );

  const refillPool =
    shuffleProducts(
      products.filter(
        (product) =>
          !currentIds.has(
            product.id,
          ) &&
          !selectedIds.has(
            product.id,
          ),
      ),
    );

  const completedSet = [
    ...selected,
    ...refillPool.slice(
      0,
      DISPLAY_LIMIT -
        selected.length,
    ),
  ];

  return {
    products:
      completedSet,

    usedIds: new Set(
      completedSet.map(
        (product) =>
          product.id,
      ),
    ),
  };
}

export default function HomeStoreProducts({
  products,
}: HomeStoreProductsProps) {
  const [
    displayedProducts,
    setDisplayedProducts,
  ] = useState<
    ProductCard[]
  >(() =>
    buildInitialSet(
      products,
    ),
  );

  const [
    usedIds,
    setUsedIds,
  ] = useState<Set<string>>(
    () =>
      new Set(
        displayedProducts.map(
          (product) =>
            product.id,
        ),
      ),
  );

  useEffect(() => {
    const nextProducts =
      buildInitialSet(
        products,
      );

    setDisplayedProducts(
      nextProducts,
    );

    setUsedIds(
      new Set(
        nextProducts.map(
          (product) =>
            product.id,
        ),
      ),
    );
  }, [products]);

  useEffect(() => {
    if (
      products.length <=
      DISPLAY_LIMIT
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setDisplayedProducts(
          (currentProducts) => {
            let nextSet =
              buildNextSet(
                products,
                currentProducts,
                usedIds,
              );

            if (
              nextSet.products
                .length ===
              0
            ) {
              const fallbackSet =
                shuffleProducts(
                  products.filter(
                    (product) =>
                      !currentProducts.some(
                        (
                          current,
                        ) =>
                          current.id ===
                          product.id,
                      ),
                  ),
                ).slice(
                  0,
                  DISPLAY_LIMIT,
                );

              nextSet = {
                products:
                  fallbackSet,

                usedIds:
                  new Set(
                    fallbackSet.map(
                      (
                        product,
                      ) =>
                        product.id,
                    ),
                  ),
              };
            }

            setUsedIds(
              nextSet.usedIds,
            );

            return nextSet.products;
          },
        );
      }, ROTATION_INTERVAL);

    return () =>
      window.clearInterval(
        interval,
      );
  }, [
    products,
    usedIds,
  ]);

  if (
    products.length ===
    0
  ) {
    return null;
  }

  return (
<section
  className="
    relative
    overflow-hidden
    py-16
    md:py-20
    lg:py-24
  "
  style={{
    background:
      "var(--store-products-bg)",
  }}
>
{/* Featured products background artwork */}
<div
  className="
    pointer-events-none
    absolute
    inset-0
    z-0
    bg-no-repeat
    bg-[length:auto_100%]
    bg-center
    sm:bg-cover
  "
  style={{
    backgroundImage:
      "var(--store-products-bg-image)",
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
        "color-mix(in srgb, var(--store-products-bg) var(--store-products-image-overlay), transparent)",
    }}
  />

  {/* Bottom transition */}
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
        "linear-gradient(to bottom, transparent 0%, var(--store-products-bg) 100%)",
    }}
  />

  <Container
    className="
      relative
      z-[3]
    "
  >
        <div
          className="
            mx-auto
            mb-12
            max-w-[700px]
            px-4
            text-center
            md:mb-14
          "
        >
          <span
            className="
              text-[18px]
              font-extrabold
              leading-none
              text-[#5658EC]
              sm:text-[19px]
              lg:text-[20px]
            "
          >
            Featured Products
          </span>

          <h2
            className="
              mt-3
              text-[30px]
              font-extrabold
              leading-[1.1]
              text-[var(--foreground)]
              sm:text-[36px]
              md:text-[44px]
              lg:text-[40px]
            "
          >
            Our Featured Products
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[640px]
              text-[15px]
              leading-7
              text-[var(--foreground-muted)]
              sm:text-[16px]
              md:text-[17px]
              lg:text-[18px]
            "
          >
            Discover our featured products,
            carefully selected for their
            quality, performance, and
            exceptional value.
          </p>
        </div>

        <div
          className="
            grid
            content-start
            gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {displayedProducts.map(
            (product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                environment="public"
              />
            ),
          )}
        </div>
      </Container>
    </section>
  );
}