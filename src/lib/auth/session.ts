import "server-only";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import { AUTH_CONSTANTS } from "./constants";
import { generateToken, hashToken } from "./tokens";

type CreateSessionInput = {
  userId: string;
  rememberMe?: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
};

function getSessionExpiration(rememberMe: boolean): Date {
  const timeout = rememberMe
    ? AUTH_CONSTANTS.REMEMBERED_SESSION_ABSOLUTE_TIMEOUT_MS
    : AUTH_CONSTANTS.SESSION_ABSOLUTE_TIMEOUT_MS;

  return new Date(Date.now() + timeout);
}

function getCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: expiresAt,
    path: "/",
  };
}

export async function createSession({
  userId,
  rememberMe = false,
  userAgent = null,
  ipAddress = null,
}: CreateSessionInput) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = getSessionExpiration(rememberMe);

await prisma.session.create({
  data: {
    userId,
    tokenHash,
    userAgent,
    ipAddress,
    rememberMe,
    expiresAt,
  },
  select: {
    id: true,
  },
});

const cookieStore = await cookies();

cookieStore.set(
  AUTH_CONSTANTS.SESSION_COOKIE_NAME,
  token,
  getCookieOptions(expiresAt),
);
}

export async function getCurrentSession(
  includeUser = true,
) {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_CONSTANTS.SESSION_COOKIE_NAME,
  )?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const now = new Date();

const session = await prisma.session.findUnique({
  where: {
    tokenHash,
  },

  select: {
    id: true,
    revokedAt: true,
    expiresAt: true,
    lastActivityAt: true,

user: {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    status: true,
    emailVerifiedAt: true,
    avatarKey: true,
  },
},
  },
});

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt <= now) {
    return null;
  }

  if (
    session.user.status !== "ACTIVE"
  ) {
    return null;
  }

  const idleDeadline = new Date(
    session.lastActivityAt.getTime() +
      AUTH_CONSTANTS.SESSION_IDLE_TIMEOUT_MS,
  );

  if (idleDeadline <= now) {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: now,
      },
    });

    return null;
  }

  return session;
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_CONSTANTS.SESSION_COOKIE_NAME,
  )?.value;

  if (token) {
    const tokenHash = hashToken(token);
    const now = new Date();

    await prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        lastActivityAt: now,
        revokedAt: now,
      },
    });
  }

  cookieStore.delete(
    AUTH_CONSTANTS.SESSION_COOKIE_NAME,
  );
}

export async function refreshSessionActivity(
  sessionId: string,
  lastActivityAt: Date,
) {
  const now = new Date();

  const refreshAfter =
    lastActivityAt.getTime() +
    AUTH_CONSTANTS.SESSION_ACTIVITY_REFRESH_INTERVAL_MS;

  if (now.getTime() < refreshAfter) {
    return false;
  }

  const result = await prisma.session.updateMany({
    where: {
      id: sessionId,
      lastActivityAt: {
        lt: new Date(refreshAfter),
      },
    },
    data: {
      lastActivityAt: now,
    },
  });

  return result.count > 0;
}