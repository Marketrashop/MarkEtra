import { NextRequest, NextResponse } from "next/server";

import {
  removeFromCart,
  updateQuantity,
} from "@/components/Cart/cart.service";

import { updateCartItemSchema } from "@/validation/cart.validation";

type RouteContext = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { itemId } =
      await params;

    const body =
      await request.json();

    const input =
      updateCartItemSchema.parse(body);

    const cart =
      await updateQuantity(
        itemId,
        input.quantity,
      );

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update cart item.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { itemId } =
      await params;

    const cart =
      await removeFromCart(
        itemId,
      );

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove cart item.",
      },
      {
        status: 400,
      },
    );
  }
}