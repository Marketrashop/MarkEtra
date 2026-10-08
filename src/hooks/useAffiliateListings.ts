"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  AffiliateEarningsResponse,
  AffiliateListing,
} from "@/types/affiliate.types";

export function useAffiliateListings() {
  const [
    listings,
    setListings,
  ] = useState<
    AffiliateListing[]
  >([]);

  const [
    overview,
    setOverview,
  ] = useState<
    AffiliateEarningsResponse["overview"] | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/affiliate/earnings",
            {
              cache: "no-store",
            },
          );

        const data =
          (await response.json()) as
            | AffiliateEarningsResponse
            | {
                error?: string;
              };

        if (!response.ok) {
          throw new Error(
            "error" in data &&
              data.error
              ? data.error
              : "Unable to load affiliate data.",
          );
        }

        if (
          cancelled
        ) {
          return;
        }

        const result =
          data as AffiliateEarningsResponse;

        setListings(
          result.listings,
        );

        setOverview(
          result.overview,
        );
      } catch (error) {
        if (
          cancelled
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    listings,
    overview,
    loading,
    error,
  };
}