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

import {
  verifyPassword,
  hashPassword,
} from "@/lib/auth/password";

import {
  redis,
} from "@/lib/realtime/redis";

import {
  changePasswordSchema,
} from "@/components/security/security.validation";

const MAX_PASSWORD_CHANGE_ATTEMPTS = 3;

const PASSWORD_CHANGE_ATTEMPT_WINDOW_SECONDS =
  30 * 60;

const PASSWORD_CHANGE_ATTEMPT_KEY_PREFIX =
  "security:password-change-attempts";

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

function getPasswordChangeAttemptKey(
  userId: string,
) {
  return `${PASSWORD_CHANGE_ATTEMPT_KEY_PREFIX}:${userId}`;
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const session =
      await getAuthenticatedSession();

    const body =
      await request.json();

    const parsed =
      changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const {
      currentPassword,
      newPassword,
    } = parsed.data;

    const attemptKey =
      getPasswordChangeAttemptKey(
        session.user.id,
      );

    const currentAttempts =
      Number(
        await redis.get<number>(
          attemptKey,
        ),
      ) || 0;

    if (
      currentAttempts >=
      MAX_PASSWORD_CHANGE_ATTEMPTS
    ) {
      return NextResponse.json(
        {
          success: false,
          code:
            "PASSWORD_CHANGE_ATTEMPTS_EXCEEDED",
          error:
            "Too many incorrect password attempts. Please reset your password to continue.",
          remainingAttempts: 0,
        },
        {
          status: 429,
        },
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          passwordHash: true,
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

    const passwordMatches =
      await verifyPassword(
        currentPassword,
        user.passwordHash,
      );

    if (!passwordMatches) {
      const attempts =
        await redis.incr(
          attemptKey,
        );

      if (attempts === 1) {
        await redis.expire(
          attemptKey,
          PASSWORD_CHANGE_ATTEMPT_WINDOW_SECONDS,
        );
      }

      const remainingAttempts =
        Math.max(
          0,
          MAX_PASSWORD_CHANGE_ATTEMPTS -
            attempts,
        );

      if (
        attempts >=
        MAX_PASSWORD_CHANGE_ATTEMPTS
      ) {
        return NextResponse.json(
          {
            success: false,
            code:
              "PASSWORD_CHANGE_ATTEMPTS_EXCEEDED",
            error:
              "Too many incorrect password attempts. Please reset your password to continue.",
            remainingAttempts: 0,
          },
          {
            status: 429,
          },
        );
      }

      return NextResponse.json(
        {
          success: false,
          code:
            "CURRENT_PASSWORD_INCORRECT",
          error:
            "Your current password is incorrect.",
          remainingAttempts,
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash =
      await hashPassword(
        newPassword,
      );

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.session.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    await redis.del(
      attemptKey,
    );

    return NextResponse.json({
      success: true,
      message:
        "Password updated successfully.",
    });
  } catch (error) {
    console.error(
      "Password change error:",
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
          "Unable to change password.",
      },
      {
        status: 500,
      },
    );
  }
}