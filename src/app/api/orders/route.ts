import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  prisma,
} from "@/lib/prisma";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

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

export async function GET(
  request: NextRequest,
) {
  try {
    const session =
      await requireUser();

    const search =
      request.nextUrl.searchParams
        .get("search")
        ?.trim() ?? "";

    const status =
      request.nextUrl.searchParams.get(
        "status",
      );

    const paymentStatus =
      request.nextUrl.searchParams.get(
        "paymentStatus",
      );

    const paymentMethod =
      request.nextUrl.searchParams.get(
        "paymentMethod",
      );

    const where = {
      userId:
        session.user.id,

      ...(status &&
      status !== "ALL"
        ? {
            status:
              status as
                | "PENDING"
                | "PROCESSING"
                | "SHIPPED"
                | "DELIVERED"
                | "CANCELLED",
          }
        : {}),

      ...(paymentStatus &&
      paymentStatus !== "ALL"
        ? {
            paymentStatus:
              paymentStatus as
                | "PENDING"
                | "PAID"
                | "FAILED",
          }
        : {}),

      ...(paymentMethod &&
      paymentMethod !== "ALL"
        ? {
            paymentMethod:
              paymentMethod as
                | "WALLET"
                | "CRYPTO",
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                orderNumber: {
                  contains:
                    search,

                  mode:
                    "insensitive" as const,
                },
              },

              {
                cryptoDeposit: {
                  reference: {
                    contains:
                      search,

                    mode:
                      "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const orders =
      await prisma.order.findMany({
        where,

        orderBy: {
          createdAt:
            "desc",
        },

        include: {
          cryptoDeposit: {
            include: {
              depositMethod: {
                select: {
                  id: true,

                  name: true,

                  symbol: true,

                  network: true,

                  iconKey: true,
                },
              },
            },
          },

          items: {
            orderBy: {
              createdAt:
                "asc",
            },

            include: {
product: {
  select: {
    id: true,
    name: true,
    slug: true,
    images: {
      where: {
        isPrimary: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      take: 1,
      select: {
        imageKey: true,
      },
    },
  },
},

variantSize: {
  select: {
    variant: {
      select: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            imageKey: true,
            isPrimary: true,
          },
        },
      },
    },
  },
},
            },
          },
        },
      });

    const data =
      orders.map(
        (order) => ({
          id: order.id,

          orderNumber:
            order.orderNumber,

          subtotal:
            order.subtotal.toString(),

          discount:
            order.discount.toString(),

          total:
            order.total.toString(),

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          status:
            order.status,

          walletTransactionId:
            order.walletTransactionId,

          cryptoDepositId:
            order.cryptoDepositId,

          paidAt:
            order.paidAt?.toISOString() ??
            null,

          createdAt:
            order.createdAt.toISOString(),

          updatedAt:
            order.updatedAt.toISOString(),

          notes:
            order.notes,

          delivery: {
            fullName:
              order.deliveryFullName,

            phoneNumber:
              order.deliveryPhoneNumber,

            alternatePhoneNumber:
              order.deliveryAlternatePhoneNumber,

            addressLine1:
              order.deliveryAddressLine1,

            addressLine2:
              order.deliveryAddressLine2,

            city:
              order.deliveryCity,

            state:
              order.deliveryState,

            country:
              order.deliveryCountry,

            postalCode:
              order.deliveryPostalCode,
          },

          cryptoDeposit:
            order.cryptoDeposit
              ? {
                  id:
                    order.cryptoDeposit
                      .id,

                  reference:
                    order.cryptoDeposit
                      .reference,

                  amount:
                    order.cryptoDeposit.amount.toString(),

                  receiptUrl:
                    order.cryptoDeposit
                      .receiptUrl,

                  status:
                    order.cryptoDeposit
                      .status,

                  depositMethod: {
                    id:
                      order.cryptoDeposit
                        .depositMethod
                        .id,

                    name:
                      order.cryptoDeposit
                        .depositMethod
                        .name,

                    symbol:
                      order.cryptoDeposit
                        .depositMethod
                        .symbol,

                    network:
                      order.cryptoDeposit
                        .depositMethod
                        .network,

                    iconKey:
                      order.cryptoDeposit
                        .depositMethod
                        .iconKey,
                  },
                }
              : null,

          items:
            order.items.map(
              (item) => ({
                id:
                  item.id,

                productId:
                  item.productId,

                variantSizeId:
                  item.variantSizeId,

                quantity:
                  item.quantity,

                unitPrice:
                  item.unitPrice.toString(),

                totalPrice:
                  item.totalPrice.toString(),

                selectedColor:
                  item.selectedColor,

                selectedSize:
                  item.selectedSize,

product: {
  id:
    item.product?.id ??
    null,

  name:
    item.product?.name ??
    "Deleted Product",

  slug:
    item.product?.slug ??
    null,

  primaryImage:
    (
      item.variantSize?.variant.images.find(
        (image) =>
          image.isPrimary,
      ) ??
      item.variantSize?.variant.images[0]
    )
      ? getCloudinaryImageUrl(
          (
            item.variantSize?.variant.images.find(
              (image) =>
                image.isPrimary,
            ) ??
            item.variantSize?.variant.images[0]
          )!.imageKey,
        )
      : item.product?.images[0]
        ? getCloudinaryImageUrl(
            item.product.images[0]
              .imageKey,
          )
        : null,
},
              }),
            ),
        }),
      );

    return NextResponse.json({
      success: true,

      data,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "User orders GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load orders.",
      },
      {
        status: 500,
      },
    );
  }
}