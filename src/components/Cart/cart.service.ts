import {
  Prisma,
} from "@/../generated/prisma/client";

import type {
  CartItemStatus,
} from "@/constants/cart-item-status";

import {
  prisma,
} from "@/lib/prisma";

import {
  getCurrentSession,
} from "@/lib/auth/session";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary/url";

import type {
  AddToCartInput,
  Cart,
  CartItem,
  CartSummary,
  CartVariantSize,
} from "./cart.types";

async function requireUser() {
  const session =
    await getCurrentSession();

  if (!session) {
    throw new Error(
      "Unauthorized.",
    );
  }

  return session.user.id;
}

async function getOrCreateCart(
  userId: string,
) {
  return prisma.cart.upsert({
    where: {
      userId,
    },

    update: {},

    create: {
      userId,
    },
  });
}

function getSellableStock(
  stock: number,
  reservedStock: number,
) {
  return Math.max(
    0,
    stock - reservedStock,
  );
}

function validateQuantity(
  quantity: number,
) {
  if (
    !Number.isInteger(
      quantity,
    ) ||
    quantity < 1
  ) {
    throw new Error(
      "Quantity must be at least 1.",
    );
  }
}

function validateInventoryQuantity(
  quantity: number,
  stock: number,
  reservedStock: number,
  allowPreorder: boolean,
) {
  validateQuantity(
    quantity,
  );

  const availableStock =
    getSellableStock(
      stock,
      reservedStock,
    );

  if (
    quantity <=
      availableStock ||
    allowPreorder
  ) {
    return;
  }

  throw new Error(
    `Only ${availableStock} item${
      availableStock === 1
        ? ""
        : "s"
    } currently available in stock.`,
  );
}

type PrismaCartItem =
  Prisma.CartItemGetPayload<{
    include: {
      product: {
        select: {
          id: true;
          name: true;
          slug: true;
          description: true;
          price: true;
          compareAtPrice: true;
          averageRating: true;
          totalRatings: true;
          featured: true;
          status: true;
          createdAt: true;
          publishedAt: true;

          categories: {
            take: 1;

            select: {
              category: {
                select: {
                  id: true;
                  name: true;
                  slug: true;
                };
              };
            };
          };

          images: {
            select: {
              id: true;
              imageKey: true;
              altText: true;
              isPrimary: true;
              sortOrder: true;
            };
          };
        };
      };

      variantSize: {
        include: {
          variant: {
            select: {
              id: true;
              type: true;
              label: true;

              images: {
                select: {
                  imageKey: true;
                  isPrimary: true;
                };
              };
            };
          };
        };
      };
    };
  }>;

