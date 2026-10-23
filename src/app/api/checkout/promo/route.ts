
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/auth/user";
import { previewCheckoutPromoService } from "@/services/order.service";

const promoPreviewSchema = z
  .object({
    code: z.string().trim().min(1).max(50),
    mode: z.enum(["CART", "DIRECT"]),
    productId: z.string().optional(),
    variantSizeId: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    includeCart: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === "DIRECT") {
      if (!value.variantSizeId) {
        ctx.addIssue({
          code: "custom",
          path: ["variantSizeId"],
          message: "A variant size is required for direct checkout.",
        });
      }

      if (!value.quantity) {
        ctx.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "A valid quantity is required for direct checkout.",
        });
      }
    }
  });

const promoErrorMessages: Record<string, string> = {
  PROMO_CODE_INVALID: "This promo code is invalid.",
  PROMO_CODE_INACTIVE: "This promo code is currently inactive.",
  PROMO_CODE_NOT_STARTED: "This promo code is not available yet.",
  PROMO_CODE_EXPIRED: "This promo code has expired.",
  PROMO_CODE_MINIMUM_NOT_MET:
    "Your order does not meet the minimum subtotal for this promo code.",
  PROMO_CODE_USAGE_LIMIT_REACHED:
    "This promo code has reached its usage limit.",
  PROMO_CODE_USER_LIMIT_REACHED:
    "You have reached the usage limit for this promo code.",
  CART_EMPTY: "Your cart is empty.",
  INVENTORY_NOT_FOUND: "The selected product option is unavailable.",
  INVALID_QUANTITY: "Please enter a valid quantity.",
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Session Timeout. Please login again.",
    },
    { status: 401 },
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

export async function POST(request: Request) {
  try {
    const session = await requireUser();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json();
    const parsed = promoPreviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid promo request.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const input = parsed.data;

    const result = await previewCheckoutPromoService(
      session.user.id,
      input.code,
      input.mode === "DIRECT"
        ? {
            mode: "DIRECT",
            variantSizeId: input.variantSizeId,
            quantity: input.quantity,
            includeCart: input.includeCart ?? false,
          }
        : {
            mode: "CART",
          },
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (error instanceof Error) {
      const message = error.message;

      if (promoErrorMessages[message]) {
        return NextResponse.json(
          {
            success: false,
            error: promoErrorMessages[message],
            code: message,
          },
          { status: 400 },
        );
      }

      if (message.startsWith("PRODUCT_UNAVAILABLE:")) {
        return NextResponse.json(
          {
            success: false,
            error: "One or more products in your checkout are unavailable.",
            code: "PRODUCT_UNAVAILABLE",
          },
          { status: 400 },
        );
      }

      if (message.startsWith("PROMO_CODE_")) {
        return NextResponse.json(
          {
            success: false,
            error: "This promo code could not be applied.",
            code: message,
          },
          { status: 400 },
        );
      }
    }

    console.error("Checkout promo preview error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to validate the promo code right now.",
      },
      { status: 500 },
    );
  }
}
