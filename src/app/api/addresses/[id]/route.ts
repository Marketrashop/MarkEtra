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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const updateAddressSchema =
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
      z.boolean(),
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

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireUser();

    const { id } =
      await params;

    const address =
      await prisma.address.findFirst({
        where: {
          id,

          userId:
            session.user.id,
        },
      });

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Address not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Address GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load address.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireUser();

    const { id } =
      await params;

    const body: unknown =
      await request.json();

    const parsed =
      updateAddressSchema.safeParse(
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

    const existing =
      await prisma.address.findFirst({
        where: {
          id,

          userId:
            session.user.id,
        },

        select: {
          id: true,
          isPrimary: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Address not found.",
        },
        {
          status: 404,
        },
      );
    }

    const data =
      parsed.data;

    const updated =
      await prisma.$transaction(
        async (tx) => {
          if (
            data.isPrimary
          ) {
            await tx.address.updateMany({
              where: {
                userId:
                  session.user.id,

                isPrimary:
                  true,

                NOT: {
                  id,
                },
              },

              data: {
                isPrimary:
                  false,
              },
            });
          }

          if (
            existing.isPrimary &&
            !data.isPrimary
          ) {
            const replacement =
              await tx.address.findFirst({
                where: {
                  userId:
                    session.user.id,

                  isPrimary:
                    false,

                  NOT: {
                    id,
                  },
                },

                orderBy: {
                  createdAt:
                    "desc",
                },

                select: {
                  id: true,
                },
              });

            if (replacement) {
              await tx.address.update({
                where: {
                  id:
                    replacement.id,
                },

                data: {
                  isPrimary:
                    true,
                },
              });
            } else {
              return tx.address.update({
                where: {
                  id,
                },

                data: {
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
                    true,
                },
              });
            }
          }

          return tx.address.update({
            where: {
              id,
            },

            data: {
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
                data.isPrimary,
            },
          });
        },
      );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Address PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update address.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireUser();

    const { id } =
      await params;

    const existing =
      await prisma.address.findFirst({
        where: {
          id,

          userId:
            session.user.id,
        },

        select: {
          id: true,
          isPrimary: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Address not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.address.delete({
          where: {
            id,
          },
        });

        if (
          existing.isPrimary
        ) {
          const replacement =
            await tx.address.findFirst({
              where: {
                userId:
                  session.user.id,
              },

              orderBy: {
                createdAt:
                  "desc",
              },

              select: {
                id: true,
              },
            });

          if (replacement) {
            await tx.address.update({
              where: {
                id:
                  replacement.id,
              },

              data: {
                isPrimary:
                  true,
              },
            });
          }
        }
      },
    );

    return NextResponse.json({
      success: true,
      message:
        "Address deleted successfully.",
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    console.error(
      "Address DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete address.",
      },
      {
        status: 500,
      },
    );
  }
}