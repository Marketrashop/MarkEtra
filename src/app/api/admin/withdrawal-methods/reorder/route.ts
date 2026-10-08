import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import { z } from "zod";

const reorderSchema =
  z.object({
    ids: z
      .array(z.string().uuid())
      .min(1),
  });

export async function PATCH(
  request: NextRequest
) {
  await requireAdmin();

  const body =
    await request.json();

  const parsed =
    reorderSchema.safeParse(
      body
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Invalid reorder payload.",
      },
      {
        status: 400,
      }
    );
  }

  const { ids } =
    parsed.data;

  await prisma.$transaction(
    ids.map(
      (
        id,
        index
      ) =>
        prisma.withdrawalMethod.update({
          where: {
            id,
          },
          data: {
            displayOrder:
              index + 1,
          },
        })
    )
  );

  return NextResponse.json({
    success: true,
  });
}