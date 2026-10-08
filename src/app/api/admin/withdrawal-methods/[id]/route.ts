import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { toPrismaWithdrawalType } from "@/lib/withdrawal-method";

import {
  ProcessingFeeType,
} from "../../../../../../generated/prisma/client";

import {
  withdrawalMethodSchema,
} from "@/components/admin/withdrawal-methods/withdrawal.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _: NextRequest,
  { params }: RouteContext
) {
  await requireAdmin();

  const { id } = await params;

  const method =
    await prisma.withdrawalMethod.findUnique({
      where: {
        id,
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

  return NextResponse.json(method);
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  await requireAdmin();

  const { id } = await params;

  const existing =
    await prisma.withdrawalMethod.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
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

  const body =
    await request.json();

  const parsed =
    withdrawalMethodSchema.safeParse(body);

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

const data = {
  type: toPrismaWithdrawalType(
    parsed.data.type
  ),

  name: parsed.data.name,
  symbol: parsed.data.symbol,
  network: parsed.data.network?.trim() || null,
  placeholder: parsed.data.placeholder,
  iconKey: parsed.data.icon ?? null,

  minimumAmount: parsed.data.minimumAmount,
  maximumAmount: parsed.data.maximumAmount,

  processingFee: parsed.data.fee,

  processingFeeType:
    parsed.data.feeType === "fixed"
      ? ProcessingFeeType.FIXED
      : ProcessingFeeType.PERCENTAGE,
};

  if (data.type === "BANK") {
    const anotherBank =
      await prisma.withdrawalMethod.findFirst({
        where: {
          type: "BANK",
          NOT: {
            id,
          },
        },
      });

    if (anotherBank) {
      return NextResponse.json(
        {
          message:
            "Only one bank withdrawal method is allowed.",
        },
        {
          status: 409,
        }
      );
    }
  }

  const updated =
    await prisma.withdrawalMethod.update({
      where: {
        id,
      },
      data,
    });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext
) {
  await requireAdmin();

  const { id } =
    await params;

  const existing =
    await prisma.withdrawalMethod.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
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

  await prisma.withdrawalMethod.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}