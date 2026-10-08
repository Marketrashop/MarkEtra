import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import { AUTH_CONSTANTS } from "@/lib/auth/constants";
import { prisma } from "@/lib/prisma";

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

function handleAuthError(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function GET(
  request: Request,
) {
  try {
    await requireAdmin();

    const { searchParams } =
      new URL(request.url);

    const userIdsParam =
      searchParams.get("userIds");

    if (!userIdsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "User IDs are required.",
        },
        {
          status: 400,
        },
      );
    }

    const userIds = [
      ...new Set(
        userIdsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      ),
    ];

    if (userIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        {
          status: 200,
        },
      );
    }

    if (userIds.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many user IDs requested.",
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date();

    const activeSince = new Date(
      now.getTime() -
        AUTH_CONSTANTS.SESSION_IDLE_TIMEOUT_MS,
    );

    const users =
      await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },

        select: {
          id: true,

          sessions: {
            orderBy: {
              lastActivityAt: "desc",
            },

            take: 1,

            select: {
              lastActivityAt: true,
            },
          },
        },
      });

    const activeSessions =
      await prisma.session.findMany({
        where: {
          userId: {
            in: userIds,
          },

          revokedAt: null,

          expiresAt: {
            gt: now,
          },

          lastActivityAt: {
            gte: activeSince,
          },
        },

        select: {
          userId: true,
        },

        distinct: ["userId"],
      });

    const activeUserIds =
      new Set(
        activeSessions.map(
          (session) => session.userId,
        ),
      );

    const presence = users.map(
      (user) => ({
        userId: user.id,

        active:
          activeUserIds.has(user.id),

        lastActiveAt:
          user.sessions[0]?.lastActivityAt
            ?.toISOString() ?? null,
      }),
    );

    return NextResponse.json(
      {
        success: true,
        data: presence,
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

    console.error(
      "Failed to fetch user presence:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch user presence.",
      },
      {
        status: 500,
      },
    );
  }
}