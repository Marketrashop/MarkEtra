
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { uploadImage } from "@/lib/cloudinary/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type RouteContext = {
  params: Promise<{ interestId: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const admin = await requireAdmin();
    const { interestId } = await params;

    const interest = await prisma.affiliateInterest.findUnique({
      where: { id: interestId },
      select: {
        id: true,
        status: true,
        listing: {
          select: {
            publicationStatus: true,
          },
        },
      },
    });

    if (!interest) {
      return NextResponse.json(
        {
          success: false,
          error: "Affiliate interest not found.",
        },
        { status: 404 },
      );
    }

    if (
      interest.listing.publicationStatus !== "PUBLISHED" ||
      !["PENDING", "NEGOTIATING"].includes(interest.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "This negotiation is no longer available.",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select an image.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG and WebP images are supported.",
        },
        { status: 400 },
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Image size must not exceed 5 MB.",
        },
        { status: 400 },
      );
    }

    const uploaded = await uploadImage(image, {
      folder: `marketra/affiliate-negotiations/${interestId}`,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: uploaded.secureUrl,
        imageKey: uploaded.publicId,
      },
    });
  } catch (error) {
    console.error(
      "Admin negotiation image upload error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden." },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to upload negotiation image.",
      },
      { status: 500 },
    );
  }
}
