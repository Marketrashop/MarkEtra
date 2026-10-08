import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  requireAdmin,
} from "@/lib/auth/admin";

async function getAuthenticatedSession() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return await requireUser();
    }

    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      sessionId: string;
    }>;
  },
) {
  try {
    const session =
      await getAuthenticatedSession();

    const { sessionId } =
      await params;

    if (sessionId === session.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You cannot revoke your current session.",
        },
        {
          status: 400,
        },
      );
    }

    const targetSession =
      await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id,
          revokedAt: null,
        },
      });

    if (!targetSession) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Session not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Session revoked successfully.",
    });
  } catch (error) {
    console.error(
      "Revoke session error:",
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
          "Unable to revoke session.",
      },
      {
        status: 500,
      },
    );
  }
}