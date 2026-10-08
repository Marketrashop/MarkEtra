"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  STORE_IMAGE_SCALE,
} from "./storeProducts.constants";

import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

import type {
  StoreProductImageProps,
} from "./storeProducts.types";

import StoreProductActions from "./StoreProductActions";
import StoreProductBadge from "./StoreProductBadge";

export default function StoreProductImage({
  product,
  environment = "public",
  variant = "default",
}: StoreProductImageProps) {
  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

  const primaryImage =
    product.images.find(
      (image) => image.isPrimary,
    ) ?? product.images[0];

  const hoverImage =
    product.images.find(
      (image) => !image.isPrimary,
    );

  const primaryImageUrl =
    primaryImage?.imageUrl;

  const hoverImageUrl =
    hoverImage?.imageUrl;

  return (
<div
  className="
    relative
    overflow-hidden
    rounded-t-[20px]
    aspect-[var(--mobile-image-aspect-ratio)]
    sm:aspect-[var(--image-aspect-ratio)]
  "
  style={{
    "--mobile-image-aspect-ratio":
      styles.mobileImageAspectRatio,
    "--image-aspect-ratio":
      styles.imageAspectRatio,
  } as React.CSSProperties}
>
      <StoreProductBadge
        product={product}
        variant={variant}
      />

      <StoreProductActions
        product={product}
        environment={environment}
        variant={variant}
      />

      <motion.div
        className="absolute inset-0"
        variants={{
          rest: {
            scale: 1,
          },
          hover: {
            scale:
              STORE_IMAGE_SCALE,
          },
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          variants={{
            rest: {
              opacity: 1,
            },
            hover: {
              opacity:
                hoverImageUrl
                  ? 0
                  : 1,
            },
          }}
          transition={{
            duration: 0.35,
          }}
          className="absolute inset-0"
        >
          {primaryImageUrl && (
            <Image
              src={primaryImageUrl}
              alt={
                primaryImage?.altText ??
                product.name
              }
              fill
              sizes={
                styles.imageSizes
              }
              className="
                object-cover
                object-center
                select-none
              "
              priority={
                product.featured
              }
            />
          )}
        </motion.div>

        {hoverImageUrl && (
          <motion.div
            variants={{
              rest: {
                opacity: 0,
              },
              hover: {
                opacity: 1,
              },
            }}
            transition={{
              duration: 0.35,
            }}
            className="absolute inset-0"
          >
            <Image
              src={hoverImageUrl}
              alt={
                hoverImage?.altText ??
                product.name
              }
              fill
              sizes={
                styles.imageSizes
              }
              className="
                object-cover
                object-center
                select-none
              "
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}