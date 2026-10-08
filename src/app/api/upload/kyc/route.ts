import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/user";
import { uploadImage } from "@/lib/cloudinary/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Session Timeout. Please login again.",
    },
    {
      status: 401,
    }
  );
}

function handleAuthError(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  return null;
}

export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await requireUser();

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Image is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPG, PNG and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Image size must not exceed 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const uploaded =
      await uploadImage(file, {
        folder: "marketra/kyc",

        public_id: `${session.user.id}_${Date.now()}`,

        resource_type: "image",
      });

    return NextResponse.json(
      {
        success: true,

        key: uploaded.publicId,

        url: uploaded.secureUrl,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}