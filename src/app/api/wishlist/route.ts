import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "@/lib/auth/session";

import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
} from "@/services/wishlist.service";

export async function GET() {
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

    const wishlist =
      await getWishlistService(
        session.user.id,
      );

return NextResponse.json(
  wishlist,
);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load wishlist.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
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

    const body =
      await request.json();

    if (
      typeof body.productId !==
        "string" ||
      body.productId.trim() === ""
    ) {
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

    const result =
      await addToWishlistService(
        session.user.id,
        {
          productId:
            body.productId,

          ...(typeof body.variantSizeId ===
          "string"
            ? {
                variantSizeId:
                  body.variantSizeId,
              }
            : {}),
        },
      );

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
    console.error(error);

const message =
  error instanceof Error
    ? error.message
    : "Failed to add product to wishlist.";

const status =
  message ===
  "Item already exists."
    ? 409
    : 500;

return NextResponse.json(
  {
    success: false,

    error: message,
  },
  {
    status,
  },
);
  }
}

export async function DELETE(
  request: NextRequest,
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

    const body =
      await request.json();

if (
  typeof body.productId !==
    "string" ||
  body.productId.trim() === ""
) {
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

if (
  body.variantSizeId !==
    undefined &&
  typeof body.variantSizeId !==
    "string"
) {
  return NextResponse.json(
    {
      success: false,

      error:
        "Variant size ID must be a string.",
    },
    {
      status: 400,
    },
  );
}

const wishlist =
  await getWishlistService(
    session.user.id,
  );

const result =
  await removeFromWishlistService(
    wishlist.wishlist.id,
    body.productId,
    body.variantSizeId ??
      null,
  );

if (!result) {
  return NextResponse.json(
    {
      success: false,

      error:
        "Wishlist item not found.",
    },
    {
      status: 404,
    },
  );
}

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