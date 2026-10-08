import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import { z } from "zod";

const featuredSchema = z.object({
  ids: z.array(
    z.string().min(1),
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
      featuredSchema.safeParse(
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

    await prisma.$transaction([
      prisma.product.updateMany({
        where: {},

        data: {
          featured: false,
        },
      }),

      prisma.product.updateMany({
        where: {
          id: {
            in: ids,
          },
        },

        data: {
          featured: true,
        },
      }),
    ]);

    const featuredProducts =
      await prisma.product.findMany({
        where: {
          featured: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      data: featuredProducts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update featured products.",
      },
      {
        status: 500,
      },
    );
  }
}