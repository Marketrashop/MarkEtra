"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import type {
  AppEnvironment,
} from "@/types/environment";

import {
  STORE_CARD_HOVER_SHADOW,
  STORE_CARD_HOVER_Y,
  STORE_CARD_RADIUS,
  STORE_CARD_REST_SHADOW,
  STORE_CARD_TRANSITION,
  STORE_CONTENT_HOVER_Y,
} from "./storeProducts.constants";

import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

import StoreProductImage from "./StoreProductImage";
import StoreProductPrice from "./StoreProductPrice";
import StoreProductRating from "./StoreProductRating";

type StoreProductCardProps = {
  product: ProductCard;

  environment?: AppEnvironment;

  variant?: "default" | "compact";
};

export default function StoreProductCard({
  product,

  environment = "public",

  variant = "default",
}: StoreProductCardProps) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

  const truncateTitle = (
    title: string,
    maxLength = 29,
  ) =>
    title.length > maxLength
      ? `${title.slice(0, maxLength)}...`
      : title;

  const productHref =
    environment === "user"
      ? `/Market-Place/${product.slug}`
      : `/Product/${product.slug}`;

  useEffect(() => {
    router.prefetch(
      productHref,
    );
  }, [
    router,
    productHref,
  ]);

  return (
    <Link
      href={productHref}
      prefetch
      onClick={(event) => {
        event.preventDefault();

        if (loading) {
          return;
        }

        setLoading(
          true,
        );

        router.push(
          productHref,
        );
      }}
      className="
        block
        rounded-[20px]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--primary)]
      "
    >
      <motion.article
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="
          group
          relative
          cursor-pointer
          overflow-hidden
          border
          border-[#5658EC]
          bg-[var(--surface-card)]
        "
style={{
  borderRadius:
    STORE_CARD_RADIUS,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
}}
        variants={{
          rest: {
            y: 0,
            boxShadow:
              STORE_CARD_REST_SHADOW,
          },
          hover: {
            y: STORE_CARD_HOVER_Y,
            boxShadow:
              STORE_CARD_HOVER_SHADOW,
          },
        }}
        transition={{
          duration:
            STORE_CARD_TRANSITION,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <StoreProductImage
          product={product}
          environment={environment}
          variant={variant}
        />

        {loading && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="
              absolute
              inset-0
              z-20
              flex
              items-center
              justify-center
              bg-black/45
              backdrop-blur-md
            "
          >
            <div
              className="
                w-[78%]
                max-w-[220px]
              "
            >
              <p
                className="
                  mb-3
                  text-center
                  text-xs
                  font-semibold
                  tracking-wide
                  text-white
                "
              >
                Please wait
              </p>

              <div
                className="
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-white/10
                "
              >
                <motion.div
                  className="
                    h-full
                    w-1/2
                    rounded-full
                    bg-[var(--primary)]
                    shadow-[0_0_12px_var(--primary)]
                  "
                  initial={{
                    x: "-120%",
                  }}
                  animate={{
                    x: "220%",
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={{
            rest: {
              y: 0,
            },
            hover: {
              y:
                STORE_CONTENT_HOVER_Y,
            },
          }}
          transition={{
            duration: 0.25,
          }}
className={`
  rounded-b-[20px]
  bg-[var(--surface-card)]
  ${
variant === "compact"
  ? "min-h-[72px] sm:min-h-[76px]"
  : "min-h-[88px] sm:min-h-[96px] lg:min-h-[100px]"
  }
  ${styles.contentPadding}
`}
        >
          <StoreProductRating
            product={product}
            variant={variant}
          />

          <motion.h3
            variants={{
              rest: {
                color:
                  "var(--foreground)",
              },
              hover: {
                color:
                  "var(--primary)",
              },
            }}
            transition={{
              duration: 0.25,
            }}
className={`
  mt-0.5
  overflow-hidden
  whitespace-nowrap
  leading-[1.3]
  ${styles.title}
`}
          >
            {truncateTitle(
              product.name,
            )}
          </motion.h3>

          <StoreProductPrice
            product={product}
            variant={variant}
          />
        </motion.div>
      </motion.article>
    </Link>
  );
}