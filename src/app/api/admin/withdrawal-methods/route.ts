import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import {
  withdrawalMethodSchema,
} from "@/components/admin/withdrawal-methods/withdrawal.validation";

import {
  ProcessingFeeType,
  WithdrawalMethodType,
} from "../../../../../generated/prisma/client";

export async function GET() {
  await requireAdmin();

  const methods =
    await prisma.withdrawalMethod.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

  return NextResponse.json(methods);
}

export async function POST(
  request: NextRequest
) {
  await requireAdmin();

  const body =
    await request.json();

  const parsed =
    withdrawalMethodSchema.safeParse(
      body
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Invalid withdrawal method.",
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

if (data.type === "bank") {
  const existing =
    await prisma.withdrawalMethod.findFirst({
      where: {
        type: WithdrawalMethodType.BANK,
      },
    });

  if (existing) {
    return NextResponse.json(
      {
        message:
          "A bank withdrawal method already exists. Update or delete it before creating another.",
      },
      {
        status: 409,
      }
    );
  }
}

if (data.type === "crypto") {
  const existing =
    await prisma.withdrawalMethod.findFirst({
      where: {
        type: WithdrawalMethodType.CRYPTO,
        symbol: data.symbol,
        network: data.network?.trim() ?? null,
      },
    });

  if (existing) {
    return NextResponse.json(
      {
        message:
          "A withdrawal method for this cryptocurrency already exists.",
      },
      {
        status: 409,
      }
    );
  }
}

  const highest =
    await prisma.withdrawalMethod.findFirst(
      {
        orderBy: {
          displayOrder:
            "desc",
        },
      }
    );

try {
  const method =
    await prisma.withdrawalMethod.create({
      data: {
        type:
          data.type === "crypto"
            ? WithdrawalMethodType.CRYPTO
            : WithdrawalMethodType.BANK,

        name: data.name,
        symbol: data.symbol,
        network: data.network?.trim() || null,
        placeholder: data.placeholder,
        iconKey: data.icon ?? null,
        minimumAmount: data.minimumAmount,
        maximumAmount: data.maximumAmount,
        processingFee: data.fee,
        processingFeeType:
          data.feeType === "fixed"
            ? ProcessingFeeType.FIXED
            : ProcessingFeeType.PERCENTAGE,
        isActive: true,
        displayOrder:
          highest
            ? highest.displayOrder + 1
            : 1,
      },
    });

  return NextResponse.json(
    method,
    {
      status: 201,
    }
  );
} catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      message:
        "Unable to create withdrawal method.",
    },
    {
      status: 500,
    }
  );
}
}