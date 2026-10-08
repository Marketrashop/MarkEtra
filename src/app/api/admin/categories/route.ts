import { NextResponse } from "next/server";

import {
  createCategorySchema,
} from "@/validation/category.validation";

import {
  createCategoryService,
  listCategoriesService,
} from "@/services/category.service";

export async function GET(
  request: Request
) {
  try {
    const {
      searchParams,
    } = new URL(request.url);

    const search =
      searchParams.get("search") ??
      undefined;

    const isActiveParam =
      searchParams.get("isActive");

    const isActive =
      isActiveParam === null
        ? undefined
        : isActiveParam === "true";

    const categories =
      await listCategoriesService({
        search,
        isActive,
      });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load categories.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const parsed =
      createCategorySchema.parse(
        body
      );

    const category =
      await createCategoryService(
        parsed
      );

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create category.",
      },
      {
        status: 400,
      }
    );
  }
}