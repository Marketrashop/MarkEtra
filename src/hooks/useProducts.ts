"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  Product,
  ProductFilters,
} from "@/types/product.types";

type UseProductsOptions = {
  filters?: ProductFilters;
};

type UseProductsResult = {
  products: Product[];

  loading: boolean;

  error: string | null;

  refetch: () => Promise<void>;
};

export function useProducts({
  filters,
}: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function fetchProducts() {
    try {
      setLoading(true);

      setError(null);

      const params =
        new URLSearchParams();

      if (filters?.search) {
        params.set(
          "search",
          filters.search
        );
      }

      if (
        filters?.categoryId
      ) {
        params.set(
          "categoryId",
          filters.categoryId
        );
      }

      if (
        filters?.featured !==
        undefined
      ) {
        params.set(
          "featured",
          String(
            filters.featured
          )
        );
      }

      if (filters?.status) {
        params.set(
          "status",
          filters.status
        );
      }

      const response =
        await fetch(
          `/api/products?${
            params.toString()
          }`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load products."
        );
      }

      const json =
        await response.json();

      setProducts(
        json.data ?? []
      );
    } catch (error) {
      setProducts([]);

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
    void fetchProducts();
  }, [
    filters?.search,
    filters?.categoryId,
    filters?.featured,
    filters?.status,
  ]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}