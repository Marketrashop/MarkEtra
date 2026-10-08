import { NextRequest, NextResponse } from "next/server";

import { ProductStatus } from "../../../../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/admin";

import { z } from "zod";

const statusSchema = z.object({
  ids: z
    .array(z.string().min(1))
    .min(1),

  status: z.nativeEnum(
    ProductStatus,
  ),
});

export async function PATCH(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const parsed =
      statusSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request.",
          issues:
            parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const {
      ids,
      status,
    } = parsed.data;

    const result =
      await prisma.product.updateMany({
        where: {
          id: {
            in: ids,
          },
        },

        data: {
          status,
        },
      });

    return NextResponse.json({
      success: true,
      data: {
        updated:
          result.count,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update product status.",
      },
      {
        status: 500,
      },
    );
  }
}