import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  addToCart,
  clearCart,
  getCart,
} from "@/components/Cart/cart.service";

import {
  addToCartSchema,
} from "@/validation/cart.validation";

export async function GET() {
  try {
    const cart =
      await getCart();

    return NextResponse.json(
      cart,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch cart.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const input =
      addToCartSchema.parse(
        body,
      );

    const cart =
      await addToCart(input);

    return NextResponse.json(
      cart,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to add item to cart.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE() {
  try {
    const cart =
      await clearCart();

    return NextResponse.json(
      cart,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to clear cart.",
      },
      {
        status: 400,
      },
    );
  }
}