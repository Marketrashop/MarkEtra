import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";

export async function DELETE() {
  try {
    const session = await requireUser();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (user.status === "PENDING_DELETION") {
      return NextResponse.json(
        {
          success: false,
          error: "This account has already been deleted.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: "PENDING_DELETION",
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Your account has been deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete account error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete your account.",
      },
      {
        status: 500,
      },
    );
  }
}