"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  Product,
} from "@/types/product.types";

type UseProductResult = {
  product: Product | null;

  loading: boolean;

  error: string | null;

  refetch: () => Promise<void>;
};

export function useProduct(
  productId?: string,
  slug?: string
): UseProductResult {
  const [product, setProduct] =
    useState<Product | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  async function fetchProduct() {
    if (
      !productId &&
      !slug
    ) {
      setProduct(null);

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError(null);

      const endpoint =
        productId
          ? `/api/products/${productId}`
          : `/api/products/slug/${slug}`;

      const response =
        await fetch(endpoint, {
          cache: "no-store",
        });

      if (!response.ok) {
        throw new Error(
          "Failed to load product."
        );
      }

      const json =
        await response.json();

      setProduct(
        json.data ?? null
      );
    } catch (error) {
      setProduct(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProduct();
  }, [
    productId,
    slug,
  ]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}