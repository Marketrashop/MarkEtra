"use client";

import {
  useState,
} from "react";

import ProductGallery from "./ProductGallery";

import ProductInfo from "./ProductInfo";

import type {
  ProductDetails,
} from "@/lib/products/product.types";

import type {
  ProductVariantSelection,
} from "./ProductVariantPicker";

type ProductPurchaseSectionProps = {
  product: ProductDetails;
};

function getInitialSelection(
  product: ProductDetails,
): ProductVariantSelection | null {
  const selectableVariants =
    product.variants.filter(
      (variant) =>
        Boolean(
          variant.label?.trim(),
        ) ||
        variant.type === "DEFAULT",
    );

  const firstValidVariant =
    selectableVariants.find(
      (variant) =>
        variant.sizes.some(
          (inventory) =>
            inventory.stock -
              inventory.reservedStock >
              0 ||
            inventory.allowPreorder,
        ),
    ) ??
    selectableVariants[0] ??
    null;

  if (!firstValidVariant) {
    return null;
  }

  const inventory =
    firstValidVariant.sizes.find(
      (item) =>
        item.stock -
          item.reservedStock >
          0 ||
        item.allowPreorder,
    ) ??
    firstValidVariant.sizes[0] ??
    null;

  if (!inventory) {
    return null;
  }

  return {
    variant:
      firstValidVariant,

    inventory,
  };
}

export default function ProductPurchaseSection({
  product,
}: ProductPurchaseSectionProps) {
  const [
    selectedSelection,
    setSelectedSelection,
  ] =
    useState<ProductVariantSelection | null>(
      () =>
        getInitialSelection(
          product,
        ),
    );

  const selectedVariant =
    selectedSelection?.variant ??
    null;

  const selectedVariantSizeId =
    selectedSelection?.inventory.id ??
    null;

  function handleVariantChange(
    selection:
      | ProductVariantSelection
      | null,
  ) {
    setSelectedSelection(
      selection,
    );
  }

  return (
    <div
      className="
        mx-auto
        grid
        w-full
        max-w-7xl
        gap-8
        px-5
        lg:grid-cols-[1fr_0.9fr]
        lg:items-start
        lg:gap-10
        lg:px-8
      "
    >
      <ProductGallery
        productId={
          product.id
        }

        images={
          product.images
        }

        productName={
          product.name
        }

        selectedVariantSizeId={
          selectedVariantSizeId
        }

        selectedVariantImages={
          selectedVariant?.images ??
          null
        }
      />

<ProductInfo
  productId={
    product.id
  }

  productImageKey={
    product.images.find(
      image => image.isPrimary,
    )?.imageKey ??
    product.images[0]?.imageKey ??
    null
  }

  productImageUrl={
    product.images.find(
      image => image.isPrimary,
    )?.imageUrl ??
    product.images[0]?.imageUrl ??
    null
  }

  name={
    product.name
  }

        description={
          product.description
        }

        rating={
          product.averageRating
        }

        reviewCount={
          product.totalRatings
        }

        price={
          product.price
        }

        oldPrice={
          product.compareAtPrice
        }

        variants={
          product.variants
        }

        onVariantChange={
          handleVariantChange
        }

        shippingMethod="Free Worldwide Shipping"

        estimatedDelivery="5 to 8 Business Days"

        returnPolicy="30 Days Money Back Guarantee"

        productUrl={`https://marketra.shop/Product/${product.slug}`}
      />
    </div>
  );
}