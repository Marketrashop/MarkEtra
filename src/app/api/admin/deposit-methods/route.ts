import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import {
  depositMethodSchema,
} from "@/lib/validation/deposit-method";

export async function GET() {
  try {
    await requireAdmin();

    const methods =
      await prisma.depositMethod.findMany({
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return NextResponse.json(
      {
        success: true,
        data: methods,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
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

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    console.error(
      "Failed to fetch deposit methods:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch deposit methods",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body: unknown =
      await request.json();

    const parsed =
      depositMethodSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid deposit method",
          fieldErrors:
            parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const data = parsed.data;

    const existing =
      await prisma.depositMethod.findUnique({
        where: {
          symbol_network: {
            symbol: data.symbol,
            network: data.network,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A deposit method with this symbol and network already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const method =
      await prisma.depositMethod.create({
data: {
  name: data.name,
  symbol: data.symbol,
  network: data.network,
  walletAddress: data.walletAddress,

  instructions: `Send only ${data.symbol} to this address. Deposits sent on the wrong network are unrecoverable.`,
  minimumAmount: 20,
  maximumAmount: null,

  displayOrder: data.displayOrder,
  isActive: data.isActive,
  iconKey: data.iconKey ?? null,
  qrCodeKey: data.qrCodeKey ?? null,
},
});

    return NextResponse.json(
      {
        success: true,
        data: method,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
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

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    console.error(
      "Failed to create deposit method:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create deposit method",
      },
      {
        status: 500,
      },
    );
  }
}