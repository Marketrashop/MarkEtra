import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

import {
  NotificationType,
  WalletTransactionType,
  WithdrawalStatus,
} from "../../../../../../generated/prisma/client";

import { z } from "zod";

const updateSchema = z.object({
  action: z.enum([
    "approve",
    "reject",
  ]),

  adminNote: z
    .string()
    .trim()
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        message:
          "Session TimeOut. Please refresh and login again.",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();

  const parsed =
    updateSchema.safeParse(
      body
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Invalid request.",
      },
      {
        status: 400,
      }
    );
  }

  const { id } =
    await params;

  const withdrawal =
    await prisma.withdrawal.findUnique(
      {
        where: {
          id,
        },

include: {
  user: {
    include: {
      wallet: true,
    },
  },
  withdrawalMethod: true,
},
      }
    );

  if (!withdrawal) {
    return NextResponse.json(
      {
        message:
          "Withdrawal not found.",
      },
      {
        status: 404,
      }
    );
  }

if (!withdrawal.user.wallet) {
  return NextResponse.json(
    {
      message: "Wallet not found.",
    },
    {
      status: 404,
    }
  );
}

const wallet = withdrawal.user.wallet;

if (!wallet) {
  return NextResponse.json(
    {
      message: "Wallet not found.",
    },
    {
      status: 404,
    }
  );
}

  if (
    withdrawal.status !==
    WithdrawalStatus.PENDING
  ) {
    return NextResponse.json(
      {
        message:
          "This withdrawal has already been processed.",
      },
      {
        status: 400,
      }
    );
  }

  const {
    action,
    adminNote,
  } = parsed.data;

  const result =
    await prisma.$transaction(
      async (tx) => {
        if (
          action ===
          "approve"
        ) {
const updatedWallet =
  await tx.wallet.update({
    where: {
      id: wallet.id,
    },

    data: {
      lockedBalance: {
        decrement:
          withdrawal.amount,
      },
    },
  });

          const updatedWithdrawal =
            await tx.withdrawal.update(
              {
                where: {
                  id:
                    withdrawal.id,
                },

                data: {
                  status:
                    WithdrawalStatus.COMPLETED,

                  processedAt:
                    new Date(),

                  adminNote:
                    adminNote ??
                    null,
                },
              }
            );

await tx.walletTransaction.create({
  data: {
    walletId: wallet.id,
    userId: withdrawal.userId,
    withdrawalId: withdrawal.id,

    type: WalletTransactionType.WITHDRAWAL,

    amount: withdrawal.amount,

balanceBefore:
  withdrawal.balanceType ===
  "WALLET"
    ? updatedWallet.availableBalance.plus(
        withdrawal.amount
      )
    : withdrawal.user.profit.plus(
        withdrawal.amount
      ),

balanceAfter:
  withdrawal.balanceType ===
  "WALLET"
    ? updatedWallet.availableBalance
    : withdrawal.user.profit,

    description: `Withdrawal approved (${withdrawal.reference})`,
  },
});

          await tx.notification.create(
            {
              data: {
                userId:
                  withdrawal.userId,

                type:
                  NotificationType.SYSTEM,

                title:
                  "Withdrawal Approved",

                message: `Your withdrawal request (${withdrawal.reference}) has been approved.`,
              },
            }
          );

          return updatedWithdrawal;
        }

const updatedWallet =
  await tx.wallet.update({
    where: {
      id: wallet.id,
    },

    data: {
      lockedBalance: {
        decrement:
          withdrawal.amount,
      },

      ...(withdrawal.balanceType ===
      "WALLET"
        ? {
            availableBalance: {
              increment:
                withdrawal.amount,
            },
          }
        : {}),
    },
  });

if (
  withdrawal.balanceType !==
  "WALLET"
) {
  await tx.user.update({
    where: {
      id: withdrawal.userId,
    },

    data: {
      profit: {
        increment:
          withdrawal.amount,
      },
    },
  });
}

        const updatedWithdrawal =
          await tx.withdrawal.update({
            where: {
              id:
                withdrawal.id,
            },

            data: {
              status:
                WithdrawalStatus.REJECTED,

              processedAt:
                new Date(),

              adminNote:
                adminNote ??
                null,
            },
          });

        await tx.notification.create(
          {
            data: {
              userId:
                withdrawal.userId,

              type:
                NotificationType.SYSTEM,

              title:
                "Withdrawal Rejected",

              message: `Your withdrawal request (${withdrawal.reference}) has been rejected.`,
            },
          }
        );

await tx.walletTransaction.create({
  data: {
    walletId: wallet.id,
    userId: withdrawal.userId,
    withdrawalId: withdrawal.id,

    type: WalletTransactionType.CREDIT,

    amount: withdrawal.amount,

balanceBefore:
  withdrawal.balanceType ===
  "WALLET"
    ? updatedWallet.availableBalance.minus(
        withdrawal.amount
      )
    : withdrawal.user.profit.minus(
        withdrawal.amount
      ),

balanceAfter:
  withdrawal.balanceType ===
  "WALLET"
    ? updatedWallet.availableBalance
    : withdrawal.user.profit.plus(
        withdrawal.amount
      ),

    description: `Withdrawal rejected (${withdrawal.reference})`,
  },
});

        return updatedWithdrawal;
      }
    );

  return NextResponse.json({
    message:
      action === "approve"
        ? "Withdrawal approved successfully."
        : "Withdrawal rejected successfully.",

    withdrawal: result,
  });
}