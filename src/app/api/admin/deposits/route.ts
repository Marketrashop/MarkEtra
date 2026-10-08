import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

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

export async function GET() {
  try {
    await requireAdmin();

const deposits =
  await prisma.deposit.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },

      depositMethod: {
        select: {
          id: true,
          name: true,
          symbol: true,
          network: true,
          iconKey: true,
          walletAddress: true,
        },
      },

      reviewer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

    return NextResponse.json(
      {
        success: true,
        data: deposits,
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
      "Failed to fetch deposits:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch deposits",
      },
      {
        status: 500,
      },
    );
  }
}