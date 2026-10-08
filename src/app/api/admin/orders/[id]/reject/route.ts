import { NextResponse } from "next/server";

import { z } from "zod";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  buildOrderPaymentRejectedEmail,
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

const rejectOrderSchema =
  z.object({
    adminNote: z
      .string()
      .trim()
      .min(
        1,
        "A rejection reason is required.",
      )
      .max(1000),
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

export async function POST(
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
      rejectOrderSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid rejection reason.",
          fieldErrors:
            parsed.error
              .flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },

select: {
  id: true,
  orderNumber: true,
  userId: true,
  paymentMethod: true,
  paymentStatus: true,
  cryptoDepositId:
    true,
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
      order.paymentMethod !==
      "CRYPTO"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only crypto orders require payment rejection.",
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

    const updatedOrder =
      await prisma.$transaction(
        async (tx) => {
          const currentOrder =
            await tx.order.findUnique({
              where: {
                id,
              },

              select: {
                paymentMethod:
                  true,

                paymentStatus:
                  true,

                cryptoDepositId:
                  true,
              },
            });

          if (
            !currentOrder
          ) {
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
            currentOrder.cryptoDepositId
          ) {
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
                  "REJECTED",

                reviewNote:
                  parsed.data
                    .adminNote,

                reviewedAt:
                  new Date(),

                reviewedById:
                  session.user.id,
              },
            });
          } else {
            throw new Error(
              "CRYPTO_DEPOSIT_NOT_FOUND",
            );
          }

          return tx.order.update({
            where: {
              id,
            },

            data: {
              paymentStatus:
                "FAILED",

              status:
                "CANCELLED",

              notes:
                parsed.data
                  .adminNote,
            },
          });
        },
        {
          timeout:
            15000,
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            order.userId,

          type:
            "SYSTEM",

          title:
            "Order Payment Rejected",

          message:
            `Your crypto payment for order ${order.orderNumber} was rejected. Reason: ${parsed.data.adminNote}`,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create order rejection notification:",
        notificationError,
      );
    }

    try {
      await prisma.activityLog.create({
        data: {
          adminId:
            session.user.id,

          action:
            "ORDER_PAYMENT_REJECTED",

          entity:
            "Order",

          entityId:
            order.id,

          description:
            `Rejected crypto payment for order ${order.orderNumber}. Reason: ${parsed.data.adminNote}`,
        },
      });
    } catch (activityError) {
      console.error(
        "Failed to create order rejection activity log:",
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

  const rejectionEmail =
    buildOrderPaymentRejectedEmail({
      firstName:
        order.user.firstName,

      orderNumber:
        order.orderNumber,

      reason:
        parsed.data.adminNote,

      orderUrl,
    });

  await sendMail({
    to:
      order.user.email,

    subject:
      rejectionEmail.subject,

    html:
      rejectionEmail.html,

    text:
      rejectionEmail.text,
  });
} catch (emailError) {
  console.error(
    "Failed to send order payment rejection email:",
    emailError,
  );
}

    return NextResponse.json(
      {
        success: true,

        message:
          "Crypto order payment rejected.",

        data: {
          id:
            updatedOrder.id,

          orderNumber:
            updatedOrder.orderNumber,

          paymentStatus:
            updatedOrder.paymentStatus,

          status:
            updatedOrder.status,

          notes:
            updatedOrder.notes,
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
                "Only crypto orders require payment rejection.",
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
      "Admin crypto order rejection error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to reject order payment.",
      },
      {
        status: 500,
      },
    );
  }
}