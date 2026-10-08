import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user";
import { profileSchema } from "@/lib/profile/validation";

export async function GET() {
  try {
    const session = await requireUser();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        secondaryPhoneNumber: true,
        country: true,
        avatarKey: true,
        status: true,
        createdAt: true,
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

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load profile.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const session = await requireUser();

    const body: unknown =
      await request.json();

    const parsed =
      profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid profile details.",
          fieldErrors:
            parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      secondaryPhoneNumber,
      country,
      avatarKey,
    } = parsed.data;

    const phoneOwner =
      await prisma.user.findFirst({
        where: {
          phoneNumber,
          NOT: {
            id: session.user.id,
          },
        },
        select: {
          id: true,
        },
      });

    if (phoneOwner) {
      return NextResponse.json(
        {
          success: false,
          error:
            "That phone number is already in use.",
        },
        {
          status: 409,
        },
      );
    }

    if (secondaryPhoneNumber) {
      const secondaryOwner =
        await prisma.user.findFirst({
          where: {
            secondaryPhoneNumber,
            NOT: {
              id: session.user.id,
            },
          },
          select: {
            id: true,
          },
        });

      if (secondaryOwner) {
        return NextResponse.json(
          {
            success: false,
            error:
              "That secondary phone number is already in use.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const updated =
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
data: {
  firstName,
  lastName,
  phoneNumber,
  secondaryPhoneNumber:
    secondaryPhoneNumber || null,
  country,

  ...(avatarKey !== undefined
    ? {
        avatarKey:
          avatarKey || null,
      }
    : {}),
},
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          secondaryPhoneNumber: true,
          country: true,
          avatarKey: true,
          status: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update profile.",
      },
      {
        status: 500,
      },
    );
  }
}