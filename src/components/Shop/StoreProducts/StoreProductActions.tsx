"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  ShoppingCart,
  HandCoins,
  Heart,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { useCartContext } from "@/context/CartContext";

import { useAuth } from "@/context/AuthContext";

import { useWishlist } from "@/context/WishlistContext";

import type {
  AppEnvironment,
} from "@/types/environment";

import {
  useAffiliateAction,
} from "@/hooks/useAffiliateAction";

import type {
  ProductCard,
  ProductVariant,
} from "@/lib/products/product.types";

import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

import { useRouter } from "next/navigation";

type StoreProductActionsProps = {
  product: ProductCard;
  environment?: AppEnvironment;
  variant?: "default" | "compact";
};

type ProductInventoryResponse = {
  success: boolean;

  data?: {
    variants: ProductVariant[];
  };

  error?: string;
};

const actions = [
  {
    key: "cart" as const,

    icon: ShoppingCart,

    label: "Add to Cart",
  },

  {
    key: "affiliate" as const,

    icon: HandCoins,
  },

  {
    key: "wishlist" as const,

    icon: Heart,

    label: "Wishlist",
  },
];

function isAvailable(
  inventory: ProductVariant["sizes"][number],
) {
  return (
    inventory.stock -
      inventory.reservedStock >
      0 ||
    inventory.allowPreorder
  );
}

function getDefaultInventory(
  variants: ProductVariant[],
) {
  const selectableVariants =
    variants.filter(
      (variant) =>
        Boolean(
          variant.label?.trim(),
        ) ||
        variant.type === "DEFAULT",
    );

  const firstValidVariant =
    selectableVariants.find(
      (variant) =>
        variant.sizes.some(
          isAvailable,
        ),
    ) ??
    selectableVariants[0] ??
    null;

  if (!firstValidVariant) {
    return null;
  }

  const inventory =
    firstValidVariant.sizes.find(
      isAvailable,
    ) ??
    firstValidVariant.sizes[0] ??
    null;

  if (!inventory) {
    return null;
  }

  return {
    variant:
      firstValidVariant,

    inventory,
  };
}

export default function StoreProductActions({
  product,
  environment = "public",
  variant = "default",
}: StoreProductActionsProps) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(
    null,
  );

  const [
    loadingAction,
    setLoadingAction,
  ] = useState<
    "cart" | "wishlist" | "affiliate" | null
  >(null);

  const router = useRouter();

  const {
    addToCart,
    openCart,
  } = useCartContext();

  const {
    user,
    loading: authLoading,
  } = useAuth();

