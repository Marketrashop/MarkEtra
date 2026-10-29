
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

import {
  ArrowRight,
  ChevronRight,
} from "lucide-react";

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
  const router = useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const styles =
    STORE_PRODUCT_VARIANTS[variant];

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
    router.prefetch(productHref);
  }, [
    router,
    productHref,
  ]);

  return (
    <Link
      href={productHref}
      prefetch
      aria-label={`View details for ${product.name}`}
      onClick={(event) => {
        event.preventDefault();

        if (loading) {
          return;
        }

        setLoading(true);

        router.push(productHref);
      }}
      className="
        group
        block
        rounded-[20px]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--primary)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
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
          transition-colors
          duration-300
          hover:border-[var(--primary)]
        "
        style={{
          borderRadius: STORE_CARD_RADIUS,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
        }}
        variants={{
          rest: {
            y: 0,
            boxShadow: STORE_CARD_REST_SHADOW,
          },
          hover: {
            y: STORE_CARD_HOVER_Y,
            boxShadow: STORE_CARD_HOVER_SHADOW,
          },
        }}
        transition={{
          duration: STORE_CARD_TRANSITION,
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

        {/* Loading transition */}
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
                Opening product details
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

        {/* Product information */}
        <motion.div
          variants={{
            rest: {
              y: 0,
            },
            hover: {
              y: STORE_CONTENT_HOVER_Y,
            },
          }}
          transition={{
            duration: 0.25,
          }}
          className={`
            relative
            rounded-b-[20px]
            bg-[var(--surface-card)]
            ${
              variant === "compact"
                ? "min-h-[80px] sm:min-h-[82px]"
                : "min-h-[96px] sm:min-h-[104px] lg:min-h-[108px]"
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
                color: "var(--foreground)",
              },
              hover: {
                color: "var(--primary)",
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
            {truncateTitle(product.name)}
          </motion.h3>

          {/* Price and always-visible details action */}
          <div
            className="
              mt-1.5
              flex
              min-w-0
              items-center
              justify-between
              gap-2
              sm:mt-2
            "
          >
            <div className="min-w-0">
              <StoreProductPrice
                product={product}
                variant={variant}
              />
            </div>


{/* Always-visible mobile details button */}
<span
  className="
    flex
    h-8
    w-8
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-[#7778FF]
    bg-[#5658EC]
    text-white
    shadow-[0_3px_10px_rgba(86,88,236,0.25)]
    transition-all
    duration-200
    group-hover:bg-[#6B6DFF]
    group-hover:shadow-[0_5px_14px_rgba(86,88,236,0.4)]
    sm:hidden
  "
  aria-hidden="true"
>
  <ChevronRight
    size={17}
    strokeWidth={2.2}
  />
</span>


{/* Always-visible desktop arrow button */}
<span
  className="
    hidden
    h-8
    w-8
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-[#7778FF]
    bg-[#5658EC]
    text-white
    shadow-[0_3px_10px_rgba(86,88,236,0.25)]
    transition-all
    duration-200
    group-hover:bg-[#6B6DFF]
    group-hover:shadow-[0_5px_14px_rgba(86,88,236,0.4)]
    sm:flex
  "
  aria-hidden="true"
>
  <ChevronRight
    size={16}
    strokeWidth={2.2}
  />
</span>

          </div>
        </motion.div>
      </motion.article>
    </Link>
  );
}
