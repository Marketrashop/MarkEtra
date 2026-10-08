import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  mergeGuestCart,
} from "@/components/Cart/cart.service";

import {
  addToCartSchema,
} from "@/validation/cart.validation";

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const items = Array.isArray(
      body,
    )
      ? body
      : body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        {
          message:
            "Cart items are required.",
        },
        {
          status: 400,
        },
      );
    }

    const parsedItems =
      items.map((item) =>
        addToCartSchema.parse(
          item,
        ),
      );

    const cart =
      await mergeGuestCart(
        parsedItems,
      );

    return NextResponse.json(
      cart,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to merge cart.",
      },
      {
        status: 400,
      },
    );
  }
}