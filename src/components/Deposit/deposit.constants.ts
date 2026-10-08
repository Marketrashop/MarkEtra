export const DEPOSIT_SUGGESTED_AMOUNTS = [
  20,
  50,
  100,
  250,
  500,
] as const;

export const DEPOSIT_MIN_AMOUNT = 20;

export const DEPOSIT_SUPPORTED_RECEIPT_TYPES =
  [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ] as const;

export const DEPOSIT_RECEIPT_EXTENSIONS =
  [
    "PNG",
    "JPG",
    "JPEG",
    "PDF",
  ] as const;