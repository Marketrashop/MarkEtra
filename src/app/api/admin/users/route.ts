import { NextResponse } from "next/server";

import {
  UserRole,
  UserStatus,
} from "../../../../../generated/prisma/client";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ALLOWED_STATUSES = [
  "ACTIVE",
  "DEACTIVATED",
  "PENDING_DELETION",
] as const;

const ALLOWED_ROLES = [
  "USER",
  "ADMIN",
] as const;

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

function parsePositiveInteger(
  value: string | null,
  fallback: number,
) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    return fallback;
  }

  return parsed;
}

export async function GET(
  request: Request,
) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(
      request.url,
    );

    const page =
      parsePositiveInteger(
        searchParams.get("page"),
        DEFAULT_PAGE,
      );

    const limit = Math.min(
      parsePositiveInteger(
        searchParams.get("limit"),
        DEFAULT_LIMIT,
      ),
      MAX_LIMIT,
    );

    const skip =
      (page - 1) * limit;

    const search =
      searchParams
        .get("search")
        ?.trim() ?? "";

    const statusParam =
      searchParams.get("status");

    const status =
      statusParam &&
      ALLOWED_STATUSES.includes(
        statusParam as (typeof ALLOWED_STATUSES)[number],
      )
        ? (statusParam as
            | "ACTIVE"
            | "DEACTIVATED"
            | "PENDING_DELETION")
        : "ALL";

    const roleParam =
      searchParams.get("role");

    const role =
      roleParam &&
      ALLOWED_ROLES.includes(
        roleParam as (typeof ALLOWED_ROLES)[number],
      )
        ? (roleParam as
            (typeof ALLOWED_ROLES)[number])
        : "USER";

    const where = {
      role:
        role === "ADMIN"
          ? UserRole.ADMIN
          : UserRole.USER,

      ...(status !== "ALL"
        ? {
            status: UserStatus[status],
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                },
              },
              {
                lastName: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
    };

    const [totalUsers, users] =
      await Promise.all([
        prisma.user.count({
          where,
        }),

        prisma.user.findMany({
          where,

          orderBy: {
            createdAt: "desc",
          },

          skip,

          take: limit,

          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            avatarKey: true,
            role: true,
            status: true,
            country: true,
            createdAt: true,
            deletedAt: true,

            wallet: {
              select: {
                availableBalance: true,
              },
            },
          },
        }),
      ]);

    const totalPages = Math.max(
      1,
      Math.ceil(
        totalUsers / limit,
      ),
    );

    return NextResponse.json(
      {
        success: true,

        data: {
          users: users.map((user) => ({
            ...user,
            balance: Number(
              user.wallet?.availableBalance ?? 0,
            ),
          })),

          pagination: {
            page,
            limit,
            total: totalUsers,
            totalPages,
          },
        },
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
      "Failed to fetch users:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch users.",
      },
      {
        status: 500,
      },
    );
  }
}