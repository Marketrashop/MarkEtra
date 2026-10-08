import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getCategoryBySlug } from "@/repositories/category.repository";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { slug } =
      await params;

    const category =
      await getCategoryBySlug(
        slug,
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
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "Failed to fetch category by slug:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to fetch category.",
      },
      {
        status: 500,
      },
    );
  }
}