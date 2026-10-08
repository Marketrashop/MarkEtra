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
  request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      listingId,
    } = await params;

    const body =
      (await request.json()) as {
        reason?: unknown;
      };

    const reason =
      typeof body.reason ===
        "string"
        ? body.reason.trim()
        : "";

    if (!reason) {
      return NextResponse.json(
        {
          success: false,

          error:
            "A rejection reason is required.",
        },
        {
          status: 400,
        },
      );
    }

    const listing =
      await prisma.affiliateListing.findUnique({
        where: {
          id: listingId,
        },

        select: {
          id: true,

          userId: true,

          publicationStatus: true,

          product: {
            select: {
              name: true,
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
            "Only affiliate products currently under review can be rejected.",
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
                id: listingId,
              },

              data: {
                publicationStatus:
                  "REJECTED",

                reviewedAt:
                  new Date(),

                rejectionReason:
                  reason,

                status:
                  "PAUSED",

                publishedAt:
                  null,
              },
            });

          await tx.notification.create({
            data: {
              userId:
                listing.userId,

              title:
                "Affiliate product rejected",

              message:
                `Your affiliate product "${listing.product.name}" was not approved for publication. Reason: ${reason}`,

              type:
                "AFFILIATE_PRODUCT_REJECTED",
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
        "Affiliate product rejected.",
    });
  } catch (error) {
    console.error(
      "Failed to reject affiliate product:",
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
          "Failed to reject affiliate product.",
      },
      {
        status: 500,
      },
    );
  }
}