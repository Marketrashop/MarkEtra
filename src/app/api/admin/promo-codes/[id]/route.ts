
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updatePromoCodeSchema } from "@/validation/promo-code.validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body: unknown = await request.json();
    const validation = updatePromoCodeSchema.safeParse(body);

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

    const existing = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Promo code not found.",
        },
        { status: 404 },
      );
    }

    // Merge submitted values with the existing settings.
    // Omitted fields must retain their current values.
    const discountType = data.discountType ?? existing.discountType;
    const discountValue =
      data.discountValue ?? Number(existing.discountValue);

    const maximumDiscount =
      data.maximumDiscount !== undefined
        ? data.maximumDiscount
        : existing.maximumDiscount === null
          ? null
          : Number(existing.maximumDiscount);

    const startsAt =
      data.startsAt !== undefined
        ? data.startsAt
        : existing.startsAt;

    const expiresAt =
      data.expiresAt !== undefined
        ? data.expiresAt
        : existing.expiresAt;

    // Validate the resulting configuration, not just the submitted fields.
    if (
      discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Percentage discount cannot exceed 100%.",
        },
        { status: 400 },
      );
    }

    if (
      discountType === "FIXED_AMOUNT" &&
      maximumDiscount !== null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Clear the maximum discount before switching to a fixed amount.",
        },
        { status: 400 },
      );
    }

    if (
      startsAt &&
      expiresAt &&
      expiresAt <= startsAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Expiry must be later than the start date.",
        },
        { status: 400 },
      );
    }

    // Build a partial update so omitted properties are never overwritten.
    const updateData: Prisma.PromoCodeUpdateInput = {};

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.discountType !== undefined) {
      updateData.discountType = data.discountType;
    }

    if (data.discountValue !== undefined) {
      updateData.discountValue = new Prisma.Decimal(
        data.discountValue,
      );
    }

    if (data.minimumSubtotal !== undefined) {
      updateData.minimumSubtotal =
        data.minimumSubtotal === null
          ? null
          : new Prisma.Decimal(data.minimumSubtotal);
    }

    if (data.maximumDiscount !== undefined) {
      updateData.maximumDiscount =
        data.maximumDiscount === null
          ? null
          : new Prisma.Decimal(data.maximumDiscount);
    }

    if (data.startsAt !== undefined) {
      updateData.startsAt = data.startsAt;
    }

    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.usageLimit !== undefined) {
      updateData.usageLimit = data.usageLimit;
    }

    if (data.perUserLimit !== undefined) {
      updateData.perUserLimit = data.perUserLimit;
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Promo code updated successfully.",
      promoCode: {
        ...promoCode,
        discountValue: promoCode.discountValue.toString(),
        minimumSubtotal:
          promoCode.minimumSubtotal?.toString() ?? null,
        maximumDiscount:
          promoCode.maximumDiscount?.toString() ?? null,
      },
    });
  } catch (error: unknown) {
    console.error("Failed to update promo code:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update promo code.",
      },
      { status: 500 },
    );
  }
}
