import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { consumeAuthRateLimit } from "@/lib/auth/rate-limit";
import { MAIL_CONFIG } from "@/mail/config";
import {
  buildVerificationEmail,
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
        emailVerifiedAt: true,
      },
    });

    const rateLimit = await consumeAuthRateLimit({
      type: "EMAIL_VERIFICATION_RESEND",
      identifier: email,
      userId: user?.id ?? null,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You have reached the maximum number of verification email requests. Please try again after 24 hours.",
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
            "If an account with that email exists, a verification email has been sent.",
        },
        { status: 200 },
      );
    }

    if (user.emailVerifiedAt || user.status === "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: "This email address has already been verified",
        },
        { status: 400 },
      );
    }

    const {
      token,
      tokenHash,
      expiresAt,
    } = generateVerificationToken();

    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    const verificationUrl = new URL(
      "/verify-email",
      MAIL_CONFIG.appUrl,
    );

    verificationUrl.searchParams.set(
      "token",
      token,
    );

    const verificationEmail = buildVerificationEmail({
      firstName: user.firstName,
      verificationUrl: verificationUrl.toString(),
    });

    await sendMail({
      to: user.email,
      subject: verificationEmail.subject,
      text: verificationEmail.text,
      html: verificationEmail.html,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent successfully",
        remaining: rateLimit.remaining,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Resend verification error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to send verification email",
      },
      { status: 500 },
    );
  }
}
