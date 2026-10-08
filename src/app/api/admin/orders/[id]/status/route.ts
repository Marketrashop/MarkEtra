import { NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/admin";

import {
  OrderStatus,
} from "@/../generated/prisma/client";

import {
  buildOrderCancellationEmail,
  buildOrderStatusUpdatedEmail,
  sendMail,
} from "@/mail";

import {
  MAIL_CONFIG,
} from "@/mail/config";

import {
  cancelOrderService,
} from "@/services/order.service";

import { getCloudinaryImageUrl } from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const updateOrderStatusSchema =
  z.object({
    status: z.nativeEnum(
      OrderStatus,
    ),
  });

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Session Timeout. Please login again.",
    },
    {
      status: 401,
    },
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Admin access required.",
    },
    {
      status: 403,
    },
  );
}

function handleAuthError(
  error: unknown,
) {
  if (
    error instanceof Error &&
    error.message ===
      "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  if (
    error instanceof Error &&
    error.message ===
      "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireAdmin();

    const { id } =
      await params;

    const body: unknown =
      await request.json();

    const parsed =
      updateOrderStatusSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid order status.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const nextStatus =
      parsed.data.status;

    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          orderNumber: true,
          userId: true,
          status: true,
          paymentStatus: true,
          total: true,

          user: {
            select: {
              firstName: true,
              email: true,
            },
          },
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order not found.",
        },
        {
          status: 404,
        },
      );
    }

if (
  order.status ===
    OrderStatus.CANCELLED &&
  nextStatus !==
    OrderStatus.CANCELLED
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Cancelled orders cannot be moved to another status.",
    },
    {
      status: 409,
    },
  );
}

    if (
      nextStatus ===
      OrderStatus.CANCELLED
    ) {
      const result =
        await cancelOrderService(
          id,
          {
            type: "ADMIN",
            adminId:
              session.user.id,
          },
        );

      if (!result.alreadyCancelled) {
        try {
          const orderUrl = new URL(
            `/orders?order=${encodeURIComponent(order.orderNumber)}`,
            MAIL_CONFIG.appUrl,
          ).toString();

          const orderWithItems = await prisma.order.findUnique({
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
          });

          const cancellationEmail = buildOrderCancellationEmail({
            firstName: order.user.firstName,
            orderNumber: order.orderNumber,
            total: order.total.toString(),
            walletCredited: result.walletCredited,
            orderUrl,
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
            to: order.user.email,
            subject: cancellationEmail.subject,
            html: cancellationEmail.html,
            text: cancellationEmail.text,
          });
        } catch (emailError) {
          console.error(
            "Failed to send order cancellation email:",
            emailError,
          );
        }
      }

      try {
        await prisma.notification.create({
          data: {
            userId:
              order.userId,

            type:
              "SYSTEM",

            title:
              "Order Cancelled",

            message:
              `Your order ${order.orderNumber} has been cancelled.`,
          },
        });
      } catch (notificationError) {
        console.error(
          "Failed to create order cancellation notification:",
          notificationError,
        );
      }

      try {
        await prisma.activityLog.create({
          data: {
            adminId:
              session.user.id,

            action:
              "ORDER_STATUS_UPDATED",

            entity:
              "Order",

            entityId:
              order.id,

            description:
              `Cancelled order ${order.orderNumber} from ${formatStatus(
                order.status,
              )} to Cancelled.`,
          },
        });
      } catch (activityError) {
        console.error(
          "Failed to create order cancellation activity log:",
          activityError,
        );
      }

      return NextResponse.json(
        {
          success: true,

          message:
            result.alreadyCancelled
              ? "Order is already cancelled."
              : "Order cancelled successfully.",

          data: {
            order:
              result.order,

            alreadyCancelled:
              result.alreadyCancelled,

            walletCredited:
              result.walletCredited,
          },
        },
        {
          status: 200,
        },
      );
    }

    /*
     * NORMAL DELIVERY STATUS CHANGES
     *
     * These remain restricted to paid orders.
     */
    if (
      order.paymentStatus !==
      "PAID"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order payment must be approved before its delivery status can be changed.",
        },
        {
          status: 409,
        },
      );
    }

    const updatedOrder =
      await prisma.order.update({
        where: {
          id,
        },

        data: {
          status:
            nextStatus,
        },

        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          updatedAt: true,
        },
      });

    const previousStatus =
      formatStatus(
        order.status,
      );

    const updatedStatus =
      formatStatus(
        nextStatus,
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            order.userId,

          type:
            "SYSTEM",

          title:
            `Order ${updatedStatus}`,

          message:
            `Your order ${order.orderNumber} is now ${updatedStatus.toLowerCase()}.`,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create order status notification:",
        notificationError,
      );
    }

    try {
      await prisma.activityLog.create({
        data: {
          adminId:
            session.user.id,

          action:
            "ORDER_STATUS_UPDATED",

          entity:
            "Order",

          entityId:
            order.id,

          description:
            `Updated order ${order.orderNumber} status from ${previousStatus} to ${updatedStatus}.`,
        },
      });
    } catch (activityError) {
      console.error(
        "Failed to create order status activity log:",
        activityError,
      );
    }

    try {
      const orderUrl =
        new URL(
          `/orders?order=${encodeURIComponent(
            order.orderNumber,
          )}`,
          MAIL_CONFIG.appUrl,
        ).toString();

      const statusEmail =
        buildOrderStatusUpdatedEmail({
          firstName:
            order.user.firstName,

          orderNumber:
            order.orderNumber,

          status:
            nextStatus,

          orderUrl,
        });

      await sendMail({
        to:
          order.user.email,

        subject:
          statusEmail.subject,

        html:
          statusEmail.html,

        text:
          statusEmail.text,
      });
    } catch (emailError) {
      console.error(
        "Failed to send order status email:",
        emailError,
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Order status updated successfully.",

        data: updatedOrder,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    if (
      error instanceof Error
    ) {
      switch (
        error.message
      ) {
        case "ORDER_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Order not found.",
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
                "Delivered orders cannot be cancelled.",
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
                "This order cannot be cancelled.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_INVENTORY_ALLOCATION_INVALID":
          return NextResponse.json(
            {
              success: false,
              error:
                "This order has an invalid inventory allocation and cannot be cancelled safely.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_INVENTORY_VARIANT_MISSING":
          return NextResponse.json(
            {
              success: false,
              error:
                "A product variant required for this cancellation could not be found.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_INVENTORY_STATE_INVALID":
          return NextResponse.json(
            {
              success: false,
              error:
                "The inventory state prevents this order from being cancelled safely.",
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
                "The customer's wallet could not be found.",
            },
            {
              status: 409,
            },
          );
      }
    }

    console.error(
      "Admin order status update error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update order status.",
      },
      {
        status: 500,
      },
    );
  }
}

function formatStatus(
  status: OrderStatus,
) {
  return status
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (
        character: string,
      ) =>
        character.toUpperCase(),
    );
}