import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

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

    phone: buyer.phone,

    email:
      buyer.email,

    createdAt:
      buyer.createdAt.toISOString(),

    updatedAt:
      buyer.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    await requireAdmin();

    const buyers =
      await prisma.affiliateTestBuyer.findMany({
        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json({
      success: true,

      data: buyers.map(
        serializeBuyer,
      ),
    });
  } catch (error) {
    console.error(
      "Failed to fetch affiliate test buyers:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch test buyers.",
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
    await requireAdmin();

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

    const buyer =
      await prisma.affiliateTestBuyer.create({
        data: {
          name,

          imageKey,

          phone,

          email,
        },
      });

    return NextResponse.json(
      {
        success: true,

        data:
          serializeBuyer(
            buyer,
          ),

        message:
          "Test buyer created successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create affiliate test buyer:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to create test buyer.",
      },
      {
        status: 500,
      },
    );
  }
}