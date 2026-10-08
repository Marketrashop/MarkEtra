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

import type {
  Cart,
  CartItem,
  CartSummary,
  AddToCartInput,
} from "@/components/Cart/cart.types";

import { useAuth } from "@/context/AuthContext";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

const GUEST_CART_STORAGE_KEY =
  "marketra_guest_cart";

type GuestCartItem =
  AddToCartInput;

type CartContextValue = {
  cartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;

  cart: Cart | null;

  loading: boolean;

  error: string | null;

  refresh: () => Promise<void>;

  addToCart: (
    input: AddToCartInput,
  ) => Promise<void>;

  updateQuantity: (
    itemId: string,
    quantity: number,
  ) => Promise<void>;

  removeFromCart: (
    itemId: string,
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  saveForLater: (
    itemId: string,
  ) => Promise<void>;

  moveToCart: (
    itemId: string,
  ) => Promise<void>;

  mergeGuestCart: (
    items: AddToCartInput[],
  ) => Promise<void>;

  itemCount: number;
};

const CartContext =
  createContext<CartContextValue | null>(
    null,
  );

type CartProviderProps = {
  children: ReactNode;
};

type ApiProduct = {
  id: string;

  name: string;

  slug: string;

  description: string;

  price:
    | number
    | string;

  compareAtPrice:
    | number
    | string
    | null;

  averageRating:
    | number
    | string;

  totalRatings: number;

  featured: boolean;

  status: string;

  createdAt: string;

  publishedAt:
    | string
    | null;

categories: {
  category: {
    id: string;

    name: string;

    slug: string;
  };
}[];

  images: {
    id: string;

    imageKey: string;

    altText:
      | string
      | null;

    isPrimary: boolean;

    sortOrder: number;
  }[];

  variants: {
    id: string;

    type:
      | "DEFAULT"
      | "COLOR"
      | "STORAGE"
      | "MATERIAL"
      | "PACK_SIZE"
      | "STYLE"
      | "OTHER";

    label:
      | string
      | null;

    images: {
      id: string;

      imageKey: string;

      altText:
        | string
        | null;

      isPrimary: boolean;

      sortOrder: number;
    }[];

    sizes: {
      id: string;

      size:
        | string
        | null;

      sku:
        | string
        | null;

      price:
        | number
        | string
        | null;

      stock: number;

      reservedStock: number;

      incomingStock: number;

      allowPreorder: boolean;
    }[];
  }[];
};

function getGuestCart(): GuestCartItem[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        GUEST_CART_STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(
        stored,
      );

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return [];
    }

    return parsed.filter(
      (
        item,
      ): item is GuestCartItem =>
        typeof item?.productId ===
          "string" &&
        typeof item?.variantSizeId ===
          "string" &&
        typeof item?.quantity ===
          "number" &&
        Number.isInteger(
          item.quantity,
        ) &&
        item.quantity >
          0,
    );
  } catch {
    return [];
  }
}

function setGuestCart(
  items: GuestCartItem[],
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify(items),
  );
}

function clearStoredGuestCart() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.removeItem(
    GUEST_CART_STORAGE_KEY,
  );
}

function getGuestItemId(
  item: GuestCartItem,
) {
  return `guest:${item.productId}:${item.variantSizeId}`;
}

function toProductCard(
  product: ApiProduct,
): ProductCard {
const primaryCategory =
  product.categories[0]
    ?.category ?? null;
  return {
    id:
      product.id,

    slug:
      product.slug,

    name:
      product.name,

    description:
      product.description,

    price:
      Number(
        product.price,
      ),

    compareAtPrice:
      product.compareAtPrice ===
      null
        ? null
        : Number(
            product.compareAtPrice,
          ),

    averageRating:
      Number(
        product.averageRating,
      ),

    totalRatings:
      product.totalRatings,

    featured:
      product.featured,

    status:
      product.status,

    createdAt:
      new Date(
        product.createdAt,
      ),

    publishedAt:
      product.publishedAt
        ? new Date(
            product.publishedAt,
          )
        : null,

categories: primaryCategory
  ? [
      {
        category: {
          id:
            primaryCategory.id,

          name:
            primaryCategory.name,

          slug:
            primaryCategory.slug,
        },
      },
    ]
  : [],

    images:
      product.images.map(
        (
          image,
        ) => ({
          id:
            image.id,

          imageKey:
            image.imageKey,

          imageUrl:
            getCloudinaryImageUrl(
              image.imageKey,
            ),

          altText:
            image.altText,

          isPrimary:
            image.isPrimary,

          sortOrder:
            image.sortOrder,
        }),
      ),
  };
}

