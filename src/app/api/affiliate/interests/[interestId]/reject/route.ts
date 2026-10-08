import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireUser,
} from "@/lib/auth/user";

type RouteContext = {
  params: Promise<{
    interestId: string;
  }>;
};

export async function PATCH(
  _request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    const session =
      await requireUser();

    const {
      interestId,
    } = await params;

    const interest =
      await prisma.affiliateInterest.findUnique(
        {
          where: {
            id: interestId,
          },

          select: {
            id: true,

            status: true,

            listing: {
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
            },

            testBuyer: {
              select: {
                id: true,

                name: true,
              },
            },
          },
        },
      );

    if (!interest) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Affiliate interest not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      interest.listing.userId !==
      session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You do not have permission to reject this offer.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      interest.listing
        .publicationStatus !==
      "PUBLISHED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This affiliate product is not currently published.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      interest.status !==
        "PENDING" &&
      interest.status !==
        "NEGOTIATING"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This offer can no longer be rejected.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedInterest =
      await prisma.affiliateInterest.update(
        {
          where: {
            id: interestId,
          },

          data: {
            status: "REJECTED",
          },
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            session.user.id,

          type:
            "SYSTEM",

          title:
            "Offer rejected",

          message:
            `You've rejected ${interest.testBuyer.name}'s interest in "${interest.listing.product.name}".`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate offer rejection notification:",
        notificationError,
      );
    }

    return NextResponse.json({
      success: true,

      data: {
        id:
          updatedInterest.id,

        affiliateListingId:
          updatedInterest
            .affiliateListingId,

        testBuyerId:
          updatedInterest
            .testBuyerId,

        status:
          updatedInterest.status,

        offeredPrice:
          Number(
            updatedInterest
              .offeredPrice,
          ),

        createdAt:
          updatedInterest
            .createdAt
            .toISOString(),

        updatedAt:
          updatedInterest
            .updatedAt
            .toISOString(),
      },

      message:
        "Offer rejected successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to reject affiliate offer:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to reject affiliate offer.",
      },
      {
        status: 500,
      },
    );
  }
}