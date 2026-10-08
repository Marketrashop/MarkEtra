import { NextResponse } from "next/server";


import { prisma } from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  walletAdjustmentSchema,
} from "@/components/admin/Wallet/wallet.schemas";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Session Timeout. Please login again.",
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
      error:
        "Admin access required.",
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
) {
  try {
    const session =
      await requireAdmin();

    const body =
      await request.json();

    const parsed =
      walletAdjustmentSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
          issues:
            parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const {
      userId,
      balanceType,
      action,
      amount,
    } = parsed.data;

    const result =
      await prisma.$transaction(
        async (tx) => {
          const wallet =
            await tx.wallet.findUnique({
              where: {
                userId,
              },
            });

          const user =
            await tx.user.findUnique({
              where: {
                id: userId,
              },

select: {
  id: true,
  affiliateBalance: true,
  profit: true,
  totalDeposit: true,
},
            });

          if (!wallet || !user) {
            throw new Error(
              "WALLET_NOT_FOUND",
            );
          }

if (
  balanceType ===
  "affiliateCommission"
) {
  const balanceBefore =
    user.affiliateBalance;

  let balanceAfter =
    balanceBefore;

  if (
    action === "CREDIT"
  ) {
    balanceAfter =
      balanceBefore.plus(
        amount,
      );
  } else {
    if (
      balanceBefore.lessThan(
        amount,
      )
    ) {
      throw new Error(
        "INSUFFICIENT_BALANCE",
      );
    }

    balanceAfter =
      balanceBefore.minus(
        amount,
      );
  }

  await tx.user.update({
    where: {
      id: userId,
    },

    data: {
      affiliateBalance:
        balanceAfter,
    },
  });

  await tx.notification.create({
    data: {
      userId,

      type: "SYSTEM",

      title:
        action === "CREDIT"
          ? "Affiliate Commission Credited"
          : "Affiliate Commission Debited",

      message:
        action === "CREDIT"
          ? "Affiliate commission credited successfully."
          : "Affiliate commission debited successfully.",
    },
  });

  await tx.activityLog.create({
    data: {
      adminId:
        session.user.id,

      action:
        action === "CREDIT"
          ? "PROFIT_CREDIT"
          : "PROFIT_DEBIT",

      entity:
        "Affiliate Commission",

      entityId:
        userId,

      description:
        `${action}ED affiliate commission of user ${userId} by $${Number(
          amount,
        ).toLocaleString()}.`,
   },
});

  return {
    balance:
      balanceAfter.toString(),
  };
}

          const balanceBefore =
            balanceType ===
            "wallet"
              ? wallet.availableBalance
              : balanceType ===
                  "profit"
                ? user.profit
                : user.totalDeposit;

          let balanceAfter =
            balanceBefore;

          if (
            action === "CREDIT"
          ) {
            balanceAfter =
              balanceBefore.plus(
                amount,
              );
          } else {
            if (
              balanceBefore.lessThan(
                amount,
              )
            ) {
              throw new Error(
                "INSUFFICIENT_BALANCE",
              );
            }

            balanceAfter =
              balanceBefore.minus(
                amount,
              );
          }

          if (
            balanceType ===
            "wallet"
          ) {
            await tx.wallet.update({
              where: {
                id: wallet.id,
              },

              data: {
                availableBalance:
                  balanceAfter,
              },
            });
          }

          if (
            balanceType ===
            "profit"
          ) {
            await tx.user.update({
              where: {
                id: userId,
              },

              data: {
                profit:
                  balanceAfter,
              },
            });
          }

          if (
            balanceType ===
            "totalDeposit"
          ) {
            await tx.user.update({
              where: {
                id: userId,
              },

              data: {
                totalDeposit:
                  balanceAfter,
              },
            });
          }

          if (
            balanceType ===
            "wallet"
          ) {
            await tx.walletTransaction.create(
              {
                data: {
                  walletId:
                    wallet.id,

                  userId,

                  adminId:
                    session.user.id,

                  type:
                    action,

                  amount,

                  balanceBefore,

                  balanceAfter,

                  description:
                    action ===
                    "CREDIT"
                      ? "Wallet credited by admin."
                      : "Wallet debited by admin.",
                },
              },
            );
          }

          const balanceLabel =
            balanceType ===
            "wallet"
              ? "Wallet"
              : balanceType ===
                  "profit"
                ? "Profit"
                : "Total Deposit";

          await tx.notification.create(
            {
              data: {
                userId,

                type: "SYSTEM",

                title:
                  action ===
                  "CREDIT"
                    ? `${balanceLabel} Credited`
                    : `${balanceLabel} Debited`,

                message:
                  action ===
                  "CREDIT"
                    ? `${balanceLabel} credited successfully.`
                    : `${balanceLabel} debited successfully.`,
              },
            },
          );

          await tx.activityLog.create(
            {
              data: {
                adminId:
                  session.user.id,

                action:
                  balanceType ===
                  "wallet"
                    ? action ===
                      "CREDIT"
                      ? "WALLET_CREDIT"
                      : "WALLET_DEBIT"
                    : action ===
                        "CREDIT"
                      ? "PROFIT_CREDIT"
                      : "PROFIT_DEBIT",

                entity:
                  balanceLabel,

                entityId:
                  userId,

                description:
                  `${action}ED ${balanceLabel.toLowerCase()} of user ${userId} by $${Number(
                    amount,
                  ).toLocaleString()}.`,
              },
            },
          );

          return {
            balance:
              balanceAfter.toString(),
          };
        },
      );

    const balanceLabel =
      balanceType === "wallet"
        ? "Wallet"
        : balanceType === "profit"
          ? "Profit"
          : balanceType ===
              "totalDeposit"
            ? "Total Deposit"
            : "Affiliate Commission";

    return NextResponse.json({
      success: true,

      message:
        action === "CREDIT"
          ? `${balanceLabel} credited successfully.`
          : `${balanceLabel} debited successfully.`,

      data: result,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    if (
      error instanceof Error &&
      error.message ===
        "WALLET_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Wallet not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INSUFFICIENT_BALANCE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User does not have enough balance.",
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to adjust wallet.",
      },
      {
        status: 500,
      },
    );
  }
}