function toCartVariantSize(
  variant:
    ApiProduct["variants"][number],
  size:
    ApiProduct["variants"][number]["sizes"][number],
) {
  const primaryVariantImage =
    variant.images.find(
      (image) =>
        image.isPrimary,
    ) ??
    variant.images[0] ??
    null;

  return {
    id:
      size.id,

    size:
      size.size,

    sku:
      size.sku,

    price:
      size.price ===
      null
        ? null
        : Number(
            size.price,
          ),

    stock:
      size.stock,

    reservedStock:
      size.reservedStock,

    incomingStock:
      size.incomingStock,

    allowPreorder:
      size.allowPreorder,

    variant: {
      id:
        variant.id,

      type:
        variant.type,

      label:
        variant.label,

      imageKey:
        primaryVariantImage?.imageKey ??
        null,

      imageUrl:
        primaryVariantImage
          ? getCloudinaryImageUrl(
              primaryVariantImage.imageKey,
            )
          : null,
    },
  };
}

async function fetchProduct(
  productId: string,
): Promise<ApiProduct> {
  const response =
    await fetch(
      `/api/products/${encodeURIComponent(
        productId,
      )}`,
      {
        cache:
          "no-store",
      },
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ??
        "Failed to load product.",
    );
  }

  return result.data as ApiProduct;
}

async function hydrateGuestCart(
  items: GuestCartItem[],
): Promise<Cart | null> {
  if (
    items.length ===
    0
  ) {
    return {
      id:
        "guest-cart",

      userId:
        "guest",

      items: [],

      savedItems: [],

      summary: {
        itemCount:
          0,

        savedCount:
          0,

        subtotal:
          0,

        savings:
          0,

        total:
          0,
      },

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    };
  }

  const hydratedItems:
    CartItem[] = [];

  for (
    const item of
    items
  ) {
    try {
      const product =
        await fetchProduct(
          item.productId,
        );

      if (
        product.status !==
        "ACTIVE"
      ) {
        continue;
      }

      let selectedVariant:
        | ApiProduct["variants"][number]
        | null =
        null;

      let selectedSize:
        | ApiProduct["variants"][number]["sizes"][number]
        | null =
        null;

      for (
        const variant of
        product.variants
      ) {
        const matchingSize =
          variant.sizes.find(
            (
              size,
            ) =>
              size.id ===
              item.variantSizeId,
          );

        if (
          matchingSize
        ) {
          selectedVariant =
            variant;

          selectedSize =
            matchingSize;

          break;
        }
      }

      if (
        !selectedVariant ||
        !selectedSize
      ) {
        continue;
      }

      const productCard =
        toProductCard(
          product,
        );

      hydratedItems.push({
        id:
          getGuestItemId(
            item,
          ),

        productId:
          product.id,

        variantSizeId:
          selectedSize.id,

        quantity:
          item.quantity ??
          1,

        status:
          "CART",

        product:
          productCard,

        variantSize:
          toCartVariantSize(
            selectedVariant,
            selectedSize,
          ),

        createdAt:
          new Date(),

        updatedAt:
          new Date(),
      });
    } catch {
      continue;
    }
  }

  let subtotal =
    0;

  let savings =
    0;

  for (
    const item of
    hydratedItems
  ) {
    const itemPrice =
      item.variantSize
        .price ??
      item.product
        .price;

    subtotal +=
      itemPrice *
      item.quantity;

    if (
      item.product
        .compareAtPrice !==
        null &&
      item.product
        .compareAtPrice >
        itemPrice
    ) {
      savings +=
        (
          item.product
            .compareAtPrice -
          itemPrice
        ) *
        item.quantity;
    }
  }

  const itemCount =
    hydratedItems.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    );

  const summary:
    CartSummary = {
    itemCount,

    savedCount:
      0,

    subtotal,

    savings,

    total:
      subtotal,
  };

  return {
    id:
      "guest-cart",

    userId:
      "guest",

    items:
      hydratedItems,

    savedItems:
      [],

    summary,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
}