const {
  addToWishlist,
} = useWishlist();

  const {
    execute:
      executeAffiliate,
    loading:
      affiliateLoading,
    hasActiveSubscription,
  } = useAffiliateAction();

  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

  const affiliateLabel =
    user &&
    hasActiveSubscription
      ? "Submit for Review"
      : "Become Affiliate";

  async function handleCart(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();

    event.stopPropagation();

    if (loadingAction) {
      return;
    }

    try {
      setLoadingAction("cart");

      const response =
        await fetch(
          `/api/products/${encodeURIComponent(
            product.id,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

      const result =
        (await response.json()) as ProductInventoryResponse;

if (
  !response.ok ||
  !result.success ||
  !result.data
) {
  throw new Error(
    result.error ??
      "Unable to load product options.",
  );
}

const variants = result.data.variants.filter(
  (variant) =>
    variant.sizes.length > 0,
);

const hasRealVariants =
  variants.length > 1 ||
  variants.some(
    (variant) =>
      variant.type !== "DEFAULT",
  );

if (hasRealVariants) {
  toast.info(
    "This product has variants. Please select your preferred option before adding it to your cart.",
  );

router.push(
  environment === "user"
    ? `/Market-Place/${product.slug}`
    : `/Product/${product.slug}`,
);

  return;
}

const selection =
  getDefaultInventory(variants);

if (!selection) {
  toast.error(
    "This product is currently unavailable.",
  );

  return;
}

await addToCart({
  productId: product.id,
  variantSizeId:
    selection.inventory.id,
  quantity: 1,
});

toast.success(
  "Product added to cart.",
);

openCart();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add product to cart.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();

    event.stopPropagation();

    if (
      loadingAction ||
      authLoading
    ) {
      return;
    }

    if (!user) {
      toast.info(
        "Sign in to save this product to your wishlist.",
      );

      router.push(
        `/Auth?redirect=/wishlist&wishlistProduct=${encodeURIComponent(
          product.id,
        )}`,
      );

      return;
    }

    try {
      setLoadingAction(
        "wishlist",
      );

      const response =
        await fetch(
          `/api/products/${encodeURIComponent(
            product.id,
          )}`,
          {
            method: "GET",

            cache: "no-store",
          },
        );

      const result =
        (await response.json()) as ProductInventoryResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.error ??
            "Unable to load product options.",
        );
      }

const variants =
  result.data.variants.filter(
    (variant) =>
      variant.sizes.length > 0,
  );

const hasRealVariants =
  variants.length > 1 ||
  variants.some(
    (variant) =>
      variant.type !== "DEFAULT",
  );

if (hasRealVariants) {
  toast.info(
    "This product has variants. Please select your preferred option before adding it to your wishlist.",
  );

router.push(
  environment === "user"
    ? `/Market-Place/${product.slug}`
    : `/Product/${product.slug}`,
);

  return;
}

const selection =
  getDefaultInventory(
    variants,
  );

if (!selection) {
  toast.error(
    "This product is currently unavailable.",
  );

  return;
}

await addToWishlist(
  product.id,
  selection.inventory.id,
);

      toast.success(
        "Product saved to wishlist.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update wishlist.",
      );
    } finally {
      setLoadingAction(
        null,
      );
    }
  }

  async function handleAffiliate(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();

    event.stopPropagation();

    if (
      loadingAction ||
      affiliateLoading
    ) {
      return;
    }

    try {
      setLoadingAction(
        "affiliate",
      );

      await executeAffiliate(
        product.id,
      );
    } finally {
      setLoadingAction(
        null,
      );
    }
  }

  return (
    <motion.div
      variants={{
        rest: {
          opacity: 0,
          x: 20,
        },

        hover: {
          opacity: 1,
          x: 0,
        },
      }}
      className="
        absolute
        top-1/2
        z-20
        -translate-y-1/2
      "
      style={{
        right:
          styles.actions.right,
      }}
    >
      <div
        className="
          relative
          flex
          items-center
        "
      >
        <div
          className="
            overflow-visible
            border
            border-[0.8px]
            border-[#5658EC]
            bg-transparent
          "
        >
          {actions.map(
            (
              action,
              index,
            ) => {
              const Icon =
                action.icon;

              const label =
                action.key ===
                "affiliate"
                  ? affiliateLabel
                  : action.label;

              const isLoading =
                action.key ===
                  "cart"
                  ? loadingAction ===
                    "cart"
                  : action.key ===
                      "wishlist"
                    ? loadingAction ===
                      "wishlist"
                    : loadingAction ===
                        "affiliate" ||
                      affiliateLoading;

              return (
                <div
                  key={
                    action.key
                  }
                  className="
                    relative
                    flex
                    items-center
                    justify-end
                  "
                >
                  <motion.div
                    initial={false}
                    animate={{
                      opacity:
                        activeIndex ===
                        index
                          ? 1
                          : 0,

                      x:
                        activeIndex ===
                        index
                          ? 0
                          : 12,

                      width:
                        activeIndex ===
                        index
                          ? "auto"
                          : 0,
                    }}
                    transition={{
                      duration: 0.32,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      pointer-events-none
                      absolute
                      right-full
                      mr-2
                      overflow-hidden
                      whitespace-nowrap
                    "
                  >
                    <div
                      className="
                        flex
                        h-[30px]
                        items-center
                        rounded-[8px]
                        px-3
                        text-[12px]
                        font-semibold
                        text-white
                        shadow-lg
                      "
                      style={{
                        background:
                          "#5658EC",
                      }}
                    >
                      {label}
                    </div>
                  </motion.div>

                  <motion.button
                    type="button"
                    aria-label={
                      label
                    }
                    onMouseEnter={() =>
                      setActiveIndex(
                        index,
                      )
                    }
                    onMouseLeave={() =>
                      setActiveIndex(
                        null,
                      )
                    }
                    onClick={
                      action.key ===
                      "cart"
                        ? handleCart
                        : action.key ===
                            "wishlist"
                          ? handleWishlist
                          : handleAffiliate
                    }
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    animate={{
                      backgroundColor:
                        activeIndex ===
                        index
                          ? "#5658EC"
                          : "transparent",

                      color:
                        activeIndex ===
                        index
                          ? "#ffffff"
                          : "#000000",
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                    disabled={
                      isLoading
                    }
                    className={`
                      flex
                      items-center
                      justify-center
                      border-[0.8px]
                      border-[#7C7EF2]

                      disabled:cursor-not-allowed

                      disabled:opacity-70

                      ${
                        index !==
                        actions.length -
                          1
                          ? "border-b-0"
                          : ""
                      }
                    `}
                    style={{
                      width:
                        styles.actions.buttonSize,

                      height:
                        styles.actions.buttonSize,

                      marginTop:
                        index ===
                        0
                          ? "-0.8px"
                          : 0,
                    }}
                  >
                    {isLoading ? (
                      <Loader2
                        size={
                          styles
                            .actions
                            .iconSize
                        }
                        className="animate-spin"
                      />
                    ) : (
                      <Icon
                        size={
                          styles
                            .actions
                            .iconSize
                        }
                        strokeWidth={
                          2.7
                        }
                      />
                    )}
                  </motion.button>
                </div>
              );
            },
          )}
        </div>
      </div>
    </motion.div>
  );
}