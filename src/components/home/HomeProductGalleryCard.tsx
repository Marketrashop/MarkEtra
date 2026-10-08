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

type HomeProductGalleryCardProps = {
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

export default function HomeProductGalleryCard({
  product,
}: HomeProductGalleryCardProps) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const primaryImage =
    getPrimaryImage(product);

  const category =
    product.categories?.[0]?.category
      ?.name;

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
        y: -4,
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
        sm:w-[200px]
        md:w-[250px]
        lg:w-[265px]
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
          rounded-[17px]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
          sm:rounded-[19px]
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[17px]
            border
            border-[var(--product-gallery-border)]
            bg-[var(--product-gallery-card-bg)]
            p-1.5
            shadow-[var(--product-gallery-card-shadow)]
            transition-shadow
            duration-300
            hover:shadow-[var(--product-gallery-card-shadow-hover)]
            sm:rounded-[19px]
            sm:p-2
          "
        >
          <div
            className="
              relative
              aspect-[1/1.02]
              overflow-hidden
              rounded-[12px]
              bg-[var(--product-gallery-image-bg)]
              sm:rounded-[15px]
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
                  (max-width: 767px) 200px,
                  (max-width: 1023px) 250px,
                  265px
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
                  sm:text-xs
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
              sm:pt-3
            "
          >
            {category && (
              <p
                className="
                  truncate
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[var(--product-gallery-category)]
                  sm:text-[10px]
                  sm:tracking-[0.14em]
                "
              >
                {category}
              </p>
            )}

            <h3
              className="
                mt-1
                truncate
                text-[12px]
                font-semibold
                leading-4
                text-[var(--foreground)]
                sm:mt-1.5
                sm:text-[14px]
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
                sm:mt-2
                sm:gap-2
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
                      text-[var(--product-gallery-old-price)]
                      line-through
                      sm:text-[11px]
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
              rounded-[17px]
              bg-black/45
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