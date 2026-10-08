import { NextResponse } from "next/server";

import {
  listFeaturedProductsService,
} from "@/services/product.service";

export async function GET() {
  try {
    const products =
      await listFeaturedProductsService();

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
          "Failed to load featured products.",
      },
      {
        status: 500,
      }
    );
  }
}