import { handle } from "@upstash/realtime";

import { prisma } from "@/lib/prisma";
import { AUTH_CONSTANTS } from "@/lib/auth/constants";
import { hashToken } from "@/lib/auth/tokens";

import {
  realtime,
} from "@/lib/realtime/affiliate-negotiation";

const INTEREST_CHANNEL_PREFIX =
  "affiliate-interest-";

export const GET = handle({
  realtime,

  middleware: async ({
    request,
    channels,
  }) => {
    const interestIds = channels
      .filter((channel) =>
        channel.startsWith(
          INTEREST_CHANNEL_PREFIX,
        ),
      )
      .map((channel) =>
        channel.slice(
          INTEREST_CHANNEL_PREFIX.length,
        ),
      )
      .filter(Boolean);

    if (
      interestIds.length === 0
    ) {
      return;
    }

    const token = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith(
          `${AUTH_CONSTANTS.SESSION_COOKIE_NAME}=`,
        ),
      )
      ?.split("=")
      .slice(1)
      .join("=");

    if (!token) {
      throw new Error(
        "UNAUTHENTICATED",
      );
    }

    const tokenHash =
      hashToken(token);

    const session =
      await prisma.session.findUnique({
        where: {
          tokenHash,
        },
        select: {
          revokedAt: true,
          expiresAt: true,
          lastActivityAt: true,
          user: {
            select: {
              id: true,
              role: true,
              status: true,
            },
          },
        },
      });

    if (!session) {
      throw new Error(
        "UNAUTHENTICATED",
      );
    }

    const now = new Date();

    if (
      session.revokedAt ||
      session.expiresAt <= now ||
      session.user.status !==
        "ACTIVE"
    ) {
      throw new Error(
        "UNAUTHENTICATED",
      );
    }

    const interests =
      await prisma.affiliateInterest.findMany(
        {
          where: {
            id: {
              in: interestIds,
            },
          },
          select: {
            id: true,
            listing: {
              select: {
                userId: true,
              },
            },
          },
        },
      );

    const interestMap =
      new Map(
        interests.map(
          (interest) => [
            interest.id,
            interest.listing.userId,
          ],
        ),
      );

    for (const interestId of interestIds) {
      const listingOwnerId =
        interestMap.get(
          interestId,
        );

      if (!listingOwnerId) {
        throw new Error(
          "FORBIDDEN",
        );
      }

      const isAdmin =
        session.user.role ===
        "ADMIN";

      const isOwner =
        listingOwnerId ===
        session.user.id;

      if (
        !isAdmin &&
        !isOwner
      ) {
        throw new Error(
          "FORBIDDEN",
        );
      }
    }
  },
});