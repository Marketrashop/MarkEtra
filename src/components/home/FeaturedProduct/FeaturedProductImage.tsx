
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import { useNavigationLoader } from "@/components/ui/Preloader";

import {
  FEATURED_IMAGE_RADIUS,
  FEATURED_BUTTON_RADIUS,
} from "./featuredProduct.constants";

type FeaturedProductImageProps = {
  product: ProductCard;
};

export default function FeaturedProductImage({
  product,
}: FeaturedProductImageProps) {
  const router = useRouter();

  const { startNavigation } = useNavigationLoader();

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

  const href = `/Product/${product.slug}`;

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
          borderRadius: FEATURED_IMAGE_RADIUS,
        }}
      />

{/* Mobile-only Buy Now overlay */}
<Link
  href={href}
  aria-label={`Buy ${product.name}`}
  onClick={(event) => {
    event.preventDefault();

    startNavigation();

    router.push(href);
  }}
  className="
    absolute
    bottom-2.5
    right-2.5
    z-30

    inline-flex
    h-[33px]
    items-center
    justify-center
    gap-1

    rounded-md
    px-3

    text-[11px]
    font-semibold
    leading-none
    text-white

    shadow-[0_2px_8px_rgba(86,88,236,0.22)]

    transition-all
    duration-200

    hover:bg-[#5B5EF7]
    hover:shadow-[0_4px_12px_rgba(86,88,236,0.3)]

    active:scale-[0.98]

    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-white/80

    lg:hidden
  "
  style={{
    background: "#4a4df5",
    borderRadius: "7px",
  }}
>
  Buy Now

  <ArrowRight
    size={13}
    strokeWidth={2}
  />
</Link>
    </div>
  );
}
