import Fuse from "fuse.js";

import { prisma } from "@/lib/prisma";

import type {
  ProductSearchResponse,
} from "@/types/search.types";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";

import {
  buildProductSearchWhere,
  buildSearchTerms,
  calculateSearchScore,
} from "@/lib/search/product-search.util";

const MAX_CATEGORY_RESULTS = 5;

const MAX_PRODUCT_RESULTS = 8;

export async function searchProducts(
  rawQuery: string,
): Promise<ProductSearchResponse> {
  const query =
    rawQuery.trim();

  if (query.length < 2) {
    return {
      query,
      categories: [],
      products: [],
    };
  }

  const searchTerms =
    buildSearchTerms(query);

  const [
    categories,
    products,
  ] = await Promise.all([
    prisma.productCategory.findMany({
      where: {
        isActive: true,

        OR: searchTerms.flatMap(
          (term) => [
            {
              name: {
                contains: term,
                mode: "insensitive",
              },
            },

            {
              slug: {
                contains: term,
                mode: "insensitive",
              },
            },
          ],
        ),
      },

      orderBy: [
        {
          sortOrder: "asc",
        },

        {
          name: "asc",
        },
      ],

      take: MAX_CATEGORY_RESULTS,

      select: {
        id: true,
        name: true,
        slug: true,
        imageKey: true,
      },
    }),

    prisma.product.findMany({
      where: {
        status: "ACTIVE",

        OR: buildProductSearchWhere(
          searchTerms,
        ),
      },

      take: 150,

      select: {
        id: true,

        name: true,

        slug: true,

        description: true,

        price: true,

        compareAtPrice: true,

        averageRating: true,

        featured: true,

        status: true,

        categories: {
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
          where: {
            isPrimary: true,
          },

          take: 1,

          select: {
            imageKey: true,
          },
        },
      },
    }),
  ]);

  const scoredProducts =
    products
      .map((product) => ({
        product,

        score:
          calculateSearchScore(
            product,
            searchTerms,
          ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score,
      );

  const fuse =
    new Fuse(
      scoredProducts,
      {
        includeScore: true,

        threshold: 0.35,

        ignoreLocation: true,

        minMatchCharLength: 2,

        keys: [
          {
            name:
              "product.name",
            weight: 0.55,
          },

          {
            name:
              "product.slug",
            weight: 0.15,
          },

          {
            name:
              "product.description",
            weight: 0.1,
          },

          {
            name:
              "product.categories.category.name",
            weight: 0.2,
          },
        ],
      },
    );

  const fuzzyResults =
    fuse.search(query);

  const merged =
    [
      ...scoredProducts.map(
        (item) =>
          item.product,
      ),

      ...fuzzyResults.map(
        (item) =>
          item.item.product,
      ),
    ];

  const uniqueProducts =
    Array.from(
      new Map(
        merged.map(
          (product) => [
            product.id,
            product,
          ],
        ),
      ).values(),
    ).slice(
      0,
      MAX_PRODUCT_RESULTS,
    );

  return {
    query,

    categories,

    products:
      uniqueProducts.map(
        (product) => {
          const primaryCategory =
            product.categories[0]
              ?.category;

          return {
            id: product.id,

            name:
              product.name,

            slug:
              product.slug,

            price: Number(
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

            featured:
              product.featured,

            status:
              product.status,

            categoryId:
              primaryCategory?.id ??
              null,

            categoryName:
              primaryCategory?.name ??
              "Uncategorized",

            primaryImageUrl:
              getCloudinaryImageUrl(
                product.images[0]
                  ?.imageKey ??
                  null,
              ),
          };
        },
      ),
  };
}