function getCartItemPrice(
  item: CartItem,
) {
  return (
    item.variantSize
      .price ??
    item.product.price
  );
}

function calculateCartSummary(
  items: CartItem[],
  savedItems: CartItem[],
): CartSummary {
  let subtotal =
    0;

  let savings =
    0;

  for (
    const item of
    items
  ) {
    const price =
      getCartItemPrice(
        item,
      );

    subtotal +=
      price *
      item.quantity;

    if (
      item.product
        .compareAtPrice !==
        null &&
      item.product
        .compareAtPrice >
        price
    ) {
      savings +=
        (
          item.product
            .compareAtPrice -
          price
        ) *
        item.quantity;
    }
  }

  const itemCount =
    items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    );

  return {
    itemCount,

    savedCount:
      savedItems.length,

    subtotal,

    savings,

    total:
      subtotal,
  };
}

function buildOptimisticCart(
  cart: Cart,
  items: CartItem[],
  savedItems: CartItem[],
): Cart {
  return {
    ...cart,

    items,

    savedItems,

    summary:
      calculateCartSummary(
        items,
        savedItems,
      ),

    updatedAt:
      new Date(),
  };
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const {
    user,
    loading:
      authLoading,
  } = useAuth();

  const [
    cart,
    setCart,
  ] = useState<Cart | null>(
    null,
  );

  const [
    cartOpen,
    setCartOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const openCart =
    useCallback(
      () => {
        setCartOpen(
          true,
        );
      },
      [],
    );

  const closeCart =
    useCallback(
      () => {
        setCartOpen(
          false,
        );
      },
      [],
    );

  const request =
    useCallback(
      async (
        input: RequestInfo,
        init?: RequestInit,
      ) => {
        const response =
          await fetch(
            input,
            init,
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              data.error ??
              "Something went wrong.",
          );
        }

        setCart(
          data,
        );

        return data as Cart;
      },
      [],
    );

  const refresh =
    useCallback(
      async () => {
        if (
          authLoading
        ) {
          return;
        }

        try {
          setLoading(
            true,
          );

          setError(
            null,
          );

          if (user) {
            await request(
              "/api/cart",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

            return;
          }

          const guestItems =
            getGuestCart();

          const guestCart =
            await hydrateGuestCart(
              guestItems,
            );

          setCart(
            guestCart,
          );
        } catch (
          error
        ) {
          setCart(
            null,
          );

          setError(
            error instanceof
              Error
              ? error.message
              : "Failed to load cart.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        authLoading,
        user,
        request,
      ],
    );

  const addToCart =
    useCallback(
      async (
        input:
          AddToCartInput,
      ) => {
        if (
          authLoading
        ) {
          throw new Error(
            "Authentication is still loading.",
          );
        }

        if (user) {
          await request(
            "/api/cart",
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  input,
                ),
            },
          );

          return;
        }

        const guestItems =
          getGuestCart();

        const existingIndex =
          guestItems.findIndex(
            (
              item,
            ) =>
              item.productId ===
                input.productId &&
              item.variantSizeId ===
                input.variantSizeId,
          );

        const quantity =
          input.quantity ??
          1;

        if (
          existingIndex >=
          0
        ) {
          const existingItem =
            guestItems[
              existingIndex
            ];

          if (
            !existingItem
          ) {
            throw new Error(
              "Guest cart item could not be resolved.",
            );
          }

          guestItems[
            existingIndex
          ] = {
            ...existingItem,

            quantity:
              (
                existingItem.quantity ??
                1
              ) +
              quantity,
          };
        } else {
          guestItems.push({
            productId:
              input.productId,

            variantSizeId:
              input.variantSizeId,

            quantity,
          });
        }

        setGuestCart(
          guestItems,
        );

        const guestCart =
          await hydrateGuestCart(
            guestItems,
          );

        setCart(
          guestCart,
        );
      },
      [
        authLoading,
        user,
        request,
      ],
    );

  const updateQuantity =
    useCallback(
      async (
        itemId: string,
        quantity: number,
      ) => {
        if (
          quantity < 1
        ) {
          throw new Error(
            "Quantity must be at least 1.",
          );
        }

        if (!user) {
          const guestItems =
            getGuestCart();

          const index =
            guestItems.findIndex(
              (
                item,
              ) =>
                getGuestItemId(
                  item,
                ) ===
                itemId,
            );

          if (
            index ===
            -1
          ) {
            throw new Error(
              "Guest cart item not found.",
            );
          }

          guestItems[
            index
          ] = {
            ...guestItems[
              index
            ]!,
            quantity,
          };

          setGuestCart(
            guestItems,
          );

          const guestCart =
            await hydrateGuestCart(
              guestItems,
            );

          setCart(
            guestCart,
          );

          return;
        }

        if (!cart) {
          throw new Error(
            "Cart is not available.",
          );
        }

        const item =
          cart.items.find(
            (
              cartItem,
            ) =>
              cartItem.id ===
              itemId,
          );

        if (!item) {
          throw new Error(
            "Cart item not found.",
          );
        }

        const previousCart =
          cart;

        const nextItems =
          cart.items.map(
            (
              cartItem,
            ) =>
              cartItem.id ===
              itemId
                ? {
                    ...cartItem,

                    quantity,

                    updatedAt:
                      new Date(),
                  }
                : cartItem,
          );

        setCart(
          buildOptimisticCart(
            cart,
            nextItems,
            cart.savedItems,
          ),
        );

        try {
          await request(
            `/api/cart/item/${itemId}`,
            {
              method:
                "PATCH",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  quantity,
                }),
            },
          );
        } catch (
          error
        ) {
          setCart(
            previousCart,
          );

          throw error;
        }
      },
      [
        cart,
        user,
        request,
      ],
    );

  const removeFromCart =
    useCallback(
      async (
        itemId: string,
      ) => {
        if (!user) {
          const guestItems =
            getGuestCart().filter(
              (
                item,
              ) =>
                getGuestItemId(
                  item,
                ) !==
                itemId,
            );

          setGuestCart(
            guestItems,
          );

          const guestCart =
            await hydrateGuestCart(
              guestItems,
            );

          setCart(
            guestCart,
          );

          return;
        }

        if (!cart) {
          throw new Error(
            "Cart is not available.",
          );
        }

        const previousCart =
          cart;

        const nextItems =
          cart.items.filter(
            (
              item,
            ) =>
              item.id !==
              itemId,
          );

        const nextSavedItems =
          cart.savedItems.filter(
            (
              item,
            ) =>
              item.id !==
              itemId,
          );

        if (
          nextItems.length ===
            cart.items.length &&
          nextSavedItems.length ===
            cart.savedItems.length
        ) {
          throw new Error(
            "Cart item not found.",
          );
        }

        setCart(
          buildOptimisticCart(
            cart,
            nextItems,
            nextSavedItems,
          ),
        );

        try {
          await request(
            `/api/cart/item/${itemId}`,
            {
              method:
                "DELETE",

              credentials:
                "include",
            },
          );
        } catch (
          error
        ) {
          setCart(
            previousCart,
          );

          throw error;
        }
      },
      [
        cart,
        user,
        request,
      ],
    );

  const clearCart =
    useCallback(
      async () => {
        if (user) {
          await request(
            "/api/cart",
            {
              method:
                "DELETE",

              credentials:
                "include",
            },
          );

          return;
        }

        clearStoredGuestCart();

        const guestCart =
          await hydrateGuestCart(
            [],
          );

        setCart(
          guestCart,
        );
      },
      [
        user,
        request,
      ],
    );

  const saveForLater =
    useCallback(
      async (
        itemId: string,
      ) => {
        if (!user) {
          throw new Error(
            "Please sign in to save items for later.",
          );
        }

        if (!cart) {
          throw new Error(
            "Cart is not available.",
          );
        }

        const item =
          cart.items.find(
            (
              cartItem,
            ) =>
              cartItem.id ===
              itemId,
          );

        if (!item) {
          throw new Error(
            "Cart item not found.",
          );
        }

        const previousCart =
          cart;

        const savedItem:
          CartItem = {
          ...item,

          status:
            "SAVED_FOR_LATER",

          updatedAt:
            new Date(),
        };

        const nextItems =
          cart.items.filter(
            (
              cartItem,
            ) =>
              cartItem.id !==
              itemId,
          );

        const nextSavedItems =
          [
            ...cart.savedItems,
            savedItem,
          ];

        setCart(
          buildOptimisticCart(
            cart,
            nextItems,
            nextSavedItems,
          ),
        );

        try {
          await request(
            `/api/cart/save/${itemId}`,
            {
              method:
                "PATCH",

              credentials:
                "include",
            },
          );
        } catch (
          error
        ) {
          setCart(
            previousCart,
          );

          throw error;
        }
      },
      [
        cart,
        user,
        request,
      ],
    );

  const moveToCart =
    useCallback(
      async (
        itemId: string,
      ) => {
        if (!user) {
          throw new Error(
            "Please sign in to move saved items.",
          );
        }

        if (!cart) {
          throw new Error(
            "Cart is not available.",
          );
        }

        const item =
          cart.savedItems.find(
            (
              cartItem,
            ) =>
              cartItem.id ===
              itemId,
          );

        if (!item) {
          throw new Error(
            "Saved cart item not found.",
          );
        }

        const previousCart =
          cart;

        const cartItem:
          CartItem = {
          ...item,

          status:
            "CART",

          updatedAt:
            new Date(),
        };

        const nextSavedItems =
          cart.savedItems.filter(
            (
              cartItem,
            ) =>
              cartItem.id !==
              itemId,
          );

        const nextItems = [
          ...cart.items,
          cartItem,
        ];

        setCart(
          buildOptimisticCart(
            cart,
            nextItems,
            nextSavedItems,
          ),
        );

        try {
          await request(
            `/api/cart/move/${itemId}`,
            {
              method:
                "PATCH",

              credentials:
                "include",
            },
          );
        } catch (
          error
        ) {
          setCart(
            previousCart,
          );

          throw error;
        }
      },
      [
        cart,
        user,
        request,
      ],
    );

  const mergeGuestCart =
    useCallback(
      async (
        items:
          AddToCartInput[],
      ) => {
        if (!user) {
          throw new Error(
            "Please sign in before merging a guest cart.",
          );
        }

        if (
          items.length ===
          0
        ) {
          return;
        }

        await request(
          "/api/cart/merge",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                items,
              ),
          },
        );

        clearStoredGuestCart();
      },
      [
        user,
        request,
      ],
    );

  useEffect(() => {
    if (
      authLoading
    ) {
      return;
    }

    let cancelled =
      false;

    async function initialiseCart() {
      try {
        setLoading(
          true,
        );

        setError(
          null,
        );

        const guestItems =
          getGuestCart();

        if (user) {
          if (
            guestItems.length >
            0
          ) {
            await mergeGuestCart(
              guestItems,
            );
          } else {
            await refresh();
          }

          return;
        }

        const guestCart =
          await hydrateGuestCart(
            guestItems,
          );

        if (
          !cancelled
        ) {
          setCart(
            guestCart,
          );
        }
      } catch (
        error
      ) {
        if (
          !cancelled
        ) {
          setCart(
            null,
          );

          setError(
            error instanceof
              Error
              ? error.message
              : "Failed to initialise cart.",
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void initialiseCart();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    user,
    mergeGuestCart,
    refresh,
  ]);

  const value =
    useMemo(
      () => ({
        cart,

        loading,

        error,

        refresh,

        addToCart,

        updateQuantity,

        removeFromCart,

        cartOpen,

        openCart,

        closeCart,

        clearCart,

        saveForLater,

        moveToCart,

        mergeGuestCart,

        itemCount:
          cart?.summary
            .itemCount ??
          0,
      }),
      [
        cart,
        loading,
        error,
        refresh,
        addToCart,
        cartOpen,
        openCart,
        closeCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        saveForLater,
        moveToCart,
        mergeGuestCart,
      ],
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context =
    useContext(
      CartContext,
    );

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider.",
    );
  }

  return context;
}