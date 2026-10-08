import { NextResponse } from "next/server";

import { getCart } from "@/components/Cart/cart.service";

export async function GET() {
  try {
    const cart = await getCart();

    const count = cart.items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

    return NextResponse.json({
      count,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch cart count.",
      },
      {
        status: 400,
      },
    );
  }
}