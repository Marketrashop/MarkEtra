import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/auth/tokens";
import { consumeAuthRateLimit } from "@/lib/auth/rate-limit";
import { MAIL_CONFIG } from "@/mail/config";
import {
  buildPasswordResetEmail,
  sendMail,
} from "@/mail";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is required",
        },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is required",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        status: true,
      },
    });

    const rateLimit = await consumeAuthRateLimit({
      type: "PASSWORD_RESET",
      identifier: email,
      userId: user?.id ?? null,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You have reached the maximum number of password reset requests. Please try again after 24 hours.",
          retryAt: rateLimit.retryAt?.toISOString() ?? null,
        },
        { status: 429 },
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a password reset email has been sent.",
        },
        { status: 200 },
      );
    }

    if (
      user.status === "SUSPENDED" ||
      user.status === "DEACTIVATED"
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a password reset email has been sent.",
        },
        { status: 200 },
      );
    }

    const {
      token,
      tokenHash,
      expiresAt,
    } = generatePasswordResetToken();

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    const resetUrl = new URL(
      "/reset-password",
      MAIL_CONFIG.appUrl,
    );

    resetUrl.searchParams.set(
      "token",
      token,
    );

    const resetEmail = buildPasswordResetEmail({
      firstName: user.firstName,
      resetUrl: resetUrl.toString(),
    });

    await sendMail({
      to: user.email,
      subject: resetEmail.subject,
      text: resetEmail.text,
      html: resetEmail.html,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset email has been sent.",
        remaining: rateLimit.remaining,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Password reset request error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process password reset request",
      },
      { status: 500 },
    );
  }
}
