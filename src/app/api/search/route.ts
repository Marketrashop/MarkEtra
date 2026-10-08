import {
  NextRequest,
  NextResponse,
} from "next/server";

import Fuse from "fuse.js";

import { prisma } from "@/lib/prisma";

import {
  productInclude,
} from "@/lib/products/product.select";

import {
  toProductCard,
} from "@/lib/products/product.mapper";

import {
  buildProductSearchWhere,
  buildSearchTerms,
  calculateSearchScore,
} from "@/lib/search/product-search.util";

export async function GET(
  request: NextRequest,
) {
  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim();

  const limit = Math.min(
    Number(
      request.nextUrl.searchParams.get(
        "limit",
      ) ?? "8",
    ),
    20,
  );

  if (!query) {
    return NextResponse.json([]);
  }

  const searchTerms =
    buildSearchTerms(query);

  const products =
    await prisma.product.findMany({
      where: {
        status: "ACTIVE",

        OR: buildProductSearchWhere(
          searchTerms,
        ),
      },

      include: productInclude,

      take: 150,
    });

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

  const fuse = new Fuse(
    scoredProducts,
    {
      includeScore: true,

      threshold: 0.35,

      ignoreLocation: true,

      minMatchCharLength: 2,

      keys: [
        {
          name: "product.name",
          weight: 0.55,
        },

        {
          name: "product.slug",
          weight: 0.15,
        },

        {
          name: "product.description",
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

  const fuzzyMatches =
    fuse.search(query);

  const fuzzyIds =
    new Set(
      fuzzyMatches.map(
        (match) =>
          match.item.product.id,
      ),
    );

  const merged = [
    ...scoredProducts.map(
      (item) => item.product,
    ),

    ...fuzzyMatches.map(
      (match) =>
        match.item.product,
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
    );

  uniqueProducts.sort(
    (a, b) => {
      const aFuzzy =
        fuzzyIds.has(a.id);

      const bFuzzy =
        fuzzyIds.has(b.id);

      if (
        aFuzzy !== bFuzzy
      ) {
        return aFuzzy
          ? -1
          : 1;
      }

      const scoreA =
        calculateSearchScore(
          a,
          searchTerms,
        );

      const scoreB =
        calculateSearchScore(
          b,
          searchTerms,
        );

      return scoreB - scoreA;
    },
  );

  return NextResponse.json(
    uniqueProducts
      .slice(0, limit)
      .map(toProductCard),
  );
}