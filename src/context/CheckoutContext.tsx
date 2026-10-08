"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CheckoutMode =
  | "cart"
  | "direct";

export type DirectCheckoutItem = {
  productId: string;

  variantSizeId: string;

  quantity: number;

  productName: string;

  unitPrice: number;

  variantLabel: string | null;

  size: string | null;

  imageKey: string | null;

  imageUrl: string | null;

  includeCart: boolean;
};

type CheckoutContextValue = {
  mode: CheckoutMode;

  directItem: DirectCheckoutItem | null;

  startDirectCheckout: (
    item: DirectCheckoutItem,
  ) => void;

  startCartCheckout: () => void;

  clearCheckout: () => void;
};

const CheckoutContext =
  createContext<
    CheckoutContextValue | undefined
  >(undefined);

type CheckoutProviderProps = {
  children: ReactNode;
};

const CHECKOUT_STORAGE_KEY =
  "marketra_checkout";

export function CheckoutProvider({
  children,
}: CheckoutProviderProps) {
const [
  mode,
  setMode,
] =
  useState<CheckoutMode>(
    "cart",
  );

const [
  directItem,
  setDirectItem,
] =
  useState<DirectCheckoutItem | null>(
    null,
  );

useEffect(() => {
  const saved =
    localStorage.getItem(
      CHECKOUT_STORAGE_KEY,
    );

  if (!saved) {
    return;
  }

  try {
    const parsed =
      JSON.parse(saved) as {
        mode: CheckoutMode;
        directItem: DirectCheckoutItem | null;
      };

    setMode(parsed.mode);
    setDirectItem(parsed.directItem);
  } catch {
    localStorage.removeItem(
      CHECKOUT_STORAGE_KEY,
    );
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    CHECKOUT_STORAGE_KEY,
    JSON.stringify({
      mode,
      directItem,
    }),
  );
}, [
  mode,
  directItem,
]);

  function startDirectCheckout(
    item: DirectCheckoutItem,
  ) {
    setMode(
      "direct",
    );

    setDirectItem(
      item,
    );
  }

  function startCartCheckout() {
    setMode(
      "cart",
    );

    setDirectItem(
      null,
    );
  }

function clearCheckout() {
  localStorage.removeItem(
    CHECKOUT_STORAGE_KEY,
  );

  setMode("cart");

  setDirectItem(null);
}

  const value =
    useMemo(
      () => ({
        mode,

        directItem,

        startDirectCheckout,

        startCartCheckout,

        clearCheckout,
      }),
      [
        mode,
        directItem,
      ],
    );

  return (
    <CheckoutContext.Provider
      value={value}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context =
    useContext(
      CheckoutContext,
    );

  if (!context) {
    throw new Error(
      "useCheckout must be used within a CheckoutProvider.",
    );
  }

  return context;
}