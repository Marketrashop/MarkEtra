import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import { z } from "zod";

const toggleSchema =
  z.object({
    id: z.string().uuid(),
    isActive: z.boolean(),
  });

export async function PATCH(
  request: NextRequest
) {
  await requireAdmin();

  const body =
    await request.json();

  const parsed =
    toggleSchema.safeParse(
      body
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Invalid request.",
      },
      {
        status: 400,
      }
    );
  }

  const {
    id,
    isActive,
  } = parsed.data;

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

  const method =
    await prisma.withdrawalMethod.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

  return NextResponse.json(
    method
  );
}