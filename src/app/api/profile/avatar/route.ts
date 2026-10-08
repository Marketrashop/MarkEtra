import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";
import { uploadImage } from "@/lib/cloudinary/upload";
import cloudinary from "@/lib/cloudinary/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(
  request: NextRequest,
) {
  try {
    const session =
      await requireUser();

    const formData =
      await request.formData();

    const image =
      formData.get("avatar");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select an image.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        image.type,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPG, PNG and WebP images are supported.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      image.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Avatar size must not exceed 5 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          avatarKey: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const uploaded =
      await uploadImage(image, {
        folder:
          "marketra/avatars",
        resource_type: "image",
        overwrite: true,
      });

    if (user.avatarKey) {
      try {
        await cloudinary.uploader.destroy(
          user.avatarKey,
          {
            resource_type: "image",
          },
        );
      } catch (error) {
        console.error(
          "Unable to delete previous avatar:",
          error,
        );
      }
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatarKey:
          uploaded.publicId,
      },
    });

    return NextResponse.json({
      success: true,
      avatarKey:
        uploaded.publicId,
      avatarUrl:
        uploaded.secureUrl,
    });
  } catch (error) {
    console.error(
      "Avatar upload error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to upload avatar.",
      },
      {
        status: 500,
      },
    );
  }
}