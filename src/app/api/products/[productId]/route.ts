import { NextRequest, NextResponse } from "next/server";

import {
  getProductByIdService,
} from "@/services/product.service";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { productId } =
      await params;

    const product =
      await getProductByIdService(
        productId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load product.",
      },
      {
        status: 500,
      }
    );
  }
}