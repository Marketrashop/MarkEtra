
"use client";

import Image from "next/image";
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
  Star,
} from "lucide-react";

import type {
  ProductCard,
} from "@/lib/products/product.types";

type HomeProductGalleryCardProps = {
  product: ProductCard;
};

function getPrimaryImage(
  product: ProductCard,
) {
  return (
    product.images.find(
      (image) =>
        image.isPrimary &&
        image.imageUrl,
    ) ??
    product.images.find(
      (image) => image.imageUrl,
    )
  );
}

function formatPrice(
  price: number,
) {
  return `$${price.toFixed(2)}`;
}

export default function HomeProductGalleryCard({
  product,
}: HomeProductGalleryCardProps) {
  const router = useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    isHovered,
    setIsHovered,
  ] = useState(false);

  const primaryImage =
    getPrimaryImage(product);

  const category =
    product.categories?.[0]?.category
      ?.name;

  const productHref =
    `/Product/${product.slug}`;

  const hasDiscount =
    product.compareAtPrice !== null &&
    product.compareAtPrice >
      product.price;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((product.compareAtPrice! -
            product.price) /
            product.compareAtPrice!) *
            100,
        )
      : 0;

  useEffect(() => {
    router.prefetch(productHref);
  }, [
    router,
    productHref,
  ]);

  return (
    <motion.article
      initial={false}
      animate={{
        y: isHovered ? -4 : 0,
      }}
      transition={{
        duration: 0.25,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      onHoverStart={() =>
        setIsHovered(true)
      }
      onHoverEnd={() =>
        setIsHovered(false)
      }
      className="
        group
        relative
        w-[150px]
        shrink-0
        sm:w-[200px]
        md:w-[250px]
        lg:w-[265px]
      "
    >
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
          block
          rounded-[17px]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--product-gallery-bg)]
          sm:rounded-[19px]
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[17px]
            border
            border-[var(--product-gallery-border)]
            bg-[var(--product-gallery-card-bg)]
            shadow-[var(--product-gallery-card-shadow)]
            transition-[border-color,box-shadow]
            duration-300
            group-hover:border-[var(--primary)]
            group-hover:shadow-[var(--product-gallery-card-shadow-hover)]
            sm:rounded-[19px]
          "
        >
          {/* Product image */}
          <div
            className="
              relative
              aspect-[1/1.02]
              overflow-hidden
              bg-[var(--product-gallery-image-bg)]
            "
          >
            {primaryImage?.imageUrl ? (
              <Image
                src={primaryImage.imageUrl}
                alt={
                  primaryImage.altText ??
                  product.name
                }
                fill
                sizes="
                  (max-width: 639px) 150px,
                  (max-width: 767px) 200px,
                  (max-width: 1023px) 250px,
                  265px
                "
                className="
                  select-none
                  object-cover
                  object-center
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.045]
                "
              />
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  text-[var(--foreground-muted)]
                  sm:text-xs
                "
              >
                No image
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <span
                className="
                  absolute
                  right-2
                  top-2
                  z-[2]
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-red-600
                  px-2
                  py-1
                  text-[9px]
                  font-extrabold
                  leading-none
                  text-white
                  shadow-[0_3px_10px_rgba(0,0,0,0.18)]
                  sm:right-2.5
                  sm:top-2.5
                  sm:px-2.5
                  sm:py-1.5
                  sm:text-[10px]
                "
              >
                <span aria-hidden="true">
                  ↓
                </span>
                -{discountPercentage}%
              </span>
            )}

            {/* Desktop hover cue */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[1]
                hidden
                h-20
                bg-gradient-to-t
                from-black/45
                to-transparent
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
                sm:block
              "
            />

            <span
              className="
                pointer-events-none
                absolute
                bottom-3
                left-1/2
                z-[2]
                hidden
                -translate-x-1/2
                items-center
                gap-1.5
                whitespace-nowrap
                rounded-full
                bg-[#5658EC]
                px-4
                py-2.5
                text-[11px]
                font-bold
                text-white
                shadow-[0_6px_20px_rgba(86,88,236,0.35)]
                opacity-0
                transition-all
                duration-300
                group-hover:bottom-4
                group-hover:opacity-100
                sm:inline-flex
              "
            >
              View item
              <ArrowRight
                size={13}
                strokeWidth={2.3}
              />
            </span>
          </div>

          {/* Product details */}
          <div
            className="
              px-2
              pb-2.5
              pt-2.5
              sm:px-3
              sm:pb-3
              sm:pt-3
            "
          >
            {/* Rating */}
            <div
              className="
                flex
                min-w-0
                items-center
                gap-1
                sm:gap-1.5
              "
              aria-label="Product rating"
            >
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-[1px]
                  text-amber-400
                  sm:gap-0.5
                "
                aria-hidden="true"
              >
                {[0, 1, 2, 3, 4].map(
                  (index) => (
                    <Star
                      key={index}
                      size={11}
                      strokeWidth={1.8}
                      fill={
                        index < 4
                          ? "currentColor"
                          : "none"
                      }
                      className="
                        sm:h-[13px]
                        sm:w-[13px]
                      "
                    />
                  ),
                )}
              </div>

              <span
                className="
                  truncate
                  text-[9px]
                  leading-none
                  text-[var(--foreground-muted)]
                  sm:text-[10px]
                "
              >
                4.0
              </span>
            </div>

            {/* Product name */}
            <div
              className="
                mt-1.5
                min-h-[32px]
                sm:mt-2
                sm:min-h-[40px]
              "
            >
              {category && (
                <p
                  className="
                    mb-0.5
                    truncate
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[var(--product-gallery-category)]
                    sm:text-[9px]
                    sm:tracking-[0.12em]
                  "
                >
                  {category}
                </p>
              )}

              <h3
                className="
                  line-clamp-2
                  text-[11px]
                  font-semibold
                  leading-[1.4]
                  text-[var(--foreground)]
                  transition-colors
                  duration-200
                  group-hover:text-[var(--primary)]
                  sm:text-[13px]
                  sm:leading-[1.45]
                "
              >
                {product.name}
              </h3>
            </div>

            {/* Price and mobile details cue */}
            <div
              className="
                mt-2
                flex
                min-w-0
                items-center
                justify-between
                gap-1
                border-t
                border-[var(--product-gallery-border)]
                pt-2
                sm:mt-2.5
                sm:pt-2.5
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  flex-wrap
                  items-baseline
                  gap-x-1.5
                  gap-y-1
                  sm:gap-x-2
                "
              >
                <span
                  className="
                    text-[12px]
                    font-extrabold
                    leading-none
                    text-[var(--product-gallery-price)]
                    sm:text-[15px]
                  "
                >
                  {formatPrice(product.price)}
                </span>

                {hasDiscount && (
                  <span
                    className="
                      truncate
                      text-[9px]
                      font-medium
                      leading-none
                      text-[var(--product-gallery-old-price)]
                      line-through
                      sm:text-[11px]
                    "
                  >
                    {formatPrice(
                      product.compareAtPrice!,
                    )}
                  </span>
                )}
              </div>

              {/* Compact action for touch screens */}
              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--primary)]/40
                  bg-[var(--primary)]/10
                  text-[var(--primary)]
                  transition-all
                  duration-200
                  group-hover:border-[var(--primary)]
                  group-hover:bg-[var(--primary)]
                  group-hover:text-white
                  sm:hidden
                "
                aria-hidden="true"
              >
                <ChevronRight
                  size={16}
                  strokeWidth={2.2}
                />
              </span>

              {/* Explicit action on desktop */}
              <span
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-1
                  whitespace-nowrap
                  text-[10px]
                  font-bold
                  text-[var(--foreground)]
                  transition-colors
                  duration-200
                  group-hover:text-[var(--primary)]
                  md:group-hover:hidden
                "
              >
                View Details
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>

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
              rounded-[17px]
              bg-black/50
              backdrop-blur-md
              sm:rounded-[19px]
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
                  bg-white/15
                "
              >
                <motion.div
                  className="
                    h-full
                    w-1/2
                    rounded-full
                    bg-[#5658EC]
                    shadow-[0_0_12px_rgba(86,88,236,0.8)]
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
      </Link>
    </motion.article>
  );
}