function mapCartItem(
  item: PrismaCartItem,
): CartItem {

  if (!item.variantSize) {
    throw new Error(
      "Cart item inventory record is missing.",
    );
  }

const primaryCategory =
  item.product.categories[0]
    ?.category ?? null;

  const product = {
    id:
      item.product.id,

    slug:
      item.product.slug,

    name:
      item.product.name,

    description:
      item.product.description,

    price:
      Number(
        item.product.price,
      ),

    compareAtPrice:
      item.product
        .compareAtPrice ===
      null
        ? null
        : Number(
            item.product
              .compareAtPrice,
          ),

    averageRating:
      Number(
        item.product
          .averageRating,
      ),

    totalRatings:
      item.product.totalRatings,

    featured:
      item.product.featured,

    status:
      item.product.status,

    createdAt:
      item.product.createdAt,

    publishedAt:
      item.product.publishedAt,

categories: primaryCategory
  ? [
      {
        category: {
          id: primaryCategory.id,
          name: primaryCategory.name,
          slug: primaryCategory.slug,
        },
      },
    ]
  : [],

    images:
      item.product.images.map(
        (image) => ({
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

const primaryVariantImage =
  item.variantSize
    .variant.images.find(
      (image) =>
        image.isPrimary,
    ) ??
  item.variantSize
    .variant.images[0] ??
  null;

const variantSize: CartVariantSize = {
  id: item.variantSize.id,

  size: item.variantSize.size,

  sku: item.variantSize.sku,

  price:
    item.variantSize.price === null
      ? null
      : Number(item.variantSize.price),

  stock: item.variantSize.stock,

  reservedStock:
    item.variantSize.reservedStock,

  incomingStock:
    item.variantSize.incomingStock,

  allowPreorder:
    item.variantSize.allowPreorder,

variant: {
  id:
    item.variantSize.variant.id,

  type:
    item.variantSize.variant.type,

  label:
    item.variantSize.variant.label,

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

return {
    id:
      item.id,

    productId:
      item.productId,

    variantSizeId:
      item.variantSizeId!,

    quantity:
      item.quantity,

    status:
      item.status,

    product,

    variantSize,

    createdAt:
      item.createdAt,

    updatedAt:
      item.updatedAt,
  };
}

function calculateSummary(
  cartItems: CartItem[],
  savedItems: CartItem[],
): CartSummary {
  let subtotal = 0;

  let savings = 0;

  for (
    const item of cartItems
  ) {
    const price =
      item.variantSize
        .price ??
      item.product.price;

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

  return {
    itemCount:
      cartItems.reduce(
        (
          sum,
          item,
        ) =>
          sum +
          item.quantity,
        0,
      ),

    savedCount:
      savedItems.reduce(
        (
          sum,
          item,
        ) =>
          sum +
          item.quantity,
        0,
      ),

    subtotal,

    savings,

    total:
      subtotal,
  };
}

async function fetchCartItems(
  cartId: string,
) {
  return prisma.cartItem.findMany(
    {
      where: {
        cartId,
        variantSize: {
          isNot: null,
        },
      },

      include: {
        product: {
          select: {
            id: true,

            name: true,

            slug: true,

            description: true,

            price: true,

            compareAtPrice: true,

            averageRating: true,

            totalRatings: true,

            featured: true,

            status: true,

            createdAt: true,

            publishedAt: true,

categories: {
  take: 1,

  select: {
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },
},

            images: {
              orderBy: {
                sortOrder:
                  "asc",
              },

              select: {
                id: true,

                imageKey:
                  true,

                altText:
                  true,

                isPrimary:
                  true,

                sortOrder:
                  true,
              },
            },
          },
        },

        variantSize: {
          include: {
variant: {
  select: {
    id: true,
    type: true,
    label: true,

    images: {
      orderBy: {
        sortOrder: "asc",
      },

      select: {
        imageKey: true,
        isPrimary: true,
      },
    },
  },
},
          },
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },
    },
  );
}

export async function getCart(): Promise<Cart> {
  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  const items =
    await fetchCartItems(
      cart.id,
    );

  const cartItems =
    items
      .filter(
        (item) =>
          item.status ===
          "CART",
      )
      .map(
        mapCartItem,
      );

  const savedItems =
    items
      .filter(
        (item) =>
          item.status ===
          "SAVED_FOR_LATER",
      )
      .map(
        mapCartItem,
      );

  return {
    id:
      cart.id,

    userId,

    items:
      cartItems,

    savedItems,

    createdAt:
      cart.createdAt,

    updatedAt:
      cart.updatedAt,

    summary:
      calculateSummary(
        cartItems,
        savedItems,
      ),
  };
}

export async function addToCart(
  input: AddToCartInput,
): Promise<Cart> {
  const userId =
    await requireUser();

  const quantity =
    input.quantity ??
    1;

  validateQuantity(
    quantity,
  );

  const cart =
    await getOrCreateCart(
      userId,
    );

  const inventory =
    await prisma.productVariantSize.findFirst(
      {
        where: {
          id:
            input.variantSizeId,

          variant: {
            productId:
              input.productId,
          },
        },

        select: {
          id: true,

          stock: true,

          reservedStock:
            true,

          allowPreorder:
            true,
        },
      },
    );

  if (!inventory) {
    throw new Error(
      "Product inventory option not found.",
    );
  }

  validateInventoryQuantity(
    quantity,
    inventory.stock,
    inventory.reservedStock,
    inventory.allowPreorder,
  );

  const existing =
    await prisma.cartItem.findFirst(
      {
        where: {
          cartId:
            cart.id,

          productId:
            input.productId,

          variantSizeId:
            input.variantSizeId,

          status:
            "CART",
        },

        select: {
          id: true,

          quantity: true,
        },
      },
    );

  if (existing) {
    const newQuantity =
      existing.quantity +
      quantity;

    validateInventoryQuantity(
      newQuantity,
      inventory.stock,
      inventory.reservedStock,
      inventory.allowPreorder,
    );

    await prisma.cartItem.update(
      {
        where: {
          id:
            existing.id,
        },

        data: {
          quantity:
            newQuantity,
        },
      },
    );
  } else {
    await prisma.cartItem.create(
      {
        data: {
          cartId:
            cart.id,

          userId,

          productId:
            input.productId,

          variantSizeId:
            input.variantSizeId,

          quantity,

          status:
            "CART",
        },
      },
    );
  }

  return getCart();
}

export async function updateQuantity(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  validateQuantity(
    quantity,
  );

  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  const item =
    await prisma.cartItem.findFirst(
      {
        where: {
          id:
            itemId,

          cartId:
            cart.id,
        },

        include: {
          variantSize: {
            select: {
              stock:
                true,

              reservedStock:
                true,

              allowPreorder:
                true,
            },
          },
        },
      },
    );

  if (!item) {
    throw new Error(
      "Cart item not found.",
    );
  }

  if (!item.variantSize) {
    throw new Error(
      "Cart item inventory record is missing.",
    );
  }

  validateInventoryQuantity(
    quantity,
    item.variantSize.stock,
    item.variantSize
      .reservedStock,
    item.variantSize
      .allowPreorder,
  );

  await prisma.cartItem.update(
    {
      where: {
        id:
          item.id,
      },

      data: {
        quantity,
      },
    },
  );

  return getCart();
}

export async function removeFromCart(
  itemId: string,
): Promise<Cart> {
  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  await prisma.cartItem.deleteMany(
    {
      where: {
        id:
          itemId,

        cartId:
          cart.id,
      },
    },
  );

  return getCart();
}

export async function saveForLater(
  itemId: string,
): Promise<Cart> {
  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  const item =
    await prisma.cartItem.findFirst(
      {
        where: {
          id:
            itemId,

          cartId:
            cart.id,

          status:
            "CART",
        },

        select: {
          id: true,

          productId:
            true,

          variantSizeId:
            true,

          quantity:
            true,
        },
      },
    );

  if (!item) {
    throw new Error(
      "Cart item not found.",
    );
  }

  const existingSavedItem =
    await prisma.cartItem.findFirst(
      {
        where: {
          cartId:
            cart.id,

          productId:
            item.productId,

          variantSizeId:
            item.variantSizeId,

          status:
            "SAVED_FOR_LATER",
        },

        select: {
          id: true,

          quantity: true,
        },
      },
    );

  if (existingSavedItem) {
    await prisma.$transaction([
      prisma.cartItem.update(
        {
          where: {
            id:
              existingSavedItem.id,
          },

          data: {
            quantity:
              existingSavedItem
                .quantity +
              item.quantity,
          },
        },
      ),

      prisma.cartItem.delete(
        {
          where: {
            id:
              item.id,
          },
        },
      ),
    ]);
  } else {
    await prisma.cartItem.update(
      {
        where: {
          id:
            item.id,
        },

        data: {
          status:
            "SAVED_FOR_LATER",
        },
      },
    );
  }

  return getCart();
}

export async function moveToCart(
  itemId: string,
): Promise<Cart> {
  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  const item =
    await prisma.cartItem.findFirst(
      {
        where: {
          id:
            itemId,

          cartId:
            cart.id,

          status:
            "SAVED_FOR_LATER",
        },

        include: {
          variantSize: {
            select: {
              id: true,

              stock:
                true,

              reservedStock:
                true,

              allowPreorder:
                true,
            },
          },
        },
      },
    );

  if (!item) {
    throw new Error(
      "Saved item not found.",
    );
  }

  if (!item.variantSize) {
    throw new Error(
      "Saved item inventory record is missing.",
    );
  }

  validateInventoryQuantity(
    item.quantity,
    item.variantSize.stock,
    item.variantSize
      .reservedStock,
    item.variantSize
      .allowPreorder,
  );

  const duplicate =
    await prisma.cartItem.findFirst(
      {
        where: {
          cartId:
            cart.id,

          productId:
            item.productId,

          variantSizeId:
            item.variantSize.id,

          status:
            "CART",
        },

        select: {
          id: true,

          quantity: true,
        },
      },
    );

  if (duplicate) {
    const newQuantity =
      duplicate.quantity +
      item.quantity;

    validateInventoryQuantity(
      newQuantity,
      item.variantSize.stock,
      item.variantSize
        .reservedStock,
      item.variantSize
        .allowPreorder,
    );

    await prisma.$transaction([
      prisma.cartItem.update(
        {
          where: {
            id:
              duplicate.id,
          },

          data: {
            quantity:
              newQuantity,
          },
        },
      ),

      prisma.cartItem.delete(
        {
          where: {
            id:
              item.id,
          },
        },
      ),
    ]);
  } else {
    await prisma.cartItem.update(
      {
        where: {
          id:
            item.id,
        },

        data: {
          status:
            "CART",
        },
      },
    );
  }

  return getCart();
}

export async function clearCart(): Promise<Cart> {
  const userId =
    await requireUser();

  const cart =
    await getOrCreateCart(
      userId,
    );

  await prisma.cartItem.deleteMany(
    {
      where: {
        cartId:
          cart.id,

        status:
          "CART",
      },
    },
  );

  return getCart();
}

export async function mergeGuestCart(
  items: AddToCartInput[],
): Promise<Cart> {
  for (
    const item of items
  ) {
    await addToCart(
      item,
    );
  }

  return getCart();
}