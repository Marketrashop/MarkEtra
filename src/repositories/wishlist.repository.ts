import { prisma } from "@/lib/prisma";

import type {
  Prisma,
  Wishlist,
  WishlistItem,
} from "../../generated/prisma/client";

import type {
  AddToWishlistInput,
} from "@/types/wishlist.types";

export async function getWishlistByUserId(
  userId: string,
) {
  return prisma.wishlist.findUnique({
    where: {
      userId,
    },

    include: {
      items: {
        include: {
product: {
  include: {
    categories: {
      take: 1,

      include: {
        category: true,
      },
    },

    images: {
      where: {
        isPrimary: true,
      },

      take: 1,
    },
  },
},

          variantSize: {
            include: {
              variant: {
                include: {
                  images: {
                    orderBy: {
                      sortOrder: "asc",
                    },
                  },
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function createWishlist(
  userId: string,
): Promise<Wishlist> {
  return prisma.wishlist.create({
    data: {
      userId,
    },
  });
}

export async function getOrCreateWishlist(
  userId: string,
): Promise<Wishlist> {
  const wishlist =
    await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });

  if (wishlist) {
    return wishlist;
  }

  return createWishlist(
    userId,
  );
}

export async function getWishlistItem(
  wishlistId: string,
  productId: string,
  variantSizeId?: string | null,
): Promise<WishlistItem | null> {
  return prisma.wishlistItem.findFirst({
    where: {
      wishlistId,

      productId,

      variantSizeId:
        variantSizeId ?? null,
    },
  });
}

export async function addWishlistItem(
  wishlistId: string,
  data: AddToWishlistInput,
): Promise<WishlistItem> {
  return prisma.wishlistItem.create({
    data: {
      wishlistId,

      productId:
        data.productId,

      variantSizeId:
        data.variantSizeId ??
        null,
    },
  });
}

export async function deleteWishlistItem(
  wishlistId: string,
  productId: string,
  variantSizeId?: string | null,
): Promise<WishlistItem | null> {
  const item =
    await prisma.wishlistItem.findFirst({
      where: {
        wishlistId,

        productId,

        variantSizeId:
          variantSizeId ?? null,
      },

      select: {
        id: true,
      },
    });

  if (!item) {
    return null;
  }

  return prisma.wishlistItem.delete({
    where: {
      id: item.id,
    },
  });
}

export async function clearWishlist(
  wishlistId: string,
): Promise<Prisma.BatchPayload> {
  return prisma.wishlistItem.deleteMany({
    where: {
      wishlistId,
    },
  });
}