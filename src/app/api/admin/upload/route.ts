import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import { uploadImage } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const file = formData.get("file");

    const folder =
      formData.get("folder")?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No image provided",
        },
        { status: 400 },
      );
    }

    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          error: "Folder is required",
        },
        { status: 400 },
      );
    }

    const result =
      await uploadImage(file, {
        folder: `marketra/${folder}`,
        resource_type: "image",
      });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Session Timeout. Please login again.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Image upload failed",
      },
      {
        status: 500,
      },
    );
  }
}