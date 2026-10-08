import { Prisma } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { hashToken } from "./tokens";

export const AUTH_RATE_LIMITS = {
  EMAIL_VERIFICATION_RESEND: {
    maxRequests: 4,
    windowMs: 24 * 60 * 60 * 1000,
  },

  PASSWORD_RESET: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000,
  },
} as const;

export type AuthRequestType =
  keyof typeof AUTH_RATE_LIMITS;

type ConsumeAuthRateLimitInput = {
  type: AuthRequestType;
  identifier: string;
  userId?: string | null;
};

export type AuthRateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAt: Date | null;
};

export async function consumeAuthRateLimit({
  type,
  identifier,
  userId = null,
}: ConsumeAuthRateLimitInput): Promise<AuthRateLimitResult> {
  const config = AUTH_RATE_LIMITS[type];
  const identifierHash = hashToken(identifier);

  const windowStart = new Date(
    Date.now() - config.windowMs,
  );

  try {
    return await prisma.$transaction(
      async (tx) => {
        const requests =
          await tx.authRequestLog.findMany({
            where: {
              type,
              identifierHash,
              createdAt: {
                gte: windowStart,
              },
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              createdAt: true,
            },
          });

        if (
          requests.length >=
          config.maxRequests
        ) {
          const oldestRequest =
            requests[0];

          const retryAt = new Date(
            oldestRequest.createdAt.getTime() +
              config.windowMs,
          );

          return {
            allowed: false,
            remaining: 0,
            retryAt,
          };
        }

        await tx.authRequestLog.create({
          data: {
            type,
            identifierHash,
            userId,
          },
        });

        return {
          allowed: true,
          remaining:
            config.maxRequests -
            requests.length -
            1,
          retryAt: null,
        };
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return consumeAuthRateLimit({
        type,
        identifier,
        userId,
      });
    }

    throw error;
  }
}