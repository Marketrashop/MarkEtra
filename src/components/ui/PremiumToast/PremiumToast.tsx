"use client";

import {
  usePremiumToast,
} from "./PremiumToastContext";

import PremiumToastOverlay from "./PremiumToastOverlay";

export default function PremiumToast() {
  const {
    toast,
    hideToast,
  } = usePremiumToast();

  return (
    <PremiumToastOverlay
      toast={toast}
      onClose={hideToast}
    />
  );
}