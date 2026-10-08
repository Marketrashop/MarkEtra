import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";
import { validateResetPassword } from "@/components/auth/AuthValidation";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        { status: 400 },
      );
    }

    if (
      !("token" in body) ||
      typeof body.token !== "string" ||
      !body.token.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Password reset token is required.",
        },
        { status: 400 },
      );
    }

    if (
      !("password" in body) ||
      typeof body.password !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is required.",
        },
        { status: 400 },
      );
    }

    if (
      !("confirmPassword" in body) ||
      typeof body.confirmPassword !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Password confirmation is required.",
        },
        { status: 400 },
      );
    }

    const token = body.token.trim();

    const password = body.password;

    const confirmPassword =
      body.confirmPassword;

    const validation =
      validateResetPassword({
        password,
        confirmPassword,
      });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            validation.message ??
            "Invalid password.",
        },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(token);

    const resetToken =
      await prisma.passwordResetToken.findFirst({
        where: {
          tokenHash,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    const passwordHash =
      await hashPassword(password);

    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: {
            id: resetToken.userId,
          },
          data: {
            passwordHash,
          },
        });

        await tx.passwordResetToken.update({
          where: {
            id: resetToken.id,
          },
          data: {
            usedAt: new Date(),
          },
        });

        await tx.passwordResetToken.updateMany({
          where: {
            userId: resetToken.userId,
            usedAt: null,
            id: {
              not: resetToken.id,
            },
          },
          data: {
            usedAt: new Date(),
          },
        });
      },
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Your password has been updated successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Password reset confirmation error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update your password. Please try again.",
      },
      { status: 500 },
    );
  }
}