import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";

type Body = {
  notificationId: string;
};

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

export async function POST(
  request: Request,
) {
  try {
    const session =
      await requireUser();

    const body: Body =
      await request.json();

    if (
      !body.notificationId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Notification ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await prisma.notification.updateMany({
        where: {
          id: body.notificationId,
          userId:
            session.user.id,
        },

        data: {
          isRead: true,
        },
      });

    if (
      result.count === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Notification not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Notification marked as read.",
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
          "Unable to update notification.",
      },
      {
        status: 500,
      },
    );
  }
}