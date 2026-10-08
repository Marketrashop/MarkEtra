import {
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "@/lib/auth/session";

import {
  getOrCreateWishlistService,
  removeFromWishlistService,
} from "@/services/wishlist.service";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function DELETE(
  _: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    const session =
      await getCurrentSession();

    if (!session) {
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

    const {
      productId,
    } = await params;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const wishlist =
      await getOrCreateWishlistService(
        session.user.id,
      );

    const result =
      await removeFromWishlistService(
        wishlist.id,
        productId,
      );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove product from wishlist.",
      },
      {
        status: 500,
      },
    );
  }
}