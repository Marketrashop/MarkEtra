import { NextRequest, NextResponse } from "next/server";

import {
  ProductStatus,
} from "../../../../generated/prisma/client";

import {
  listProductsService,
} from "@/services/product.service";

import type {
  ProductFilters,
  ProductSortField,
} from "@/types/product.types";

export async function GET(
  request: NextRequest
) {
  try {
    const {
      searchParams,
    } = new URL(request.url);

    const rawStatus =
      searchParams.get("status");

    const status =
      Object.values(
        ProductStatus
      ).includes(
        rawStatus as ProductStatus
      )
        ? (rawStatus as ProductStatus)
        : undefined;

    const rawSortBy =
      searchParams.get("sortBy");

    const sortBy =
      (
        [
          "name",
          "price",
          "createdAt",
          "publishedAt",
          "totalSales",
        ] as const
      ).includes(
        rawSortBy as ProductSortField
      )
        ? (rawSortBy as ProductSortField)
        : undefined;

    const filters: ProductFilters = {
      search:
        searchParams.get("search") ??
        undefined,

      categoryId:
        searchParams.get("categoryId") ??
        undefined,

      status,

      featured:
        searchParams.has("featured")
          ? searchParams.get(
              "featured"
            ) === "true"
          : undefined,

      minPrice:
        searchParams.get("minPrice")
          ? Number(
              searchParams.get(
                "minPrice"
              )
            )
          : undefined,

      maxPrice:
        searchParams.get("maxPrice")
          ? Number(
              searchParams.get(
                "maxPrice"
              )
            )
          : undefined,

      sortBy,

      sortOrder:
        searchParams.get("sortOrder") ===
        "desc"
          ? "desc"
          : "asc",
    };

    const products =
      await listProductsService(
        filters
      );

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load products.",
      },
      {
        status: 500,
      }
    );
  }
}