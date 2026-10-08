import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  buildAffiliateNegotiationReplyEmail,
  sendMail,
} from "@/mail";

import {
  getAffiliateNegotiationChannel,
  realtime,
} from "@/lib/realtime/affiliate-negotiation";

type RouteContext = {
  params: Promise<{
    interestId: string;
  }>;
};

export async function POST(
  request: Request,
  {
    params,
  }: RouteContext,
) {
  try {
    const admin =
      await requireAdmin();

    const {
      interestId,
    } = await params;

    const body =
      await request.json();

    const message =
      typeof body.message ===
        "string"
        ? body.message.trim()
        : "";

    const hasOfferedPrice =
      body.offeredPrice !==
        undefined &&
      body.offeredPrice !==
        null &&
      body.offeredPrice !== "";

    const offeredPrice =
      hasOfferedPrice
        ? Number(
            body.offeredPrice,
          )
        : null;

    if (!message) {
      return NextResponse.json(
        {
          success: false,

          error:
            "A negotiation message is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      offeredPrice !== null &&
      (!Number.isFinite(
        offeredPrice,
      ) ||
        offeredPrice <= 0)
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Offered price must be greater than zero.",
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
            id:
              interestId,
          },

          select: {
            id: true,

            status:
              true,

            listing: {
              select: {
                id: true,

                userId:
                  true,

                publicationStatus:
                  true,

                user: {
                  select: {
                    firstName:
                      true,

                    lastName:
                      true,

                    email:
                      true,
                  },
                },

                product: {
                  select: {
                    name:
                      true,
                  },
                },
              },
            },

            testBuyer: {
              select: {
                id:
                  true,

                name:
                  true,

                email:
                  true,
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
            "This interest is no longer available for negotiation.",
        },
        {
          status: 400,
        },
      );
    }

const result =
  await prisma.$transaction(
    async (tx) => {
      const updatedInterest =
        await tx.affiliateInterest.update({
          where: {
            id: interestId,
          },

          data: {
            status: "NEGOTIATING",

            ...(offeredPrice !== null
              ? {
                  offeredPrice,
                }
              : {}),
          },
        });

      const negotiationMessage =
        await tx.affiliateNegotiationMessage.create({
          data: {
            interestId,

            senderUserId:
              admin.user.id,

            message,

            offeredPrice,
          },
        });

      return {
        updatedInterest,
        negotiationMessage,
      };
    },
  );

await realtime
  .channel(
    getAffiliateNegotiationChannel(
      interestId,
    ),
  )
  .emit(
    "affiliate.negotiationMessage",
    {
      id:
        result
          .negotiationMessage
          .id,

      interestId,

      senderUserId:
        result
          .negotiationMessage
          .senderUserId,

      message:
        result
          .negotiationMessage
          .message,

      offeredPrice:
        result
          .negotiationMessage
          .offeredPrice !==
        null
          ? Number(
              result
                .negotiationMessage
                .offeredPrice,
            )
          : null,

      createdAt:
        result
          .negotiationMessage
          .createdAt
          .toISOString(),

      senderType:
        "TEST_BUYER",

      senderName:
        interest.testBuyer.name,

      interestStatus:
        result
          .updatedInterest
          .status,
    },
  );

    try {
      await prisma.notification.create({
        data: {
          userId:
            interest.listing.userId,

          type:
            "AFFILIATE_NEGOTIATION_MESSAGE",

          title:
            `${interest.testBuyer.name} replied to your negotiation`,

          message:
            offeredPrice !==
            null
              ? `${interest.testBuyer.name} replied to your negotiation with an offer of $${offeredPrice.toFixed(
                  2,
                )}.`
              : `${interest.testBuyer.name} replied to your negotiation.`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate negotiation notification:",
        notificationError,
      );
    }

    if (
      interest.listing.user.email
    ) {
      try {
        const affiliateName =
          `${interest.listing.user.firstName} ${interest.listing.user.lastName}`.trim();

        const email =
          buildAffiliateNegotiationReplyEmail(
            {
              affiliateFirstName:
                interest.listing.user.firstName,

              buyerName:
                interest.testBuyer.name,

              productName:
                interest.listing
                  .product.name,

              message:
                result
                  .negotiationMessage
                  .message,

              offeredPrice:
                result
                  .negotiationMessage
                  .offeredPrice ===
                null
                  ? null
                  : Number(
                      result
                        .negotiationMessage
                        .offeredPrice,
                    ),

              reviewUrl:
                `${
                  process.env
                    .NEXT_PUBLIC_APP_URL ??
                  "http://localhost:3000"
                }/affiliate`,
            },
          );

        await sendMail({
          to:
            interest.listing.user
              .email,

          subject:
            "The buyer replied to your negotiation",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate negotiation reply email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data: {
        id:
          result
            .negotiationMessage
            .id,

        interestId:
          result
            .negotiationMessage
            .interestId,

        senderUserId:
          result
            .negotiationMessage
            .senderUserId,

        message:
          result
            .negotiationMessage
            .message,

        offeredPrice:
          result
            .negotiationMessage
            .offeredPrice ===
          null
            ? null
            : Number(
                result
                  .negotiationMessage
                  .offeredPrice,
              ),

        createdAt:
          result
            .negotiationMessage
            .createdAt
            .toISOString(),

        senderType:
          "TEST_BUYER",

        senderName:
          interest.testBuyer
            .name,

        interestStatus:
          result
            .updatedInterest
            .status,
      },

      message:
        "Buyer negotiation message sent successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to send admin affiliate negotiation message:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to send buyer negotiation message.",
      },
      {
        status: 500,
      },
    );
  }
}