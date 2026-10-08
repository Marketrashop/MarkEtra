import { NextRequest, NextResponse } from "next/server";

import { searchProducts } from "@/services/product-search.service";

const MIN_QUERY_LENGTH = 2;

export async function GET(
  request: NextRequest
) {
  try {
    const query =
      request.nextUrl.searchParams
        .get("q")
        ?.trim() ?? "";

    if (query.length < MIN_QUERY_LENGTH) {
      return NextResponse.json({
        query,
        categories: [],
        products: [],
      });
    }

    const results =
      await searchProducts(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error(
      "[PRODUCT_SEARCH_GET]",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to search products.",
      },
      {
        status: 500,
      }
    );
  }
}