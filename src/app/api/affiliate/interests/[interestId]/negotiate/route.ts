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
  buildAffiliateNegotiationMessageEmail,
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
    const session =
      await requireUser();

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

            affiliateListingId:
              true,

            status:
              true,

            offeredPrice:
              true,

            listing: {
              select: {
                id: true,

                userId: true,

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
                    name: true,
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
      interest.listing.userId !==
      session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You do not have permission to negotiate this interest.",
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
            "Negotiation is only available for published affiliate products.",
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

    const negotiationPrice =
      offeredPrice;

    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedInterest =
            await tx.affiliateInterest.update(
              {
                where: {
                  id:
                    interestId,
                },

                data: {
                  status:
                    "NEGOTIATING",

                  ...(negotiationPrice !==
                    null
                    ? {
                        offeredPrice:
                          negotiationPrice,
                      }
                    : {}),
                },
              },
            );

          const negotiationMessage =
            await tx.affiliateNegotiationMessage.create(
              {
                data: {
                  interestId,

                  senderUserId:
                    session.user.id,

                  message,

                  offeredPrice:
                    negotiationPrice,
                },
              },
            );

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
        "USER",

      senderName:
        `${interest.listing.user.firstName} ${interest.listing.user.lastName}`.trim(),

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
            session.user.id,

          type:
            "AFFILIATE_NEGOTIATION_MESSAGE",

          title:
            "Negotiation message sent",

          message:
            `Your message for "${interest.listing.product.name}" was sent to ${interest.testBuyer.name}.`,
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
      interest.testBuyer.email
    ) {
      try {
        const affiliateName =
          `${interest.listing.user.firstName} ${interest.listing.user.lastName}`.trim();

        const email =
          buildAffiliateNegotiationMessageEmail(
            {
              buyerName:
                interest.testBuyer.name,

              affiliateName:
                affiliateName ||
                "MarkEtra Affiliate",

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
            },
          );

        await sendMail({
          to:
            interest.testBuyer.email,

          subject:
            "New message about your affiliate offer",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate negotiation message email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data: {
        id:
          result
            .updatedInterest
            .id,

        affiliateListingId:
          result
            .updatedInterest
            .affiliateListingId,

        status:
          result
            .updatedInterest
            .status,

        message: {
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
        },
      },

      message:
        "Negotiation message sent successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to negotiate affiliate interest:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to send negotiation message.",
      },
      {
        status: 500,
      },
    );
  }
}