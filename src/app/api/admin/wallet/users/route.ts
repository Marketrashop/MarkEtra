import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Session Timeout. Please login again.",
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
      error:
        "Admin access required.",
    },
    {
      status: 403,
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

  if (
    error instanceof Error &&
    error.message ===
      "FORBIDDEN"
  ) {
    return forbiddenResponse();
  }

  return null;
}

export async function GET(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const search =
      request.nextUrl.searchParams
        .get("search")
        ?.trim() ?? "";

    const users =
      await prisma.user.findMany({
        where: search
          ? {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : undefined,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,

          firstName: true,

          lastName: true,

          email: true,

          status: true,

          createdAt: true,

          role: true,

          balance: true,

          profit: true,

          affiliateBalance: true,

          totalDeposit: true,

          wallet: {
            select: {
              id: true,

              availableBalance: true,

              lockedBalance: true,
            },
          },
        },

        take: 100,
      });

    return NextResponse.json(
      {
        success: true,

        data: users.map(
          (user) => {
            return {
              id:
                user.id,

              firstName:
                user.firstName,

              lastName:
                user.lastName,

              email:
                user.email,

              status:
                user.status,

              createdAt:
                user.createdAt,

              role:
                user.role,

              wallet:
                user.wallet
                  ? {
                      id:
                        user.wallet.id,

                      availableBalance:
                        user.wallet.availableBalance.toString(),

                      lockedBalance:
                        user.wallet.lockedBalance.toString(),
                    }
                  : null,

              profit:
                (
                  user.profit ??
                  0
                ).toString(),

              totalDeposit:
                (
                  user.totalDeposit ??
                  0
                ).toString(),

              affiliateCommission:
                (
                  user.affiliateBalance ??
                  0
                ).toString(),
            };
          },
        ),
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
      "Failed to fetch wallet users:",
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