import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";

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
        userId:
          session.user.id,
      },

      include: {
        withdrawalMethod: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json({
    withdrawals:
      withdrawals.map(
        (withdrawal) => ({
          id: withdrawal.id,

          reference:
            withdrawal.reference,

          method: {
            id:
              withdrawal
                .withdrawalMethod.id,

            type:
              withdrawal
                .withdrawalMethod.type ===
              "CRYPTO"
                ? "crypto"
                : "bank",

            name:
              withdrawal
                .withdrawalMethod.name,

            symbol:
              withdrawal
                .withdrawalMethod
                .symbol ?? "",

            icon:
              getCloudinaryImageUrl(
                withdrawal
                  .withdrawalMethod
                  .iconKey
              ) ?? "",

            network:
              withdrawal
                .withdrawalMethod
                .network ?? "",

            placeholder:
              withdrawal
                .withdrawalMethod
                .placeholder,

            minimumAmount:
              Number(
                withdrawal
                  .withdrawalMethod
                  .minimumAmount
              ),

            maximumAmount:
              withdrawal
                .withdrawalMethod
                .maximumAmount ===
              null
                ? undefined
                : Number(
                    withdrawal
                      .withdrawalMethod
                      .maximumAmount
                  ),

            isActive:
              withdrawal
                .withdrawalMethod
                .isActive,
          },

          destinationAddress:
            withdrawal
              .destinationAddress ??
            "",

          bankDetails:
            withdrawal
              .withdrawalMethod.type ===
            "BANK"
              ? {
                  accountHolderName:
                    withdrawal.accountHolderName ??
                    "",

                  bankName:
                    withdrawal.bankName ??
                    "",

                  accountNumber:
                    withdrawal.accountNumber ??
                    "",

                  country:
                    withdrawal.country ??
                    "",

                  currency:
                    withdrawal.currency ??
                    "",

                  bankAddress:
                    withdrawal.bankAddress ??
                    "",

                  swiftCode:
                    withdrawal.swiftBic ??
                    "",

                  iban:
                    withdrawal.iban ??
                    "",

                  routingNumber:
                    withdrawal.routingNumber ??
                    "",

                  sortCode:
                    withdrawal.sortCode ??
                    "",

                  ifscCode:
                    withdrawal.ifsc ??
                    "",
                }
              : undefined,

          amount: Number(
            withdrawal.amount
          ),

          cryptoAmount: Number(
            withdrawal.receiveAmount
          ),

status:
  withdrawal.status ===
  "COMPLETED"
    ? "successful"
    : withdrawal.status ===
        "REJECTED"
      ? "rejected"
      : "pending",

          createdAt:
            withdrawal.createdAt.toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            ),

          createdTime:
            withdrawal.createdAt.toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
              }
            ),
        })
      ),
  });
}