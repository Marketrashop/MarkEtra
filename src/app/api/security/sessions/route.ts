import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  ACTIVE_SESSION_WINDOW_MS,
} from "@/lib/auth/activity";

import {
  getIpLocations,
} from "@/lib/geo/ip";

async function getAuthenticatedSession() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "FORBIDDEN"
    ) {
      return await requireUser();
    }

    throw error;
  }
}

export async function GET() {
  try {
    const session =
      await getAuthenticatedSession();

    const now = new Date();

    const activeSince =
      new Date(
        now.getTime() -
          ACTIVE_SESSION_WINDOW_MS,
      );

    const sessions =
      await prisma.session.findMany({
        where: {
          userId:
            session.user.id,

          revokedAt: null,

          expiresAt: {
            gt: now,
          },
        },

        orderBy: {
          lastActivityAt:
            "desc",
        },

        select: {
          id: true,

          userAgent: true,

          ipAddress: true,

          rememberMe: true,

          createdAt: true,

          lastActivityAt: true,

          expiresAt: true,
        },
      });

    const ipLocations =
      await getIpLocations(
        sessions.map(
          (item) =>
            item.ipAddress,
        ),
      );

    return NextResponse.json({
      success: true,

      sessions:
        sessions.map(
          (item) => {
            const ip =
              item.ipAddress
                ?.trim()
                .toLowerCase() ??
              null;

            return {
              id: item.id,

              userAgent:
                item.userAgent,

              ipAddress:
                item.ipAddress,

              location: ip
                ? (
                    ipLocations.get(
                      ip,
                    ) ?? null
                  )
                : null,

              rememberMe:
                item.rememberMe,

              createdAt:
                item.createdAt.toISOString(),

              lastActivityAt:
                item.lastActivityAt.toISOString(),

              expiresAt:
                item.expiresAt.toISOString(),

              current:
                item.id ===
                session.id,

              active:
                item.lastActivityAt >=
                activeSince,
            };
          },
        ),
    });
  } catch (error) {
    console.error(
      "Active sessions error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Session expired. Please sign in again.",
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
          "Unable to load active sessions.",
      },
      {
        status: 500,
      },
    );
  }
}