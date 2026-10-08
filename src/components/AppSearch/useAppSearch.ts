"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ProductCard,
} from "@/lib/products";

import {
  APP_SEARCH_DEBOUNCE,
} from "./app-search.constants";

export function useAppSearch() {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    results,
    setResults,
  ] = useState<ProductCard[]>(
    [],
  );

  function clearSearch() {
    setQuery("");

    setResults([]);

    setLoading(false);
  }

  useEffect(() => {
    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      setResults([]);

      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            const response =
              await fetch(
                `/api/search?q=${encodeURIComponent(
                  trimmedQuery,
                )}`,
                {
                  signal:
                    controller.signal,
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Failed to search products.",
              );
            }

            const data: ProductCard[] =
              await response.json();

            setResults(
              data,
            );
          } catch (
            error
          ) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              error,
            );

            setResults(
              [],
            );
          } finally {
            setLoading(
              false,
            );
          }
        },
        APP_SEARCH_DEBOUNCE,
      );

    return () => {
      controller.abort();

      clearTimeout(
        timer,
      );
    };
  }, [query]);

  return {
    query,
    setQuery,
    loading,
    results,
    clearSearch,
  };
}