import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  getAffiliateNegotiationChannel,
  realtime,
} from "@/lib/realtime/affiliate-negotiation";

export async function POST(
  request: Request,
) {
  try {
    const session =
      await requireUser();

    const body =
      await request.json();

    const interestId =
      typeof body.interestId ===
      "string"
        ? body.interestId.trim()
        : "";

    const isTyping =
      typeof body.isTyping ===
      "boolean"
        ? body.isTyping
        : null;

    if (
      !interestId ||
      isTyping === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid typing payload.",
        },
        {
          status: 400,
        },
      );
    }

    const interest =
      await prisma.affiliateInterest.findUnique(
        {
          where: {
            id: interestId,
          },

          select: {
            id: true,

            listing: {
              select: {
                userId: true,
              },
            },

            testBuyer: {
              select: {
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
            "Interest not found.",
        },
        {
          status: 404,
        },
      );
    }

    const isAdmin =
      session.user.role ===
      "ADMIN";

    const isOwner =
      interest.listing.userId ===
      session.user.id;

    if (
      !isAdmin &&
      !isOwner
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden.",
        },
        {
          status: 403,
        },
      );
    }

    const senderType =
      isAdmin
        ? "TEST_BUYER"
        : "USER";

    const senderName =
      isAdmin
        ? interest.testBuyer.name
        : `${session.user.firstName} ${session.user.lastName}`.trim();

    await realtime
      .channel(
        getAffiliateNegotiationChannel(
          interestId,
        ),
      )
      .emit(
        "affiliate.negotiationTyping",
        {
          interestId,

          senderUserId:
            session.user.id,

          senderType,

          senderName,

          isTyping,
        },
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Affiliate typing realtime error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update typing status.",
      },
      {
        status: 500,
      },
    );
  }
}