import { NextResponse } from "next/server";

import {
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "@/services/category.service";

import {
  updateCategorySchema,
} from "@/validation/category.validation";

type RouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function GET(
  _: Request,
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

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to fetch category.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { categoryId } =
      await params;

    const body =
      await request.json();

    const parsed =
      updateCategorySchema.parse(
        body
      );

    const category =
      await updateCategoryService(
        categoryId,
        parsed
      );

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update category.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: RouteContext
) {
  try {
    const { categoryId } =
      await params;

    await deleteCategoryService(
      categoryId
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to delete category.",
      },
      {
        status: 500,
      }
    );
  }
}