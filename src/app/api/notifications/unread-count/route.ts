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

export async function GET() {
  try {
    const session =
      await requireUser();

const unreadCount =
  await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

return NextResponse.json(
  {
    success: true,
    count: unreadCount,
  },
  {
    headers: {
      "Cache-Control": "no-store",
    },
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
          "Unable to load unread notification count.",
      },
      {
        status: 500,
      },
    );
  }
}