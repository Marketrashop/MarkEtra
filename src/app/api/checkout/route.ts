import {
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  prisma,
} from "@/lib/prisma";

import {
  getCart,
} from "@/components/Cart/cart.service";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import {
  createCheckoutOrderService,
} from "@/services/order.service";

import {
  checkoutSchema,
} from "@/validation/checkout.validation";

import {
  buildOrderConfirmationEmail,
  sendMail,
} from "@/mail";

import {
  MAIL_CONFIG,
} from "@/mail/config";

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

  return null;
}

export async function GET() {
  try {
    const session =
      await requireUser();

    const userId =
      session.user.id;

    const [
      cart,
      addresses,
      wallet,
      depositMethods,
    ] = await Promise.all([
      getCart(),

      prisma.address.findMany({
        where: {
          userId,
        },

        orderBy: [
          {
            isPrimary: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),

      prisma.wallet.findUnique({
        where: {
          userId,
        },

        select: {
          availableBalance:
            true,
        },
      }),

      prisma.depositMethod.findMany({
        where: {
          isActive: true,
        },

        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],

        select: {
          id: true,

          name: true,

          symbol: true,

          walletAddress:
            true,

          network: true,

          instructions:
            true,

          iconKey: true,

          qrCodeKey: true,

          minimumAmount: true,

          maximumAmount: true,
        },
      }),
    ]);

    const mappedDepositMethods =
      depositMethods.map(
        (method) => ({
          id: method.id,

          name: method.name,

          symbol:
            method.symbol,

          address:
            method.walletAddress,

          icon:
            getCloudinaryImageUrl(
              method.iconKey,
            ) ?? "",

          qrCode:
            getCloudinaryImageUrl(
              method.qrCodeKey,
            ) ?? "",
        }),
      );

    const primaryAddress =
      addresses.find(
        (address) =>
          address.isPrimary,
      ) ?? null;

    return NextResponse.json({
      success: true,

      data: {
        cart,

        addresses,

        primaryAddress,

        walletBalance:
          Number(
            wallet?.availableBalance ??
              0,
          ),

        depositMethods:
          mappedDepositMethods,
      },
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Checkout GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load checkout.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const session =
      await requireUser();

    const body =
      await request.json();

    const parsed =
      checkoutSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid checkout details.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const checkoutResult =
      await createCheckoutOrderService(
        session.user.id,
        parsed.data,
      );

    try {
      const createdOrder =
        await prisma.order.findUnique({
          where: {
            id: checkoutResult.order.id,
          },

          include: {
            user: {
              select: {
                firstName: true,
                email: true,
              },
            },

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

      if (createdOrder) {
        const deliveryAddress = [
          createdOrder.deliveryAddressLine1,
          createdOrder.deliveryAddressLine2,
          createdOrder.deliveryCity,
          createdOrder.deliveryState,
          createdOrder.deliveryCountry,
          createdOrder.deliveryPostalCode,
        ]
          .filter(Boolean)
          .join(", ");

        const orderEmail = buildOrderConfirmationEmail({
          firstName: createdOrder.user.firstName,
          orderNumber: createdOrder.orderNumber,
          total: createdOrder.total.toString(),
          paymentMethod:
            createdOrder.paymentMethod === "CRYPTO"
              ? "Crypto"
              : "Wallet",
          deliveryAddress,

          items: createdOrder.items.map((item) => ({
            name: item.product?.name ?? "Deleted Product",
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: item.totalPrice.toString(),
            imageUrl: getCloudinaryImageUrl(
              item.product?.images[0]?.imageKey,
            ),
          })),

          orderUrl: new URL(
            `/orders?order=${encodeURIComponent(
              createdOrder.orderNumber,
            )}`,
            MAIL_CONFIG.appUrl,
          ).toString(),
        });

        await sendMail({
          to: createdOrder.user.email,
          subject: orderEmail.subject,
          html: orderEmail.html,
          text: orderEmail.text,
        });
      }
    } catch (emailError) {
      console.error(
        "Failed to send order confirmation email:",
        emailError,
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          parsed.data.paymentMethod ===
          "WALLET"
            ? "Order placed successfully."
            : "Payment submitted for review.",

        data: {
          order: {
            id:
              checkoutResult
                .order.id,

            orderNumber:
              checkoutResult
                .order
                .orderNumber,

            paymentMethod:
              checkoutResult
                .order
                .paymentMethod,

            paymentStatus:
              checkoutResult
                .order
                .paymentStatus,

            status:
              checkoutResult
                .order.status,

            total:
              checkoutResult
                .order.total.toString(),
          },
        },
      },
      {
        status: 201,
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
        case "CART_EMPTY":
          return NextResponse.json(
            {
              success: false,
              error:
                "Your cart is empty.",
            },
            {
              status: 400,
            },
          );

        case "ADDRESS_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Selected delivery address could not be found.",
            },
            {
              status: 404,
            },
          );

        case "WALLET_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Wallet not found.",
            },
            {
              status: 404,
            },
          );

        case "INSUFFICIENT_WALLET_BALANCE":
          return NextResponse.json(
            {
              success: false,
              error:
                "Your wallet balance is insufficient for this order.",
            },
            {
              status: 400,
            },
          );

        case "DEPOSIT_METHOD_REQUIRED":
          return NextResponse.json(
            {
              success: false,
              error:
                "Crypto payment method is required.",
            },
            {
              status: 400,
            },
          );

        case "DEPOSIT_METHOD_UNAVAILABLE":
          return NextResponse.json(
            {
              success: false,
              error:
                "The selected crypto payment method is no longer available.",
            },
            {
              status: 400,
            },
          );

        case "RECEIPT_REQUIRED":
          return NextResponse.json(
            {
              success: false,
              error:
                "A successful payment receipt upload is required.",
            },
            {
              status: 400,
            },
          );

        case "ORDER_TOTAL_BELOW_MINIMUM_DEPOSIT":
          return NextResponse.json(
            {
              success: false,
              error:
                "The order total is below the minimum amount supported by the selected payment method.",
            },
            {
              status: 400,
            },
          );

        case "ORDER_TOTAL_ABOVE_MAXIMUM_DEPOSIT":
          return NextResponse.json(
            {
              success: false,
              error:
                "The order total exceeds the maximum amount supported by the selected payment method.",
            },
            {
              status: 400,
            },
          );

        case "INVENTORY_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "One or more products are no longer available.",
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
                "One or more products no longer have enough stock.",
            },
            {
              status: 409,
            },
          );

        case "ORDER_NOT_FOUND_AFTER_CREATION":
          return NextResponse.json(
            {
              success: false,
              error:
                "Order was created, but its confirmation details could not be loaded.",
            },
            {
              status: 500,
            },
          );

        default:
          break;
      }
    }

    console.error(
      "Checkout POST error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to place order.",
      },
      {
        status: 500,
      },
    );
  }
}