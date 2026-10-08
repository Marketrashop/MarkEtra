import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";

type CreateDepositBody = {
  amount: number;
  depositMethodId: string;
  receiptUrl: string;
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

function handleAuthError(
  error: unknown,
) {
  if (
    error instanceof Error &&
    error.message ===
      "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  return null;
}

export async function POST(
  request: Request,
) {
  try {
    const session =
      await requireUser();

    const body: CreateDepositBody =
      await request.json();

    if (
      !body.depositMethodId ||
      !body.receiptUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit method and receipt are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body.amount !==
        "number" ||
      Number.isNaN(body.amount) ||
      body.amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid deposit amount.",
        },
        {
          status: 400,
        },
      );
    }

    const depositMethod =
      await prisma.depositMethod.findUnique(
        {
          where: {
            id: body.depositMethodId,
          },
        },
      );

    if (
      !depositMethod ||
      !depositMethod.isActive
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit method is unavailable.",
        },
        {
          status: 404,
        },
      );
    }

const amount = body.amount;

const minimumAmount = Number(
  depositMethod.minimumAmount,
);

if (amount < minimumAmount) {
  return NextResponse.json(
    {
      success: false,
      error: `Minimum deposit is $${minimumAmount}.`,
    },
    {
      status: 400,
    },
  );
}

if (depositMethod.maximumAmount) {
  const maximumAmount = Number(
    depositMethod.maximumAmount,
  );

  if (amount > maximumAmount) {
    return NextResponse.json(
      {
        success: false,
        error: `Maximum deposit is $${maximumAmount}.`,
      },
      {
        status: 400,
      },
    );
  }
}

    const reference = `DEP-${Date.now()}-${randomUUID()
      .replaceAll("-", "")
      .slice(0, 8)
      .toUpperCase()}`;

    const deposit =
      await prisma.deposit.create({
        data: {
          userId:
            session.user.id,

          depositMethodId:
            depositMethod.id,

          amount,

          receiptUrl:
            body.receiptUrl,

          reference,

          status:
            "PENDING",
        },

        include: {
          depositMethod: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        data: deposit,
      },
      {
        status: 201,
      },
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
          "Unable to create deposit.",
      },
      {
        status: 500,
      },
    );
  }
}