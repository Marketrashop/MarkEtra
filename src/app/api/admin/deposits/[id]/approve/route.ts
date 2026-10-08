import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import {
  sendMail,
  buildDepositApprovedEmail,
} from "@/mail";

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

  if (
    error instanceof Error &&
    error.message ===
      "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireAdmin();

    const { id } =
      await params;

    const body: {
      adminNote?: string;
    } = await request.json();

    const deposit =
      await prisma.deposit.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              firstName: true,
              email: true,
            },
          },
        },
      });

    if (!deposit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit not found",
        },
        {
          status: 404,
        },
      );
    }

    if (
      deposit.status !==
      "PENDING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit has already been reviewed.",
        },
        {
          status: 409,
        },
      );
    }

    const updatedDeposit =
      await prisma.$transaction(
        async (tx) => {
          const wallet =
            await tx.wallet.findUnique({
              where: {
                userId:
                  deposit.userId,
              },
            });

          if (!wallet) {
            throw new Error(
              "Wallet not found.",
            );
          }

          const balanceBefore =
            wallet.availableBalance;

          const balanceAfter =
            balanceBefore.plus(
              deposit.amount,
            );

          await tx.walletTransaction.create({
data: {
  walletId: wallet.id,

  userId: deposit.userId,

  adminId: session.user.id,

  depositId: deposit.id,

  type: "DEPOSIT",

  amount: deposit.amount,

  balanceBefore,

  balanceAfter,

  description: `Deposit approved (${deposit.reference})`,
}
          });

await tx.wallet.update({
  where: {
    id: wallet.id,
  },
  data: {
    availableBalance: balanceAfter,
  },
});

await tx.user.update({
  where: {
    id: deposit.userId,
  },

  data: {
    totalDeposit: {
      increment: deposit.amount,
    },
  },
});

await tx.notification.create({
  data: {
    userId: deposit.userId,
    type: "DEPOSIT_APPROVED",
    title: "Deposit Approved",
    message: `Your deposit of $${Number(
      deposit.amount,
    ).toLocaleString()} has been approved and credited to your wallet.`,
  },
});

          await tx.activityLog.create({
            data: {
              adminId:
                session.user.id,

              action:
                "DEPOSIT_APPROVED",

              entity:
                "Deposit",

              entityId:
                deposit.id,

              description: `Approved deposit ${deposit.reference} for user ${deposit.userId}.`,
            },
          });

return tx.deposit.update({
  where: {
    id,
  },
  data: {
    status: "APPROVED",
    reviewNote: body.adminNote ?? null,
    reviewedAt: new Date(),
    reviewedById: session.user.id,
  },
});
        },
      );

    try {
      await sendMail({
        to: deposit.user.email,

        ...buildDepositApprovedEmail(
          {
            firstName:
              deposit.user
                .firstName,

            amount: Number(
              deposit.amount,
            ).toLocaleString(),
          },
        ),
      });
    } catch (error) {
      console.error(
        "Failed to send deposit approval email:",
        error,
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedDeposit,
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

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to approve deposit",
      },
      {
        status: 500,
      },
    );
  }
}