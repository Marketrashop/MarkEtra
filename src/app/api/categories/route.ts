import { NextRequest, NextResponse } from "next/server";

import {
  listCategoriesService,
} from "@/services/category.service";

export async function GET(
  request: NextRequest
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
        ? true
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