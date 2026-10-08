import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";

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

  return null;
}

export async function POST() {
  try {
    const session =
      await requireUser();

    const result =
      await prisma.notification.updateMany({
        where: {
          userId:
            session.user.id,
          isRead: false,
        },

        data: {
          isRead: true,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "All notifications marked as read.",
      updatedCount:
        result.count,
    });
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
          "Unable to update notifications.",
      },
      {
        status: 500,
      },
    );
  }
}