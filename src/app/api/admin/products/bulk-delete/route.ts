import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/admin";

import { z } from "zod";

const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().min(1))
    .min(1),
});

export async function POST(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const parsed =
      bulkDeleteSchema.safeParse(
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

    const { ids } =
      parsed.data;

    const result =
      await prisma.product.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

    return NextResponse.json({
      success: true,
      data: {
        deleted:
          result.count,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to delete products.",
      },
      {
        status: 500,
      },
    );
  }
}