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

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      orderReference: string;
    }>;
  },
) {
  try {
    const session = await requireUser();

    const { orderReference } = await params;

    const reference = orderReference.trim();

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "An order reference is required.",
        },
        {
          status: 400,
        },
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: reference,
        userId: session.user.id,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        subtotal: true,
        discount: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        paidAt: true,

        deliveryFullName: true,
        deliveryPhoneNumber: true,
        deliveryAlternatePhoneNumber: true,
        deliveryAddressLine1: true,
        deliveryAddressLine2: true,
        deliveryCity: true,
        deliveryState: true,
        deliveryCountry: true,
        deliveryPostalCode: true,

        items: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            selectedColor: true,
            selectedSize: true,

            product: {
              select: {
                name: true,
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

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        {
          status: 404,
        },
      );
    }

    const data = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,

      subtotal: order.subtotal.toString(),
      discount: order.discount.toString(),
      total: order.total.toString(),

      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt?.toISOString() ?? null,

      delivery: {
        fullName: order.deliveryFullName,
        phoneNumber: order.deliveryPhoneNumber,
        alternatePhoneNumber:
          order.deliveryAlternatePhoneNumber,
        addressLine1: order.deliveryAddressLine1,
        addressLine2: order.deliveryAddressLine2,
        city: order.deliveryCity,
        state: order.deliveryState,
        country: order.deliveryCountry,
        postalCode: order.deliveryPostalCode,
      },

      items: order.items.map((item) => {
        const variantImages =
          item.variantSize?.variant.images ?? [];

        const selectedVariantImage =
          variantImages.find((image) => image.isPrimary) ??
          variantImages[0];

        const imageKey =
          selectedVariantImage?.imageKey ??
          item.product?.images[0]?.imageKey ??
          null;

        return {
          id: item.id,
          name: item.product?.name ?? "Deleted Product",
          image: imageKey
            ? getCloudinaryImageUrl(imageKey)
            : null,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        };
      }),
    };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    const authError = handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Order tracking GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load order tracking information.",
      },
      {
        status: 500,
      },
    );
  }
}