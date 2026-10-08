import { NextRequest, NextResponse } from "next/server";

import { saveForLater } from "@/components/Cart/cart.service";

type RouteContext = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { itemId } =
      await params;

    const cart =
      await saveForLater(
        itemId,
      );

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save item for later.",
      },
      {
        status: 400,
      },
    );
  }
}