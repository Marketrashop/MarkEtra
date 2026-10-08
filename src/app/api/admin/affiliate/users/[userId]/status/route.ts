import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";
import { AUTH_CONSTANTS } from "@/lib/auth/constants";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const admin = await requireUser();

    if (admin.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden.",
        },
        { status: 403 },
      );
    }

    const { userId } = await context.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    const lastActiveAt =
      user.sessions[0]?.lastActivityAt ?? null;

    const activeSince = new Date(
      Date.now() -
        AUTH_CONSTANTS.SESSION_IDLE_TIMEOUT_MS,
    );

    const activeSession =
      await prisma.session.findFirst({
        where: {
          userId: user.id,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
          lastActivityAt: {
            gte: activeSince,
          },
        },
        select: {
          id: true,
        },
      });

    const active =
      activeSession !== null;

    return NextResponse.json({
      success: true,
      data: {
        active,
        lastActiveAt:
          lastActiveAt?.toISOString() ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve user status.",
      },
      { status: 500 },
    );
  }
}