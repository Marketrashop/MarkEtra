
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import { useNavigationLoader } from "@/components/ui/Preloader";

import {
  FEATURED_BUTTON_HEIGHT,
  FEATURED_BUTTON_RADIUS,
  FEATURED_CONTENT_MAX_WIDTH,
} from "./featuredProduct.constants";

type FeaturedProductContentProps = {
  product: ProductCard;
};

const FEATURED_NAME_MAX_LENGTH = 25;
const FEATURED_DESCRIPTION_MAX_LENGTH = 165;

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncatedLength = maxLength - 3;

  return text.slice(0, truncatedLength).trimEnd() + "...";
}

function truncateDescription(description: string) {
  return truncateText(
    description,
    FEATURED_DESCRIPTION_MAX_LENGTH,
  );
}

function truncateProductName(name: string) {
  return truncateText(name, FEATURED_NAME_MAX_LENGTH);
}

export default function FeaturedProductContent({
  product,
}: FeaturedProductContentProps) {
  const router = useRouter();

  const { startNavigation } = useNavigationLoader();

  const href = `/Product/${product.slug}`;

  return (
    <div
      className="
        mx-auto
        w-full

        lg:-translate-x-5
        xl:-translate-x-6
        2xl:-translate-x-8

        lg:-translate-y-4
        xl:-translate-y-5
        2xl:-translate-y-6
      "
      style={{
        maxWidth: FEATURED_CONTENT_MAX_WIDTH,
      }}
    >
      {/* Static label */}
      <span
        className="
          mb-2
          inline-block
          text-[15px]
          font-bold
          text-[var(--featured-accent)]

          sm:mb-3
          sm:text-[18px]

          md:text-[19px]
        "
      >
        Featured Product
      </span>

      {/* Animated product information */}
      <div>
        <h2
          className="
            mb-2
            text-[21px]
            font-extrabold
            uppercase
            leading-[1.12]
            text-[var(--featured-title)]

            sm:mb-4
            sm:text-[24px]

            md:text-[30px]

            xl:text-[38px]
          "
        >
          {truncateProductName(product.name)}
        </h2>

        <div
          className="
            mb-3
            flex
            items-center
            gap-2

            sm:mb-4
            sm:gap-3
          "
        >
          {product.compareAtPrice !== null && (
            <span
              className="
                text-[12px]
                font-semibold
                leading-none
                text-[var(--featured-text)]
                line-through
                opacity-60

                sm:text-[14px]
                md:text-[15px]
                xl:text-[16px]
              "
            >
              {formatPrice(product.compareAtPrice)}
            </span>
          )}

          <span
            className="
              text-[23px]
              font-extrabold
              leading-none
              text-[var(--featured-accent)]

              sm:text-[26px]
              md:text-[32px]
              xl:text-[40px]
            "
          >
            {formatPrice(product.price)}
          </span>
        </div>

        <p
          className="
            mb-5
            text-[14px]
            leading-[1.6]
            text-[var(--featured-text)]

            sm:mb-8
            sm:text-[16px]
            sm:leading-8

            md:text-[17px]
          "
        >
          {truncateDescription(product.description)}
        </p>
      </div>

      {/* Static CTA */}
      <Link
        href={href}
        onClick={(event) => {
          event.preventDefault();

          startNavigation();

          router.push(href);
        }}
        className="
          inline-flex
          h-[42px]
          items-center
          justify-center
          gap-2
          px-5
          text-[14px]
          font-bold

          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:brightness-110

          active:scale-[0.98]

          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#5B5EF7]/30

          sm:h-auto
          sm:px-7
          sm:py-3
          sm:text-[16px]
        "
        style={{
          borderRadius: FEATURED_BUTTON_RADIUS,
          background: "var(--featured-accent)",
          color: "#FFFFFF",
        }}
      >
        Buy Now

        <ArrowRight size={16} strokeWidth={2.2} />
      </Link>
    </div>
  );
}
