import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createPromoCodeSchema } from "@/validation/promo-code.validation";

export async function GET() {
  try {
    await requireAdmin();

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            redemptions: {
              where: {
                status: {
                  in: ["RESERVED", "REDEEMED"],
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      promoCodes: promoCodes.map((promoCode) => ({
        ...promoCode,
        discountValue: promoCode.discountValue.toString(),
        minimumSubtotal: promoCode.minimumSubtotal?.toString() ?? null,
        maximumDiscount: promoCode.maximumDiscount?.toString() ?? null,
        redemptionCount: promoCode._count.redemptions,
        _count: undefined,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch promo codes:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch promo codes.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const validation = createPromoCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the promo code details.",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    const promoCode = await prisma.promoCode.create({
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: new Prisma.Decimal(data.discountValue),
        minimumSubtotal:
          data.minimumSubtotal === null
            ? null
            : new Prisma.Decimal(data.minimumSubtotal),
        maximumDiscount:
          data.maximumDiscount === null
            ? null
            : new Prisma.Decimal(data.maximumDiscount),
        startsAt: data.startsAt,
        expiresAt: data.expiresAt,
        isActive: data.isActive,
        usageLimit: data.usageLimit,
        perUserLimit: data.perUserLimit,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Promo code created successfully.",
        promoCode: {
          ...promoCode,
          discountValue: promoCode.discountValue.toString(),
          minimumSubtotal: promoCode.minimumSubtotal?.toString() ?? null,
          maximumDiscount: promoCode.maximumDiscount?.toString() ?? null,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A promo code with this code already exists.",
        },
        { status: 409 },
      );
    }

    console.error("Failed to create promo code:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create promo code.",
      },
      { status: 500 },
    );
  }
}