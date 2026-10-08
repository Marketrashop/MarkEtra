import { NextRequest, NextResponse } from "next/server";

import {
  getProductByIdService,
  listRelatedProductsService,
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

const primaryCategory =
  product.categories[0]?.categoryId;

if (!primaryCategory) {
  return NextResponse.json({
    success: true,
    data: [],
  });
}

const related =
  await listRelatedProductsService(
    primaryCategory,
    product.id
  );

    return NextResponse.json({
      success: true,
      data: related,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load related products.",
      },
      {
        status: 500,
      }
    );
  }
}