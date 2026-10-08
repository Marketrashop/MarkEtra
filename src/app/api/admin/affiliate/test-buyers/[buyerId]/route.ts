import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

type RouteContext = {
  params: Promise<{
    buyerId: string;
  }>;
};

function serializeBuyer(
  buyer: {
    id: string;
    name: string;
    imageKey: string | null;
    phone: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
) {
  return {
    id: buyer.id,

    name: buyer.name,

    imageKey:
      buyer.imageKey,

    phone:
      buyer.phone,

    email:
      buyer.email,

    createdAt:
      buyer.createdAt.toISOString(),

    updatedAt:
      buyer.updatedAt.toISOString(),
  };
}

export async function PATCH(
  request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      buyerId,
    } = await params;

    const body =
      await request.json();

    const name =
      typeof body.name ===
        "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone ===
        "string"
        ? body.phone.trim()
        : "";

    const imageKey =
      typeof body.imageKey ===
        "string"
        ? body.imageKey.trim() ||
          null
        : null;

    const email =
      typeof body.email ===
        "string"
        ? body.email.trim() ||
          null
        : null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Buyer name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Buyer phone number is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Enter a valid buyer email address.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.affiliateTestBuyer.findUnique({
        where: {
          id:
            buyerId,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Test buyer not found.",
        },
        {
          status: 404,
        },
      );
    }

    const buyer =
      await prisma.affiliateTestBuyer.update({
        where: {
          id:
            buyerId,
        },

        data: {
          name,

          imageKey,

          phone,

          email,
        },
      });

    return NextResponse.json({
      success: true,

      data:
        serializeBuyer(
          buyer,
        ),

      message:
        "Test buyer updated successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to update affiliate test buyer:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to update test buyer.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      buyerId,
    } = await params;

    const existing =
      await prisma.affiliateTestBuyer.findUnique({
        where: {
          id:
            buyerId,
        },

        select: {
          id: true,

          _count: {
            select: {
              interests: true,
            },
          },
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Test buyer not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      existing._count.interests >
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This test buyer has existing interests and cannot be deleted.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.affiliateTestBuyer.delete({
      where: {
        id:
          buyerId,
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Test buyer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete affiliate test buyer:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to delete test buyer.",
      },
      {
        status: 500,
      },
    );
  }
}