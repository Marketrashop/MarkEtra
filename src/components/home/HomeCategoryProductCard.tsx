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

import type {
  ProductCard,
} from "@/lib/products/product.types";

type HomeCategoryProductCardProps = {
  product: ProductCard;
};

function getPrimaryImage(
  product: ProductCard,
) {
  return (
    product.images.find(
      (image) => image.isPrimary,
    ) ??
    product.images[0]
  );
}

function formatPrice(
  price: number,
) {
  return `$${price.toFixed(2)}`;
}

export default function HomeCategoryProductCard({
  product,
}: HomeCategoryProductCardProps) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const primaryImage =
    getPrimaryImage(product);

  const productHref =
    `/Product/${product.slug}`;

  useEffect(() => {
    router.prefetch(
      productHref,
    );
  }, [
    router,
    productHref,
  ]);

  return (
    <motion.article
      whileHover={{
        y: -3,
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
      className="
        group
        relative
        w-[150px]
        shrink-0
        sm:w-[190px]
        md:w-[220px]
        lg:w-[235px]
      "
    >
      <Link
        href={productHref}
        prefetch
        onClick={(event) => {
          event.preventDefault();

          if (loading) {
            return;
          }

          setLoading(true);

          router.push(
            productHref,
          );
        }}
        className="
          block
          rounded-[16px]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
          sm:rounded-[18px]
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[16px]
            border
            border-[var(--home-category-card-border)]
            bg-[var(--home-category-card-bg)]
            p-1.5
            shadow-[var(--home-category-card-shadow)]
            transition-shadow
            duration-300
            hover:shadow-[var(--home-category-card-shadow-hover)]
            sm:rounded-[18px]
            sm:p-2
          "
        >
          <div
            className="
              relative
              aspect-[1/1.02]
              overflow-hidden
              rounded-[11px]
              bg-[var(--home-category-image-bg)]
              sm:rounded-[13px]
            "
          >
            {primaryImage?.imageUrl ? (
              <Image
                src={
                  primaryImage.imageUrl
                }
                alt={
                  primaryImage.altText ??
                  product.name
                }
                fill
                sizes="
                  (max-width: 639px) 150px,
                  (max-width: 767px) 190px,
                  (max-width: 1023px) 220px,
                  235px
                "
                className="
                  object-cover
                  object-center
                  select-none
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.035]
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
                "
              >
                No image
              </div>
            )}
          </div>

          <div
            className="
              px-1
              pb-0.5
              pt-2.5
              sm:px-1.5
              sm:pb-1
              sm:pt-2.5
            "
          >
            <h3
              className="
                truncate
                text-[12px]
                font-semibold
                leading-4
                text-[var(--foreground)]
                sm:text-[13px]
                sm:leading-5
              "
            >
              {product.name}
            </h3>

            <div
              className="
                mt-1.5
                flex
                items-baseline
                gap-1.5
              "
            >
              <span
                className="
                  text-[12px]
                  font-extrabold
                  leading-none
                  text-[var(--home-category-price)]
                  sm:text-[14px]
                "
              >
                {formatPrice(
                  product.price,
                )}
              </span>

              {product.compareAtPrice !==
                null &&
                product.compareAtPrice >
                  product.price && (
                  <span
                    className="
                      truncate
                      text-[9px]
                      font-medium
                      leading-none
                      text-[var(--home-category-old-price)]
                      line-through
                      sm:text-[10px]
                    "
                  >
                    {formatPrice(
                      product.compareAtPrice,
                    )}
                  </span>
                )}
            </div>
          </div>
        </div>

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
              rounded-[16px]
              bg-black/45
              backdrop-blur-md
              sm:rounded-[18px]
            "
          >
            <div
              className="
                w-[78%]
                max-w-[200px]
              "
            >
              <p
                className="
                  mb-2.5
                  text-center
                  text-[11px]
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
      </Link>
    </motion.article>
  );
}