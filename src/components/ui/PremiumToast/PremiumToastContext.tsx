"use client";

import {
  createContext,
  useContext,
} from "react";

import type {
  PremiumToastContextValue,
} from "./premium-toast.types";

const PremiumToastContext =
  createContext<
    PremiumToastContextValue | undefined
  >(undefined);

export function usePremiumToast() {
  const context =
    useContext(
      PremiumToastContext,
    );

  if (!context) {
    throw new Error(
      "usePremiumToast must be used within PremiumToastProvider.",
    );
  }

  return context;
}

export default PremiumToastContext;