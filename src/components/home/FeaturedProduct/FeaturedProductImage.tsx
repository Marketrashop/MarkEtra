import Image from "next/image";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import {
  FEATURED_IMAGE_RADIUS,
} from "./featuredProduct.constants";

type FeaturedProductImageProps = {
  product: ProductCard;
};

export default function FeaturedProductImage({
  product,
}: FeaturedProductImageProps) {
  const primaryImage =
    product.images.find(
      (image) =>
        image.isPrimary &&
        image.imageUrl,
    ) ??
    product.images.find(
      (image) =>
        image.imageUrl,
    );

  if (!primaryImage?.imageUrl) {
    return null;
  }

  return (
    <div
      className="
        relative
        z-20

        w-full

        max-w-[430px]

        mx-auto

        sm:max-w-[470px]

        md:max-w-[390px]

        lg:max-w-[396px]
        lg:ml-10

        xl:max-w-[396px]
        xl:ml-14

        lg:-translate-y-8
        xl:-translate-y-10
        2xl:-translate-y-12
      "
    >
      <Image
        src={primaryImage.imageUrl}
        alt={
          primaryImage.altText ??
          product.name
        }
        width={396}
        height={440}
        priority
        className="
          block
          h-auto
          w-full
        "
        style={{
          borderRadius:
            FEATURED_IMAGE_RADIUS,
        }}
      />
    </div>
  );
}