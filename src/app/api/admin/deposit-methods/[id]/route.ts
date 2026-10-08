import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import {
  depositMethodSchema,
} from "@/lib/validation/deposit-method";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

function forbiddenResponse() {
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

function handleAuthError(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function PUT(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body: unknown =
      await request.json();

    const parsed =
      depositMethodSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid deposit method",
      fieldErrors: parsed.error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}

    const existingMethod =
      await prisma.depositMethod.findUnique({
        where: {
          id,
        },
      });

    if (!existingMethod) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit method not found",
        },
        {
          status: 404,
        },
      );
    }

    const data = parsed.data;

        const duplicate =
      await prisma.depositMethod.findFirst({
        where: {
          id: {
            not: id,
          },
          symbol: data.symbol,
          network: data.network,
        },
      });

    if (duplicate) {
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
      await prisma.depositMethod.update({
        where: {
          id,
        },
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
        status: 200,
      },
    );
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Failed to update deposit method:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update deposit method",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const existingMethod =
      await prisma.depositMethod.findUnique({
        where: {
          id,
        },
      });

    if (!existingMethod) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit method not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.depositMethod.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Deposit method deleted successfully",
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

    console.error(
      "Failed to delete deposit method:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete deposit method",
      },
      {
        status: 500,
      },
    );
  }
}