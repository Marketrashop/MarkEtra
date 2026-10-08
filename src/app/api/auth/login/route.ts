import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/auth/validation";

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid login details",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      email,
      password,
      rememberMe,
    } = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        {
          success: false,
          error: "Your account has been suspended",
          code: "ACCOUNT_SUSPENDED",
        },
        { status: 403 },
      );
    }

if (user.status === "DEACTIVATED") {
  return NextResponse.json(
    {
      success: false,
      error:
        "This account has been temporarily deactivated. Please contact support if you believe this was a mistake.",
      code: "ACCOUNT_DEACTIVATED",
    },
    { status: 403 },
  );
}

if (user.status === "PENDING_DELETION") {
  return NextResponse.json(
    {
      success: false,
      error:
        "This account has been permanently deleted. Please contact support if you believe this was a mistake.",
      code: "ACCOUNT_PENDING_DELETION",
    },
    { status: 403 },
  );
}

    await createSession({
      userId: user.id,
      rememberMe,
      userAgent: request.headers.get("user-agent"),
      ipAddress: getClientIp(request),
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to sign in",
      },
      { status: 500 },
    );
  }
}