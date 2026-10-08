import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import type { ReviewKycPayload } from "@/components/kyc/kyc.types";

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const record =
      await prisma.kycVerification.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              country: true,
              kycVerified: true,
            },
          },
        },
      });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "KYC record not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: record,
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
          "Unable to load KYC record.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body =
      (await request.json()) as ReviewKycPayload;

    const record =
      await prisma.kycVerification.findUnique({
        where: {
          id,
        },
      });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "KYC record not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      body.action === "reject" &&
      !body.rejectionReason?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rejection reason is required.",
        },
        {
          status: 400,
        }
      );
    }

    const approved =
      body.action === "approve";

    const result =
      await prisma.$transaction(
        async (tx) => {
          const kyc =
            await tx.kycVerification.update({
              where: {
                id,
              },

              data: {
                status: approved
                  ? "APPROVED"
                  : "REJECTED",

                reviewedAt:
                  new Date(),

                rejectionReason:
                  approved
                    ? null
                    : body.rejectionReason!.trim(),
              },
            });

          await tx.user.update({
            where: {
              id: kyc.userId,
            },

            data: {
              kycVerified: approved,
            },
          });

          return kyc;
        }
      );

    return NextResponse.json({
      success: true,
      data: result,
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
          "Unable to review KYC submission.",
      },
      {
        status: 500,
      }
    );
  }
}