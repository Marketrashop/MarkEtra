import {
  NextResponse,
} from "next/server";

import {
  Prisma,
} from "../../../../../../../../generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

type RouteContext = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function PATCH(
  _request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      listingId,
    } = await params;

    const listing =
      await prisma.affiliateListing.findUnique({
        where: {
          id:
            listingId,
        },

        select: {
          id:
            true,

          userId:
            true,

          publicationStatus:
            true,

          product: {
            select: {
              name:
                true,
            },
          },
        },
      });

    if (!listing) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Affiliate listing not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      listing.publicationStatus !==
      "IN_REVIEW"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only affiliate products currently under review can be approved.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedListing =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.affiliateListing.update({
              where: {
                id:
                  listingId,
              },

              data: {
                publicationStatus:
                  "APPROVED",

                reviewedAt:
                  new Date(),

                rejectionReason:
                  null,
              },
            });

          await tx.notification.create({
            data: {
              userId:
                listing.userId,

              title:
                "Affiliate product approved",

              message:
                `Your affiliate product "${listing.product.name}" has been approved and is ready for publication.`,

              type:
                "AFFILIATE_PRODUCT_APPROVED",
            },
          });

          return updated;
        },
      );

    return NextResponse.json({
      success: true,

      data:
        updatedListing,

      message:
        "Affiliate product approved successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to approve affiliate product:",
      error,
    );

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (
        error.code ===
        "P2025"
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              "Affiliate listing not found.",
          },
          {
            status: 404,
          },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to approve affiliate product.",
      },
      {
        status: 500,
      },
    );
  }
}