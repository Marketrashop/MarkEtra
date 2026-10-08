import type {
  PremiumToastOptions,
  PremiumToastVariant,
} from "./premium-toast.types";

import {
  PREMIUM_TOAST_STORAGE_KEY,
} from "./premium-toast.constants";

export function getToastIconColor(
  variant: PremiumToastVariant,
) {
  switch (variant) {
    case "success":
      return "var(--premium-toast-success)";

    case "warning":
      return "var(--premium-toast-warning)";

    case "error":
      return "var(--premium-toast-error)";

    case "info":
    default:
      return "var(--premium-toast-info)";
  }
}

export function getToastProgressColor(
  variant: PremiumToastVariant,
) {
  switch (variant) {
    case "success":
      return "var(--premium-toast-success)";

    case "warning":
      return "var(--premium-toast-warning)";

    case "error":
      return "var(--premium-toast-error)";

    case "info":
    default:
      return "var(--premium-toast-info)";
  }
}

export function getToastGlow(
  variant: PremiumToastVariant,
) {
  switch (variant) {
    case "success":
      return `
        0 0 22px
        color-mix(
          in srgb,
          var(--premium-toast-success)
          28%,
          transparent
        )
      `;

    case "warning":
      return `
        0 0 22px
        color-mix(
          in srgb,
          var(--premium-toast-warning)
          28%,
          transparent
        )
      `;

    case "error":
      return `
        0 0 22px
        color-mix(
          in srgb,
          var(--premium-toast-error)
          28%,
          transparent
        )
      `;

    case "info":
    default:
      return `
        0 0 22px
        color-mix(
          in srgb,
          var(--premium-toast-info)
          28%,
          transparent
        )
      `;
  }
}

export function getToastTitle(
  title: string,
) {
  return title.trim();
}

export function getToastDescription(
  description?: string,
) {
  return description?.trim() ?? "";
}

export function savePendingToast(
  toast: PremiumToastOptions,
) {
  sessionStorage.setItem(
    PREMIUM_TOAST_STORAGE_KEY,
    JSON.stringify(toast),
  );
}

export function getPendingToast() {
  const raw =
    sessionStorage.getItem(
      PREMIUM_TOAST_STORAGE_KEY,
    );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(
      raw,
    ) as PremiumToastOptions;
  } catch {
    return null;
  }
}

export function clearPendingToast() {
  sessionStorage.removeItem(
    PREMIUM_TOAST_STORAGE_KEY,
  );
}