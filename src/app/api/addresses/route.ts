import {
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  prisma,
} from "@/lib/prisma";

const createAddressSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name is required.",
      )
      .max(120),

    phoneNumber: z
      .string()
      .trim()
      .min(
        7,
        "Phone number is required.",
      )
      .max(30),

    alternatePhoneNumber:
      z
        .string()
        .trim()
        .max(30)
        .optional()
        .nullable(),

    addressLine1: z
      .string()
      .trim()
      .min(
        3,
        "Address is required.",
      )
      .max(200),

    addressLine2:
      z
        .string()
        .trim()
        .max(200)
        .optional()
        .nullable(),

    city: z
      .string()
      .trim()
      .min(
        2,
        "City is required.",
      )
      .max(100),

    state:
      z
        .string()
        .trim()
        .max(100)
        .optional()
        .nullable(),

    country: z
      .string()
      .trim()
      .min(
        2,
        "Country is required.",
      )
      .max(100),

    postalCode:
      z
        .string()
        .trim()
        .max(30)
        .optional()
        .nullable(),

    isPrimary:
      z.boolean().default(false),
  });

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

  return null;
}

export async function GET() {
  try {
    const session =
      await requireUser();

    const addresses =
      await prisma.address.findMany({
        where: {
          userId:
            session.user.id,
        },

        orderBy: [
          {
            isPrimary:
              "desc",
          },
          {
            createdAt:
              "desc",
          },
        ],
      });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Addresses GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load addresses.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const session =
      await requireUser();

    const body: unknown =
      await request.json();

    const parsed =
      createAddressSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid address details.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const data =
      parsed.data;

    const result =
      await prisma.$transaction(
        async (tx) => {
          const existingCount =
            await tx.address.count({
              where: {
                userId:
                  session.user.id,
              },
            });

          const shouldBePrimary =
            existingCount === 0 ||
            data.isPrimary;

          if (
            shouldBePrimary
          ) {
            await tx.address.updateMany({
              where: {
                userId:
                  session.user.id,

                isPrimary:
                  true,
              },

              data: {
                isPrimary:
                  false,
              },
            });
          }

          return tx.address.create({
            data: {
              userId:
                session.user.id,

              fullName:
                data.fullName,

              phoneNumber:
                data.phoneNumber,

              alternatePhoneNumber:
                data.alternatePhoneNumber ??
                null,

              addressLine1:
                data.addressLine1,

              addressLine2:
                data.addressLine2 ??
                null,

              city:
                data.city,

              state:
                data.state ??
                null,

              country:
                data.country,

              postalCode:
                data.postalCode ??
                null,

              isPrimary:
                shouldBePrimary,
            },
          });
        },
      );

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Addresses POST error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create address.",
      },
      {
        status: 500,
      },
    );
  }
}