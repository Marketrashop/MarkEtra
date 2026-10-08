import {
  addWishlistItem,
  createWishlist,
  deleteWishlistItem,
  getOrCreateWishlist,
  getWishlistByUserId,
  getWishlistItem,
} from "@/repositories/wishlist.repository";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";

import type {
  ProductVariant,
} from "@/lib/products/product.types";

import type {
  AddToWishlistInput,
  WishlistItem,
  WishlistResponse,
} from "@/types/wishlist.types";

function mapWishlistItem(
  item: {
    id: string;

    productId: string;

    variantSizeId: string | null;

    createdAt: Date;

product: {
  id: string;

  name: string;

  slug: string;

  description: string;

  price: unknown;

  compareAtPrice: unknown;

  averageRating: unknown;

  totalRatings: number;

  featured: boolean;

  status: string;

  createdAt: Date;

  publishedAt: Date | null;

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

    altText: string | null;

    isPrimary: boolean;

    sortOrder: number;
  }[];
};

    variantSize: {
      id: string;

      size: string | null;

      sku: string | null;

      price: unknown;

      stock: number;

      reservedStock: number;

      incomingStock: number;

      allowPreorder: boolean;

variant: {
  id: string;

  type: ProductVariant["type"];

  label: string | null;

  images: {
    id: string;

    imageKey: string;

    altText: string | null;

    isPrimary: boolean;

    sortOrder: number;
  }[];
};
    } | null;
  },
): WishlistItem {

const primaryVariantImage =
  item.variantSize
    ? (
        item.variantSize.variant.images.find(
          (image) =>
            image.isPrimary,
        ) ??
        item.variantSize.variant.images[0] ??
        null
      )
    : null;

  const primaryCategory =
  item.product.categories[0]
    ?.category ?? null;

  return {
    id: item.id,

    productId: item.productId,

    variantSizeId:
      item.variantSizeId,

product: {
  id: item.product.id,

  name: item.product.name,

  slug: item.product.slug,

  description:
    item.product.description,

  price:
    Number(item.product.price),

  compareAtPrice:
    item.product.compareAtPrice ===
    null
      ? null
      : Number(
          item.product.compareAtPrice,
        ),

  averageRating:
    Number(
      item.product.averageRating,
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

category:
  primaryCategory
    ? {
        id:
          primaryCategory.id,

        name:
          primaryCategory.name,

        slug:
          primaryCategory.slug,
      }
    : null,

  images:
    item.product.images.map(
      (image) => ({
        id: image.id,

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
},

    variantSize:
      item.variantSize
        ? {
            id:
              item.variantSize.id,

            size:
              item.variantSize.size,

            sku:
              item.variantSize.sku,

            price:
              item.variantSize.price ===
              null
                ? null
                : Number(
                    item.variantSize
                      .price,
                  ),

            stock:
              item.variantSize.stock,

            reservedStock:
              item.variantSize
                .reservedStock,

            incomingStock:
              item.variantSize
                .incomingStock,

            allowPreorder:
              item.variantSize
                .allowPreorder,              

variant: {
  id:
    item.variantSize.variant.id,

  type:
    item.variantSize.variant.type,

  label:
    item.variantSize.variant.label,

  images:
    item.variantSize.variant.images.map(
      (image) => ({
        id: image.id,

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
},
          }
        : null,

    createdAt:
      item.createdAt,
  };
}

export async function getWishlistService(
  userId: string,
): Promise<WishlistResponse> {
  const wishlist =
    await getWishlistByUserId(
      userId,
    );

  if (!wishlist) {
    const created =
      await createWishlist(
        userId,
      );

    return {
      wishlist: {
        id: created.id,

        userId,

        items: [],

        createdAt:
          created.createdAt,

        updatedAt:
          created.updatedAt,
      },

      summary: {
        itemCount: 0,
      },
    };
  }

  const items =
    wishlist.items.map(
      mapWishlistItem,
    );

  return {
    wishlist: {
      id: wishlist.id,

      userId,

      items,

      createdAt:
        wishlist.createdAt,

      updatedAt:
        wishlist.updatedAt,
    },

    summary: {
      itemCount:
        items.length,
    },
  };
}

export async function createWishlistService(
  userId: string,
) {
  return createWishlist(
    userId,
  );
}

export async function getOrCreateWishlistService(
  userId: string,
) {
  return getOrCreateWishlist(
    userId,
  );
}

export async function addToWishlistService(
  userId: string,
  input: AddToWishlistInput,
) {
  const wishlist =
    await getOrCreateWishlist(
      userId,
    );

  const existingItem =
    await getWishlistItem(
      wishlist.id,

      input.productId,

      input.variantSizeId ??
        null,
    );

  if (existingItem) {
    throw new Error(
      "Item already exists.",
    );
  }

  return addWishlistItem(
    wishlist.id,

    input,
  );
}

export async function removeFromWishlistService(
  wishlistId: string,
  productId: string,
  variantSizeId?: string | null,
) {
  return deleteWishlistItem(
    wishlistId,

    productId,

    variantSizeId,
  );
}