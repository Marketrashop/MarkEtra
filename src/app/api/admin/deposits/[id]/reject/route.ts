import { NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const rejectSchema = z.object({
  adminNote: z
    .string()
    .trim()
    .min(
      1,
      "A rejection reason is required.",
    )
    .max(1000),
});

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Session Timeout. Please login again.",
    },
    {
      status: 401,
    },
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Admin access required",
    },
    {
      status: 403,
    },
  );
}

function handleAuthError(
  error: unknown,
) {
  if (
    error instanceof Error &&
    error.message ===
      "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  if (
    error instanceof Error &&
    error.message ===
      "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireAdmin();

    const { id } =
      await params;

    const body: unknown =
      await request.json();

    const parsed =
      rejectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid rejection note.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const deposit =
      await prisma.deposit.findUnique({
        where: {
          id,
        },
      });

    if (!deposit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit not found",
        },
        {
          status: 404,
        },
      );
    }

    if (
      deposit.status !==
      "PENDING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit has already been reviewed.",
        },
        {
          status: 409,
        },
      );
    }

    const updated =
      await prisma.deposit.update({
        where: {
          id,
        },
        data: {
          status:
            "REJECTED",

          reviewNote:
            parsed.data.adminNote,

          reviewedAt:
            new Date(),

          reviewedById:
            session.user.id,
        },
      });

    return NextResponse.json(
      {
        success: true,
        data: updated,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to reject deposit",
      },
      {
        status: 500,
      },
    );
  }
}