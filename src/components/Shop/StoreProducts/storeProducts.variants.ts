import type {
  StoreProductVariant,
} from "./storeProducts.types";

export type StoreProductVariantStyles = {
  imageAspectRatio: string;

  mobileImageAspectRatio: string;

  imageSizes: string;

  contentPadding: string;

  title: string;

  titleMarginTop: string;

  ratingMarginTop: string;

  price: string;

  oldPrice: string;

  review: string;

  badge: {
    minWidth: number;

    height: number;

    fontSize: number;

    top: number;

    right: number;
  };

  actions: {
    buttonSize: number;

    iconSize: number;

    right: number;
  };
};

export const STORE_PRODUCT_VARIANTS: Record<
  StoreProductVariant,
  StoreProductVariantStyles
> = {
  default: {
    imageAspectRatio: "11 / 14",

    mobileImageAspectRatio: "11 / 11",

    imageSizes:
      "(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw",

    contentPadding:
      "px-3 py-2 sm:px-4 lg:px-4",

    title:
      "text-[14px] sm:text-[15px] lg:text-[16px] font-semibold",

    titleMarginTop: "mt-0.5",

    ratingMarginTop: "mt-2 sm:mt-3",

    price:
      "text-[15px] sm:text-[16px]",

    oldPrice:
      "text-[12px] sm:text-[13px]",

    review:
      "text-[12px] sm:text-[13px]",

    badge: {
      minWidth: 36,

      height: 24,

      fontSize: 11,

      top: 14,

      right: 14,
    },

    actions: {
      buttonSize: 38,

      iconSize: 18,

      right: 14,
    },
  },

  compact: {
    imageAspectRatio: "4 / 5",

    mobileImageAspectRatio: "4 / 5",

    imageSizes:
      "(max-width:768px) 48vw, (max-width:1200px) 28vw, 18vw",

    contentPadding:
      "px-3 py-2",

    title:
      "text-[11px] lg:text-[12px] font-semibold leading-[1.3]",

    titleMarginTop: "mt-0.5",

    ratingMarginTop: "mt-0",

    price: "text-[12px]",

    oldPrice: "text-[10px]",

    review: "text-[10px]",

    badge: {
      minWidth: 30,

      height: 20,

      fontSize: 10,

      top: 10,

      right: 10,
    },

    actions: {
      buttonSize: 32,

      iconSize: 16,

      right: 10,
    },
  },
};