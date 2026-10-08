import { NextRequest, NextResponse } from "next/server";

import {
  getCategoryService,
} from "@/services/category.service";

import {
  listProductsService,
} from "@/services/product.service";

type RouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { categoryId } =
      await params;

    const category =
      await getCategoryService(
        categoryId
      );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

const products =
  await listProductsService({
    categoryId,
  });

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
          "Failed to load category products.",
      },
      {
        status: 500,
      }
    );
  }
}