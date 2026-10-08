import { NextResponse } from "next/server";

import { Prisma } from "../../../../../../../generated/prisma/client";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  prisma,
} from "@/lib/prisma";

import {
  buildOrderPaymentApprovedEmail,
  sendMail,
} from "@/mail";

import {
  MAIL_CONFIG,
} from "@/mail/config";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function POST(
  _request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    const session =
      await requireAdmin();

    const { id } =
      await params;

const order =
  await prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
        },
      },

      cryptoDeposit: {
        select: {
          id: true,
          status: true,
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
      order.paymentMethod !==
      "CRYPTO"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only crypto orders require payment approval.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      order.paymentStatus !==
      "PENDING"
    ) {

if (
  order.status ===
  "CANCELLED"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "This order has already been cancelled and cannot be approved.",
    },
    {
      status: 409,
    },
  );
}
      return NextResponse.json(
        {
          success: false,
          error:
            "Order payment has already been reviewed.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      !order.cryptoDeposit
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Crypto payment record not found for this order.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      order.cryptoDeposit.status !==
      "PENDING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The linked crypto payment has already been reviewed.",
        },
        {
          status: 409,
        },
      );
    }

const approveCryptoOrder = async () =>
  prisma.$transaction(
    async (tx) => {
      const currentOrder =
        await tx.order.findUnique({
          where: {
            id,
          },

          select: {
            id: true,
            paymentMethod: true,
            paymentStatus: true,
            status: true,
            cryptoDepositId: true,

            items: {
              select: {
                id: true,
                quantity: true,
                variantSizeId: true,
                stockQuantity: true,
                preorderQuantity: true,
              },
            },
          },
        });

      if (!currentOrder) {
        throw new Error(
          "ORDER_NOT_FOUND",
        );
      }

      if (
        currentOrder.paymentMethod !==
        "CRYPTO"
      ) {
        throw new Error(
          "NOT_CRYPTO_ORDER",
        );
      }

      if (
        currentOrder.paymentStatus !==
        "PENDING"
      ) {
        throw new Error(
          "ORDER_ALREADY_REVIEWED",
        );
      }

      if (
        currentOrder.status ===
        "CANCELLED"
      ) {
        throw new Error(
          "ORDER_CANCELLED",
        );
      }

      if (
        currentOrder.status !==
        "PENDING"
      ) {
        throw new Error(
          "ORDER_STATUS_NOT_APPROVABLE",
        );
      }

      if (
        !currentOrder.cryptoDepositId
      ) {
        throw new Error(
          "CRYPTO_DEPOSIT_NOT_FOUND",
        );
      }

      /*
       * Crypto orders do not reserve/decrement
       * inventory at checkout time.
       *
       * Approval is therefore responsible for
       * performing the exact inventory allocation
       * before the order becomes PAID.
       */
      for (const item of currentOrder.items) {
        if (
          item.quantity <= 0
        ) {
          throw new Error(
            "INVALID_ORDER_QUANTITY",
          );
        }

        if (
          item.stockQuantity !== 0 ||
          item.preorderQuantity !== 0
        ) {
          throw new Error(
            "INVENTORY_ALLOCATION_ALREADY_EXISTS",
          );
        }

        if (
          !item.variantSizeId
        ) {
          throw new Error(
            "INVENTORY_NOT_FOUND",
          );
        }

        const inventory =
          await tx.productVariantSize.findUnique({
            where: {
              id: item.variantSizeId,
            },

            select: {
              id: true,
              stock: true,
              reservedStock: true,
              allowPreorder: true,
            },
          });

        if (!inventory) {
          throw new Error(
            "INVENTORY_NOT_FOUND",
          );
        }

        const availableStock =
          Math.max(
            0,
            inventory.stock -
              inventory.reservedStock,
          );

        const stockQuantity =
          Math.min(
            item.quantity,
            availableStock,
          );

        const preorderQuantity =
          item.quantity -
          stockQuantity;

        if (
          preorderQuantity > 0 &&
          !inventory.allowPreorder
        ) {
          throw new Error(
            "INSUFFICIENT_STOCK",
          );
        }

        if (
          stockQuantity > 0 ||
          preorderQuantity > 0
        ) {
          await tx.productVariantSize.update({
            where: {
              id: inventory.id,
            },

            data: {
              ...(stockQuantity > 0
                ? {
                    stock: {
                      decrement:
                        stockQuantity,
                    },
                  }
                : {}),

              ...(preorderQuantity > 0
                ? {
                    reservedStock: {
                      increment:
                        preorderQuantity,
                    },
                  }
                : {}),
            },
          });
        }

        await tx.orderItem.update({
          where: {
            id: item.id,
          },

          data: {
            stockQuantity,
            preorderQuantity,
          },
        });
      }

      const deposit =
        await tx.deposit.findUnique({
          where: {
            id:
              currentOrder.cryptoDepositId,
          },

          select: {
            status: true,
          },
        });

      if (!deposit) {
        throw new Error(
          "CRYPTO_DEPOSIT_NOT_FOUND",
        );
      }

      if (
        deposit.status !==
        "PENDING"
      ) {
        throw new Error(
          "CRYPTO_DEPOSIT_ALREADY_REVIEWED",
        );
      }

      await tx.deposit.update({
        where: {
          id:
            currentOrder.cryptoDepositId,
        },

        data: {
          status:
            "APPROVED",

          reviewedAt:
            new Date(),

          reviewedById:
            session.user.id,
        },
      });

      return tx.order.update({
        where: {
          id,
        },

        data: {
          paymentStatus:
            "PAID",

          status:
            "PROCESSING",

          paidAt:
            new Date(),
        },
      });
    },

    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,

      maxWait:
        5000,

      timeout:
        15000,
    },
  );

