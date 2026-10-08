"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  addToWishlist as addRequest,
  getWishlist,
  removeFromWishlist as removeRequest,
} from "@/components/Wishlist/wishlist.service";

import type {
  Wishlist,
} from "@/types/wishlist.types";

type WishlistContextValue = {
  wishlist: Wishlist | null;
  itemCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  isInWishlist: (
    productId: string,
    variantSizeId?: string | null,
  ) => boolean;
  addToWishlist: (
    productId: string,
    variantSizeId?: string,
  ) => Promise<void>;
  removeFromWishlist: (
    productId: string,
    variantSizeId?: string,
  ) => Promise<void>;
};

const WishlistContext =
  createContext<
    WishlistContextValue | undefined
  >(undefined);

type WishlistProviderProps = {
  children: ReactNode;
};

export function WishlistProvider({
  children,
}: WishlistProviderProps) {
  const [
    wishlist,
    setWishlist,
  ] = useState<Wishlist | null>(
    null,
  );

  const [
    itemCount,
    setItemCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const refresh =
    useCallback(async () => {
      try {
        setLoading(true);

        const result =
          await getWishlist();

        setWishlist(
          result.wishlist,
        );

        setItemCount(
          result.summary.itemCount,
        );
      } catch {
        setWishlist(null);
        setItemCount(0);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isInWishlist =
    useCallback(
      (
        productId: string,
        variantSizeId?: string | null,
      ) => {
        if (!wishlist) {
          return false;
        }

        return wishlist.items.some(
          (item) =>
            item.productId ===
              productId &&
            (variantSizeId == null
              ? true
              : item.variantSizeId ===
                variantSizeId),
        );
      },
      [wishlist],
    );

  const addToWishlist =
    useCallback(
      async (
        productId: string,
        variantSizeId?: string,
      ) => {
        await addRequest({
          productId,
          variantSizeId,
        });

        await refresh();
      },
      [refresh],
    );

  const removeFromWishlist =
    useCallback(
      async (
        productId: string,
        variantSizeId?: string,
      ) => {
        await removeRequest(
          productId,
          variantSizeId,
        );

        await refresh();
      },
      [refresh],
    );

  const value = useMemo(
    () => ({
      wishlist,
      itemCount,
      loading,
      refresh,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
    }),
    [
      wishlist,
      itemCount,
      loading,
      refresh,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
    ],
  );

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(
      WishlistContext,
    );

  if (!context) {
    throw new Error(
      "useWishlist must be used within a WishlistProvider.",
    );
  }

  return context;
}