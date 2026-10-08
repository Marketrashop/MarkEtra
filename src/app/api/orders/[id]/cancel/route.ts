import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import {
  buildOrderCancellationEmail,
  sendMail,
} from "@/mail";
import { cancelOrderService } from "@/services/order.service";

import { getCloudinaryImageUrl } from "@/lib/cloudinary";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Session Timeout. Please login again.",
    },
    {
      status: 401,
    },
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
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const session = await requireUser();

    const { id } = await context.params;

    const result = await cancelOrderService(id, {
      type: "USER",
      userId: session.user.id,
    });

    if (!result.alreadyCancelled) {
      try {
        const [user, orderWithItems] = await Promise.all([
          prisma.user.findUnique({
            where: {
              id: session.user.id,
            },
            select: {
              firstName: true,
              email: true,
            },
          }),

          prisma.order.findUnique({
            where: {
              id,
            },
            select: {
              items: {
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  quantity: true,
                  unitPrice: true,
                  totalPrice: true,
                  product: {
                    select: {
                      name: true,
                      images: {
                        orderBy: [
                          { isPrimary: "desc" },
                          { sortOrder: "asc" },
                        ],
                        take: 1,
                        select: {
                          imageKey: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
        ]);

        if (user) {
          const cancellationEmail = buildOrderCancellationEmail({
            firstName: user.firstName,
            orderNumber: result.order.orderNumber,
            total: result.order.total.toString(),
            walletCredited: result.walletCredited,
            cancelledAt: new Date(),
            items: (orderWithItems?.items ?? []).map((item) => ({
              name: item.product?.name ?? "Deleted Product",
              quantity: item.quantity,
              unitPrice: item.unitPrice.toString(),
              totalPrice: item.totalPrice.toString(),
              imageUrl: getCloudinaryImageUrl(
                item.product?.images[0]?.imageKey,
              ),
            })),
          });

          await sendMail({
            to: user.email,
            subject: cancellationEmail.subject,
            text: cancellationEmail.text,
            html: cancellationEmail.html,
          });
        }
      } catch (emailError) {
        console.error(
          "Failed to send order cancellation email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order: result.order,
        alreadyCancelled: result.alreadyCancelled,
        walletCredited: result.walletCredited,
      },
    });
  } catch (error) {
    const authError = handleAuthError(error);

    if (authError) {
      return authError;
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "ORDER_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error: "Order not found.",
            },
            {
              status: 404,
            },
          );

        case "ORDER_ALREADY_DELIVERED":
          return NextResponse.json(
            {
              success: false,
              error:
                "This order has already been delivered and cannot be cancelled.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_CANCELLATION_NOT_ALLOWED":
          return NextResponse.json(
            {
              success: false,
              error:
                "This order can no longer be cancelled.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_CANCELLATION_WINDOW_EXPIRED":
          return NextResponse.json(
            {
              success: false,
              error:
                "The 2-hour cancellation window for this order has expired.",
            },
            {
              status: 409,
            },
          );

        case "INVENTORY_NOT_FOUND":
        case "INVALID_ORDER_INVENTORY_ALLOCATION":
        case "INVENTORY_REVERSAL_CONFLICT":
          return NextResponse.json(
            {
              success: false,
              error:
                "Unable to cancel this order because its inventory could not be safely restored.",
            },
            {
              status: 409,
            },
          );

        case "WALLET_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Unable to process the cancellation because the wallet could not be found.",
            },
            {
              status: 409,
            },
          );
      }
    }

    console.error(
      "User order cancellation error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to cancel order.",
      },
      {
        status: 500,
      },
    );
  }
}