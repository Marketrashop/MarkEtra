import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

import {
  ProcessingFeeType,
  WithdrawalBalanceType,
  WithdrawalMethodType,
} from "../../../../generated/prisma/client";

import { z } from "zod";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";

const withdrawalSchema = z.object({
  withdrawalMethodId: z.string().uuid(),

  amount: z.coerce
    .number()
    .positive(),

balanceType: z.enum([
  "wallet",
  "profit",
  "affiliate",
]),

  destinationAddress: z
    .string()
    .trim()
    .optional(),

  accountHolderName: z
    .string()
    .trim()
    .optional(),

  bankName: z
    .string()
    .trim()
    .optional(),

  accountNumber: z
    .string()
    .trim()
    .optional(),

  country: z
    .string()
    .trim()
    .optional(),

  currency: z
    .string()
    .trim()
    .optional(),

  bankAddress: z
    .string()
    .trim()
    .optional(),

  swiftBic: z
    .string()
    .trim()
    .optional(),

  iban: z
    .string()
    .trim()
    .optional(),

  routingNumber: z
    .string()
    .trim()
    .optional(),

  sortCode: z
    .string()
    .trim()
    .optional(),

  ifsc: z
    .string()
    .trim()
    .optional(),
});

function generateReference() {
  return `WDR_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function calculateFee(
  amount: number,
  fee: number,
  feeType: ProcessingFeeType
) {
  if (feeType === ProcessingFeeType.FIXED) {
    return fee;
  }

  return (amount * fee) / 100;
}

export async function GET() {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const withdrawals =
    await prisma.withdrawal.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        withdrawalMethod: {
          select: {
            name: true,
            symbol: true,
            type: true,
            iconKey: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json({
    withdrawals: withdrawals.map(
      (withdrawal) => ({
        id: withdrawal.id,

        amount: Number(
          withdrawal.amount
        ),

        fee: Number(
          withdrawal.fee
        ),

        receiveAmount: Number(
          withdrawal.receiveAmount
        ),

        reference:
          withdrawal.reference,

        status:
          withdrawal.status.toLowerCase(),

        createdAt:
          withdrawal.createdAt,

        method: {
          name:
            withdrawal
              .withdrawalMethod
              .name,

          symbol:
            withdrawal
              .withdrawalMethod
              .symbol,

          type:
            withdrawal
              .withdrawalMethod
              .type
              .toLowerCase(),

          icon: getCloudinaryImageUrl(
            withdrawal
              .withdrawalMethod
              .iconKey
          ),
        },
      })
    ),
  });
}

export async function POST(
  request: NextRequest
) {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();

  const parsed =
    withdrawalSchema.safeParse(
      body
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Invalid withdrawal request.",
        errors:
          parsed.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const data =
    parsed.data;

const [wallet, user] =
  await Promise.all([
    prisma.wallet.findUnique({
      where: {
        userId: session.user.id,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
select: {
  id: true,
  profit: true,
  affiliateBalance: true,
},
    }),
  ]);

if (!wallet || !user) {
    return NextResponse.json(
      {
        message:
          "Wallet not found.",
      },
      {
        status: 404,
      }
    );
  }

  const method =
    await prisma.withdrawalMethod.findFirst({
      where: {
        id: data.withdrawalMethodId,
        isActive: true,
      },
    });

  if (!method) {
    return NextResponse.json(
      {
        message:
          "Withdrawal method not found.",
      },
      {
        status: 404,
      }
    );
  }

  const amount =
    Number(data.amount);

  const minimum =
    Number(method.minimumAmount);

  const maximum =
    method.maximumAmount === null
      ? null
      : Number(
          method.maximumAmount
        );

  if (amount < minimum) {
    return NextResponse.json(
      {
        message: `Minimum withdrawal is $${minimum}.`,
      },
      {
        status: 400,
      }
    );
  }

  if (
    maximum !== null &&
    amount > maximum
  ) {
    return NextResponse.json(
      {
        message: `Maximum withdrawal is $${maximum}.`,
      },
      {
        status: 400,
      }
    );
  }

const availableBalance =
  data.balanceType === "wallet"
    ? Number(
        wallet.availableBalance
      )
    : data.balanceType ===
      "profit"
      ? Number(
          user.profit
        )
      : Number(
          user.affiliateBalance
        );

  if (
    amount >
    availableBalance
  ) {
    return NextResponse.json(
      {
        message:
          "Insufficient wallet balance.",
      },
      {
        status: 400,
      }
    );
  }

  const fee =
    calculateFee(
      amount,
      Number(
        method.processingFee
      ),
      method.processingFeeType
    );

  const receiveAmount =
    amount - fee;

  if (receiveAmount <= 0) {
    return NextResponse.json(
      {
        message:
          "Withdrawal amount is too small after fees.",
      },
      {
        status: 400,
      }
    );
  }


const reference =
  generateReference();

const existingWithdrawal =
  await prisma.withdrawal.findUnique({
    where: {
      reference,
    },
  });

if (existingWithdrawal) {
  return NextResponse.json(
    {
      message:
        "Please try your withdrawal again.",
    },
    {
      status: 409,
    }
  );
}


      const withdrawal =
    await prisma.$transaction(
      async (tx) => {
if (data.balanceType === "wallet") {
  await tx.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      availableBalance: {
        decrement: data.amount,
      },

      lockedBalance: {
        increment: data.amount,
      },
    },
  });
} else if (
  data.balanceType === "profit"
) {
  await tx.user.update({
    where: {
      id: user.id,
    },
    data: {
      profit: {
        decrement: data.amount,
      },
    },
  });

  await tx.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      lockedBalance: {
        increment: data.amount,
      },
    },
  });
} else {
  await tx.user.update({
    where: {
      id: user.id,
    },
    data: {
      affiliateBalance: {
        decrement: data.amount,
      },
    },
  });

  await tx.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      lockedBalance: {
        increment: data.amount,
      },
    },
  });
}

const updatedWallet =
  await tx.wallet.findUniqueOrThrow({
    where: {
      id: wallet.id,
    },
  });

const createdWithdrawal =
  await tx.withdrawal.create({
data: {
  userId: session.user.id,

  withdrawalMethodId: method.id,

  amount: data.amount,

  fee,

  receiveAmount,

  reference,

balanceType:
  data.balanceType === "wallet"
    ? WithdrawalBalanceType.WALLET
    : data.balanceType === "profit"
      ? WithdrawalBalanceType.PROFIT
      : WithdrawalBalanceType.AFFILIATE,

  destinationAddress:
    method.type ===
    WithdrawalMethodType.CRYPTO
      ? data.destinationAddress
      : null,

      accountHolderName:
        data.accountHolderName ??
        null,

      bankName:
        data.bankName ??
        null,

      accountNumber:
        data.accountNumber ??
        null,

      country:
        data.country ??
        null,

      currency:
        data.currency ??
        null,

      bankAddress:
        data.bankAddress ??
        null,

      swiftBic:
        data.swiftBic ??
        null,

      iban:
        data.iban ??
        null,

      routingNumber:
        data.routingNumber ??
        null,

      sortCode:
        data.sortCode ??
        null,

      ifsc:
        data.ifsc ??
        null,
    },

    include: {
      withdrawalMethod: true,
    },
  });

        await tx.notification.create({
          data: {
            userId:
              session.user.id,

            type: "SYSTEM",

            title:
              "Withdrawal Submitted",

            message: `Your withdrawal request of $${data.amount.toFixed(
              2
            )} has been submitted and is awaiting review.`,
          },
        });

return {
  withdrawal: createdWithdrawal,
  wallet: updatedWallet,

profitBalance:
  data.balanceType === "profit"
    ? Number(user.profit) - Number(data.amount)
    : Number(user.profit),

affiliateBalance:
  data.balanceType === "affiliate"
    ? Number(user.affiliateBalance) -
      Number(data.amount)
    : Number(user.affiliateBalance),
};
      }
    );

return NextResponse.json(
  {
    message:
      "Withdrawal request submitted successfully.",

    withdrawal: {
      id: withdrawal.withdrawal.id,

      amount: Number(
        withdrawal.withdrawal.amount
      ),

      fee: Number(
        withdrawal.withdrawal.fee
      ),

      receiveAmount: Number(
        withdrawal.withdrawal.receiveAmount
      ),

      reference:
        withdrawal.withdrawal.reference,

      status:
        withdrawal.withdrawal.status.toLowerCase(),

      createdAt:
        withdrawal.withdrawal.createdAt,

      method: {
        id:
          withdrawal.withdrawal.withdrawalMethod.id,

        name:
          withdrawal.withdrawal.withdrawalMethod.name,

        symbol:
          withdrawal.withdrawal.withdrawalMethod.symbol,

        type:
          withdrawal.withdrawal.withdrawalMethod.type ===
          WithdrawalMethodType.CRYPTO
            ? "crypto"
            : "bank",

        icon:
          getCloudinaryImageUrl(
            withdrawal.withdrawal.withdrawalMethod.iconKey
          ),
      },
    },

wallet: {
  availableBalance: Number(
    withdrawal.wallet.availableBalance
  ),

  profitBalance:
    withdrawal.profitBalance,

  affiliateBalance:
    withdrawal.affiliateBalance,

  lockedBalance: Number(
    withdrawal.wallet.lockedBalance
  ),
},
  },
  {
    status: 201,
  }
);
}