import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import type {
  Prisma,
} from "../../../../../generated/prisma/client";

import {
  requireAdmin,
} from "@/lib/auth/admin";

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

const orderInclude = {
user: {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    avatarKey: true,
  },
},

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
    include: {
      product: {
        select: {
          id: true,
          name: true,

          images: {
            where: {
              isPrimary: true,
            },

            orderBy: {
              sortOrder:
                "asc",
            },

            take: 1,

            select: {
              imageKey:
                true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt:
        "asc",
    },
  },
} satisfies Prisma.OrderInclude;

type AdminOrderRecord =
  Prisma.OrderGetPayload<{
    include:
      typeof orderInclude;
  }>;

function mapOrder(
  order: AdminOrderRecord,
) {
  return {
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

    paidAt:
      order.paidAt?.toISOString() ??
      null,

    createdAt:
      order.createdAt.toISOString(),

    updatedAt:
      order.updatedAt.toISOString(),

    notes:
      order.notes,

    deliveryFullName:
      order.deliveryFullName,

    deliveryPhoneNumber:
      order.deliveryPhoneNumber,

    deliveryAlternatePhoneNumber:
      order.deliveryAlternatePhoneNumber,

    deliveryAddressLine1:
      order.deliveryAddressLine1,

    deliveryAddressLine2:
      order.deliveryAddressLine2,

    deliveryCity:
      order.deliveryCity,

    deliveryState:
      order.deliveryState,

    deliveryCountry:
      order.deliveryCountry,

    deliveryPostalCode:
      order.deliveryPostalCode,

user: {
  id:
    order.user.id,

  firstName:
    order.user.firstName,

  lastName:
    order.user.lastName,

  email:
    order.user.email,

  avatarKey:
    order.user.avatarKey,
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

productName:
  item.product?.name ??
  "Deleted Product",

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

primaryImage:
  item.product?.images[0]
    ? getCloudinaryImageUrl(
        item.product.images[0]
          .imageKey,
      )
    : null,
        }),
      ),
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const search =
      request.nextUrl.searchParams
        .get("search")
        ?.trim() ?? "";

    const paymentMethod =
      request.nextUrl.searchParams.get(
        "paymentMethod",
      );

    const paymentStatus =
      request.nextUrl.searchParams.get(
        "paymentStatus",
      );

    const status =
      request.nextUrl.searchParams.get(
        "status",
      );

    const where:
      Prisma.OrderWhereInput =
      {};

    if (
      paymentMethod &&
      paymentMethod !== "ALL"
    ) {
      where.paymentMethod =
        paymentMethod as
          | "WALLET"
          | "CRYPTO";
    }

    if (
      paymentStatus &&
      paymentStatus !== "ALL"
    ) {
      where.paymentStatus =
        paymentStatus as
          | "PENDING"
          | "PAID"
          | "FAILED";
    }

    if (
      status &&
      status !== "ALL"
    ) {
      where.status =
        status as
          | "PENDING"
          | "PROCESSING"
          | "SHIPPED"
          | "DELIVERED"
          | "CANCELLED";
    }

    if (search) {
      where.OR = [
        {
          orderNumber: {
            contains:
              search,
            mode:
              "insensitive",
          },
        },

        {
          user: {
            firstName: {
              contains:
                search,
              mode:
                "insensitive",
            },
          },
        },

        {
          user: {
            lastName: {
              contains:
                search,
              mode:
                "insensitive",
            },
          },
        },

        {
          user: {
            email: {
              contains:
                search,
              mode:
                "insensitive",
            },
          },
        },

        {
          cryptoDeposit: {
            reference: {
              contains:
                search,
              mode:
                "insensitive",
            },
          },
        },
      ];
    }

    const orders =
      await prisma.order.findMany({
        where,

        orderBy: {
          createdAt:
            "desc",
        },

        include:
          orderInclude,
      });

    return NextResponse.json({
      success: true,

      data: orders.map(
        mapOrder,
      ),
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Admin orders GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch orders.",
      },
      {
        status: 500,
      },
    );
  }
}