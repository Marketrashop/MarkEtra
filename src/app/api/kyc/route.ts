import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";

import { kycSchema } from "@/components/kyc/kyc.validation";

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

    const kyc =
      await prisma.kycVerification.findUnique({
        where: {
          userId: session.user.id,
        },
      });

    return NextResponse.json({
      success: true,
      data: kyc,
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
          "Unable to load KYC information.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await requireUser();

    const body =
      await request.json();

    const parsed =
      kycSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid KYC data.",
          errors:
            parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const data = parsed.data;

    const existing =
      await prisma.kycVerification.findUnique({
        where: {
          userId: session.user.id,
        },
      });

    if (
      existing &&
      existing.status === "PENDING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your KYC submission is currently under review.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      existing &&
      existing.status === "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account has already been verified.",
        },
        {
          status: 409,
        }
      );
    }

    const kyc =
      existing === null
        ? await prisma.kycVerification.create({
data: {
  userId: session.user.id,

  ...data,

  dateOfBirth: new Date(
    data.dateOfBirth,
  ),

  status: "PENDING",

  rejectionReason: null,

  reviewedAt: null,

  submittedAt: new Date(),
},
          })
        : await prisma.kycVerification.update({
            where: {
              id: existing.id,
            },

data: {
  ...data,

  dateOfBirth: new Date(
    data.dateOfBirth,
  ),

  status: "PENDING",

  rejectionReason: null,

  reviewedAt: null,

  submittedAt: new Date(),
},
          });

    return NextResponse.json(
      {
        success: true,
        message:
          "KYC submitted successfully.",
        data: kyc,
      },
      {
        status: 201,
      }
    );
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
          "Unable to submit KYC.",
      },
      {
        status: 500,
      }
    );
  }
}