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
      },
    );
  }

  const [
    methods,
    wallet,
    user,
  ] = await Promise.all([
    prisma.withdrawalMethod.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        displayOrder: "asc",
      },
    }),

    prisma.wallet.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        availableBalance: true,
        lockedBalance: true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      select: {
        profit: true,
        affiliateBalance: true,
      },
    }),
  ]);

  return NextResponse.json({
    methods: methods.map(
      (method) => ({
        id: method.id,

        type:
          method.type ===
          "CRYPTO"
            ? "crypto"
            : "bank",

        name: method.name,

        symbol:
          method.symbol ?? "",

        network:
          method.network ?? "",

        placeholder:
          method.placeholder,

        fee: Number(
          method.processingFee,
        ),

        feeType:
          method.processingFeeType ===
          "FIXED"
            ? "fixed"
            : "percentage",

        minimumAmount: Number(
          method.minimumAmount,
        ),

        maximumAmount:
          method.maximumAmount ===
          null
            ? null
            : Number(
                method.maximumAmount,
              ),

        icon:
          getCloudinaryImageUrl(
            method.iconKey,
          ),

        isActive:
          method.isActive,
      }),
    ),

    wallet: {
      availableBalance: Number(
        wallet?.availableBalance ??
          0,
      ),

      profitBalance: Number(
        user?.profit ??
          0,
      ),

      affiliateBalance: Number(
        user?.affiliateBalance ??
          0,
      ),

      lockedBalance: Number(
        wallet?.lockedBalance ??
          0,
      ),
    },
  });
}