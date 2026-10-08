import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("token" in body) ||
      typeof body.token !== "string" ||
      !body.token.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification token is required",
        },
        { status: 400 },
      );
    }

    const token = body.token.trim();
    const tokenHash = hashToken(token);

    const verificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: {
          tokenHash,
        },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
          user: {
            select: {
              id: true,
              status: true,
              emailVerifiedAt: true,
            },
          },
        },
      });

    if (!verificationToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired verification link",
        },
        { status: 400 },
      );
    }

    if (verificationToken.usedAt) {
      return NextResponse.json(
        {
          success: false,
          error: "This verification link has already been used",
        },
        { status: 400 },
      );
    }

    if (verificationToken.expiresAt <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "This verification link has expired",
        },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const consumedToken = await tx.emailVerificationToken.updateMany({
        where: {
          id: verificationToken.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      if (consumedToken.count !== 1) {
        throw new Error("VERIFICATION_TOKEN_ALREADY_USED");
      }

      await tx.user.update({
        where: {
          id: verificationToken.userId,
        },
        data: {
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "VERIFICATION_TOKEN_ALREADY_USED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "This verification link has already been used",
        },
        { status: 400 },
      );
    }

    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify email address",
      },
      { status: 500 },
    );
  }
}