let updatedOrder;

try {
  updatedOrder =
    await approveCryptoOrder();
} catch (error) {
  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "P2034"
  ) {
    updatedOrder =
      await approveCryptoOrder();
  } else {
    throw error;
  }
}

    try {
      await prisma.notification.create({
        data: {
          userId:
            order.user.id,

          type:
            "SYSTEM",

          title:
            "Order Payment Approved",

          message:
            `Your crypto payment for order ${order.orderNumber} has been approved. Your order is now being processed.`,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create order approval notification:",
        notificationError,
      );
    }

    try {
      await prisma.activityLog.create({
        data: {
          adminId:
            session.user.id,

          action:
            "ORDER_PAYMENT_APPROVED",

          entity:
            "Order",

          entityId:
            order.id,

          description:
            `Approved crypto payment for order ${order.orderNumber}.`,
        },
      });
    } catch (activityError) {
      console.error(
        "Failed to create order approval activity log:",
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

  const approvalEmail =
    buildOrderPaymentApprovedEmail({
      firstName:
        order.user.firstName,

      orderNumber:
        order.orderNumber,

      total:
        order.total.toString(),

      orderUrl,
    });

  await sendMail({
    to:
      order.user.email,

    subject:
      approvalEmail.subject,

    html:
      approvalEmail.html,

    text:
      approvalEmail.text,
  });
} catch (emailError) {
  console.error(
    "Failed to send order payment approval email:",
    emailError,
  );
}

    return NextResponse.json(
      {
        success: true,

        message:
          "Crypto order payment approved.",

        data: {
          id:
            updatedOrder.id,

          orderNumber:
            updatedOrder.orderNumber,

          paymentStatus:
            updatedOrder.paymentStatus,

          status:
            updatedOrder.status,

          paidAt:
            updatedOrder.paidAt,
        },
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

case "ORDER_CANCELLED":
  return NextResponse.json(
    {
      success: false,
      error:
        "This order has already been cancelled and cannot be approved.",
    },
    {
      status: 409,
    },
  );

case "ORDER_STATUS_NOT_APPROVABLE":
  return NextResponse.json(
    {
      success: false,
      error:
        "This order is not in a state that can be approved.",
    },
    {
      status: 409,
    },
  );

case "INVENTORY_NOT_FOUND":
  return NextResponse.json(
    {
      success: false,
      error:
        "Inventory record not found for this order.",
    },
    {
      status: 409,
    },
  );

case "INSUFFICIENT_STOCK":
  return NextResponse.json(
    {
      success: false,
      error:
        "There is insufficient stock to approve this crypto order.",
    },
    {
      status: 409,
    },
  );

case "INVALID_ORDER_QUANTITY":
  return NextResponse.json(
    {
      success: false,
      error:
        "This order contains an invalid item quantity.",
    },
    {
      status: 409,
    },
  );

case "INVENTORY_ALLOCATION_ALREADY_EXISTS":
  return NextResponse.json(
    {
      success: false,
      error:
        "Inventory has already been allocated for this order.",
    },
    {
      status: 409,
    },
  );
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

        case "NOT_CRYPTO_ORDER":
          return NextResponse.json(
            {
              success: false,
              error:
                "Only crypto orders require payment approval.",
            },
            {
              status: 400,
            },
          );

        case "ORDER_ALREADY_REVIEWED":
          return NextResponse.json(
            {
              success: false,
              error:
                "Order payment has already been reviewed.",
            },
            {
              status: 409,
            },
          );

        case "CRYPTO_DEPOSIT_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Crypto payment record not found.",
            },
            {
              status: 409,
            },
          );

        case "CRYPTO_DEPOSIT_ALREADY_REVIEWED":
          return NextResponse.json(
            {
              success: false,
              error:
                "The linked crypto payment has already been reviewed.",
            },
            {
              status: 409,
            },
          );

        default:
          break;
      }
    }

    console.error(
      "Admin crypto order approval error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to approve order payment.",
      },
      {
        status: 500,
      },
    );
  }
}