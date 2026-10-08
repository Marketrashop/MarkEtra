import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const session = await requireUser();

    const [wallet, deposits] = await Promise.all([
      prisma.wallet.findUnique({
        where: {
          userId: session.user.id,
        },

        select: {
          availableBalance: true,
          lockedBalance: true,
        },
      }),

      prisma.deposit.findMany({
        where: {
          userId: session.user.id,
        },

        include: {
          depositMethod: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      wallet,
      data: deposits,
    });
  } catch (error) {
    const authError = handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load deposits.",
      },
      {
        status: 500,
      },
    );
  }
}