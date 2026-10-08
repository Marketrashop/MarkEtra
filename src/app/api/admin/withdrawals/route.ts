import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET() {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        message:
          "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const withdrawals =
    await prisma.withdrawal.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,

            firstName: true,

            lastName: true,

            email: true,
          },
        },

        withdrawalMethod: {
          select: {
            id: true,

            type: true,

            name: true,

            symbol: true,

            network: true,
          },
        },
      },
    });

  return NextResponse.json(
    withdrawals.map(
      (withdrawal) => ({
        id:
          withdrawal.id,

        reference:
          withdrawal.reference,

        amount: Number(
          withdrawal.amount
        ),

        fee: Number(
          withdrawal.fee
        ),

        receiveAmount:
          Number(
            withdrawal.receiveAmount
          ),

        destinationAddress:
          withdrawal.destinationAddress,

        bankDetails: {
          accountHolderName:
            withdrawal.accountHolderName,

          bankName:
            withdrawal.bankName,

          accountNumber:
            withdrawal.accountNumber,

          country:
            withdrawal.country,

          currency:
            withdrawal.currency,

          bankAddress:
            withdrawal.bankAddress,

          swiftCode:
            withdrawal.swiftBic,

          iban:
            withdrawal.iban,

          routingNumber:
            withdrawal.routingNumber,

          sortCode:
            withdrawal.sortCode,

          ifscCode:
            withdrawal.ifsc,
        },

        status:
          withdrawal.status ===
          "PENDING"
            ? "pending"
            : withdrawal.status ===
                "PROCESSING"
              ? "processing"
              : withdrawal.status ===
                  "COMPLETED"
                ? "completed"
                : "rejected",

        createdAt:
          withdrawal.createdAt.toLocaleString(),

        user: {
          id:
            withdrawal.user.id,

          name: `${withdrawal.user.firstName} ${withdrawal.user.lastName}`,

          email:
            withdrawal.user.email,
        },

        method: {
          id:
            withdrawal.withdrawalMethod.id,

          type:
            withdrawal.withdrawalMethod.type ===
            "CRYPTO"
              ? "crypto"
              : "bank",

          name:
            withdrawal.withdrawalMethod.name,

          symbol:
            withdrawal.withdrawalMethod.symbol ??
            "",

          network:
            withdrawal.withdrawalMethod.network ??
            "",
        },
      })
    )
  );
}