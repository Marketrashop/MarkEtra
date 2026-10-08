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
    }
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "You do not have permission to perform this action.",
    },
    {
      status: 403,
    }
  );
}

function handleAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return null;
  }

  if (error.message === "UNAUTHENTICATED") {
    return unauthorizedResponse();
  }

  if (error.message === "FORBIDDEN") {
    return forbiddenResponse();
  }

  return null;
}

export async function GET() {
  try {
    await requireAdmin();

    const submissions =
      await prisma.kycVerification.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phoneNumber: true,
            },
          },
        },

        orderBy: {
          submittedAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load KYC submissions.",
      },
      {
        status: 500,
      }
    );
  }
}