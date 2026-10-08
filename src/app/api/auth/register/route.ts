import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/auth/validation";

function getClientIp(request: Request): string | null {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return (
      forwardedFor
        .split(",")[0]
        ?.trim() ?? null
    );
  }

  return request.headers.get("x-real-ip");
}

export async function POST(
  request: Request,
) {
  try {
    const body: unknown =
      await request.json();

    const parsed =
      registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid registration details",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      password,
      heardFrom,
    } = parsed.data;

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An account with this email already exists",
        },
        {
          status: 409,
        },
      );
    }

    const existingPhone =
      await prisma.user.findUnique({
        where: {
          phoneNumber,
        },

        select: {
          id: true,
        },
      });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An account with this phone number already exists",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await hashPassword(
        password,
      );

    const user =
      await prisma.$transaction(
        async (tx) => {
          const createdUser =
            await tx.user.create({
data: {
  firstName,
  lastName,
  phoneNumber,
  country,
  email,
  passwordHash,
  heardFrom:
    heardFrom || null,
  acceptedTermsAt:
    new Date(),

  status: "ACTIVE",

  emailVerifiedAt:
    new Date(),
},

              select: {
                id: true,
                email: true,
                status: true,
              },
            });

          await tx.wallet.create({
            data: {
              userId:
                createdUser.id,
            },
          });

          return createdUser;
        },
      );

    await createSession({
      userId: user.id,
      rememberMe: false,
      userAgent:
        request.headers.get(
          "user-agent",
        ),
      ipAddress:
        getClientIp(request),
    });

    return NextResponse.json(
      {
        success: true,

        user: {
          id: user.id,
          email: user.email,
          status: user.status,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create account",
      },
      {
        status: 500,
      },
    );
  }
}