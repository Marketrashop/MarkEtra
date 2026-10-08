"use client";

import { useState } from "react";

import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ProductReviewForm from "./ProductReviewForm";

import type {
  ProductReview,
} from "@/lib/products/product.types";

type ProductTabsProps = {
  description: string;

  reviews: ProductReview[];
};

export default function ProductTabs({
  description,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] =
    useState<
      "reviews" | "description"
    >("reviews");

  const activeButtonClasses = `
    border
    border-[var(--services-cta-primary-bg)]
    bg-[var(--services-cta-primary-bg)]
    text-[var(--services-cta-primary-text)]
    shadow-sm
  `;

  const inactiveButtonClasses = `
    border
    border-[var(--border)]
    bg-[var(--surface)]
    text-[var(--foreground)]
    hover:border-[var(--primary)]
    hover:bg-[var(--surface-card)]
    hover:text-[var(--primary)]
  `;

  return (
    <section
      className="
        mt-6
        lg:mt-12
      "
    >
      <div
        className="
          flex
          flex-wrap
          gap-1.5
          border-b
          border-[var(--border)]
          pb-2
          lg:gap-2.5
          lg:pb-3
        "
      >
        {/* Reviews */}
        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "reviews",
            )
          }
          className={`
            rounded-md
            px-2.5
            py-1
            text-[12px]
            font-medium
            transition-all
            duration-300
            lg:rounded-lg
            lg:px-4
            lg:py-2
            lg:text-[14px]
            ${
              activeTab ===
              "reviews"
                ? activeButtonClasses
                : inactiveButtonClasses
            }
          `}
        >
          Reviews ({reviews.length})
        </button>

        {/* Description */}
        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "description",
            )
          }
          className={`
            rounded-md
            px-2.5
            py-1
            text-[12px]
            font-medium
            transition-all
            duration-300
            lg:rounded-lg
            lg:px-4
            lg:py-2
            lg:text-[14px]
            ${
              activeTab ===
              "description"
                ? activeButtonClasses
                : inactiveButtonClasses
            }
          `}
        >
          Description
        </button>
      </div>

      <div
        className="
          mt-3
          lg:mt-6
        "
      >
        {activeTab ===
        "reviews" ? (
          <>
            <ProductReviews
              reviews={reviews}
            />

            <ProductReviewForm />
          </>
        ) : (
          <ProductDescription
            description={
              description
            }
          />
        )}
      </div>
    </section>
  );
}