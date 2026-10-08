import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

type UserAction =
  | "activate"
  | "deactivate"
  | "restore"
  | "approveDeletion"
  | "delete"
  | "updateRole";

type UserRole =
  | "USER"
  | "ADMIN";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type Body = {
  action: UserAction;
  role?: UserRole;
};

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
      error: "Admin access required.",
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

export async function PATCH(
  request: Request,
  { params }: Params,
) {
  try {
    const session =
      await requireAdmin();

    const { id } = await params;

    const body: Body =
      await request.json();

    const user =
      await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          role: true,
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

    switch (body.action) {
      case "activate":
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "ACTIVE",
            deletedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message:
            "User activated successfully.",
        });

      case "deactivate":
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "DEACTIVATED",
            deletedAt: new Date(),
          },
        });

        await prisma.session.deleteMany({
          where: {
            userId: user.id,
          },
        });

        return NextResponse.json({
          success: true,
          message:
            "User deactivated successfully.",
        });

      case "restore":
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "ACTIVE",
            deletedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message:
            "User restored successfully.",
        });

      case "approveDeletion":
        await prisma.$transaction([
          prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              status: "DEACTIVATED",
              deletedAt: new Date(),
            },
          }),

          prisma.session.deleteMany({
            where: {
              userId: user.id,
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message:
            "Deletion request approved.",
        });

      case "delete":
        await prisma.$transaction([
          prisma.session.deleteMany({
            where: {
              userId: user.id,
            },
          }),

          prisma.user.delete({
            where: {
              id: user.id,
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message:
            "User deleted permanently.",
        });

      case "updateRole": {
        if (
          body.role !== "USER" &&
          body.role !== "ADMIN"
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Invalid user role.",
            },
            {
              status: 400,
            },
          );
        }

        if (
          session.user.id === user.id &&
          body.role === "USER"
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "You cannot remove ADMIN access from your own account.",
            },
            {
              status: 400,
            },
          );
        }

        if (
          body.role === user.role
        ) {
          return NextResponse.json({
            success: true,
            message:
              "User role is already set.",
            role: user.role,
          });
        }

        const updatedUser =
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              role: body.role,
            },
            select: {
              id: true,
              role: true,
            },
          });

        return NextResponse.json({
          success: true,
          message:
            "User role updated successfully.",
          user: updatedUser,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action.",
          },
          {
            status: 400,
          },
        );
    }
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Failed to update user:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update user.",
      },
      {
        status: 500,
      },
    );
  }
}