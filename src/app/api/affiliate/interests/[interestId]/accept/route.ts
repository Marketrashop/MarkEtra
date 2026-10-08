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
  buildAffiliateNegotiationAcceptedEmail,
  buildAffiliatePaymentRequiredEmail,
  sendMail,
} from "@/mail";

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
            id:
              interestId,
          },

          select: {
            id: true,

            status:
              true,

            offeredPrice:
              true,

            transaction: {
              select: {
                id: true,

                status:
                  true,
              },
            },

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
                  },
                },

                subscription: {
                  select: {
                    commissionRate:
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
      interest.listing.userId !==
      session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "You do not have permission to accept this offer.",
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
            "This offer can no longer be accepted.",
        },
        {
          status: 400,
        },
      );
    }

    if (interest.transaction) {
      return NextResponse.json(
        {
          success: false,

          error:
            "A transaction already exists for this offer.",
        },
        {
          status: 409,
        },
      );
    }

    const agreedPrice =
      interest.offeredPrice;

    const commissionRate =
      interest.listing
        .subscription
        .commissionRate;

    const commissionAmount =
      agreedPrice
        .mul(
          commissionRate,
        )
        .div(100);

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
                    "ACCEPTED",
                },
              },
            );

          const transaction =
            await tx.affiliateTransaction.create(
              {
                data: {
                  interestId,

                  agreedPrice,

                  commissionRate,

                  commissionAmount,

                  status:
                    "AWAITING_PAYMENT",
                },
              },
            );

          return {
            updatedInterest,

            transaction,
          };
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            session.user.id,

          type:
            "AFFILIATE_OFFER_ACCEPTED",

          title:
            "Offer accepted",

          message:
            `You've accepted ${interest.testBuyer.name}'s offer of $${agreedPrice.toFixed(
              2,
            )} for "${interest.listing.product.name}". The transaction is now awaiting payment.`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate offer acceptance notification:",
        notificationError,
      );
    }

    if (
      interest.testBuyer.email
    ) {
      const affiliateName =
        `${interest.listing.user.firstName} ${interest.listing.user.lastName}`.trim();

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000";

      try {
        const email =
          buildAffiliateNegotiationAcceptedEmail(
            {
              buyerName:
                interest.testBuyer.name,

              affiliateName:
                affiliateName ||
                "MarkEtra Affiliate",

              productName:
                interest.listing
                  .product.name,

              agreedPrice:
                Number(
                  result
                    .transaction
                    .agreedPrice,
                ),

              reviewUrl:
                `${appUrl}/affiliate`,
            },
          );

        await sendMail({
          to:
            interest.testBuyer.email,

          subject:
            "Your affiliate offer has been accepted",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate negotiation accepted email:",
          emailError,
        );
      }

      try {
        const email =
          buildAffiliatePaymentRequiredEmail(
            {
              buyerName:
                interest.testBuyer.name,

              affiliateName:
                affiliateName ||
                "MarkEtra Affiliate",

              productName:
                interest.listing
                  .product.name,

              agreedPrice:
                Number(
                  result
                    .transaction
                    .agreedPrice,
                ),

              paymentUrl:
                `${appUrl}/affiliate`,
            },
          );

        await sendMail({
          to:
            interest.testBuyer.email,

          subject:
            "Payment required for your affiliate purchase",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate payment required email:",
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

        testBuyerId:
          result
            .updatedInterest
            .testBuyerId,

        status:
          result
            .updatedInterest
            .status,

        offeredPrice:
          Number(
            result
              .updatedInterest
              .offeredPrice,
          ),

        createdAt:
          result
            .updatedInterest
            .createdAt
            .toISOString(),

        updatedAt:
          result
            .updatedInterest
            .updatedAt
            .toISOString(),

        transaction: {
          id:
            result
              .transaction
              .id,

          interestId:
            result
              .transaction
              .interestId,

          agreedPrice:
            Number(
              result
                .transaction
                .agreedPrice,
            ),

          commissionRate:
            Number(
              result
                .transaction
                .commissionRate,
            ),

          commissionAmount:
            Number(
              result
                .transaction
                .commissionAmount,
            ),

          status:
            result
              .transaction
              .status,

          paidAt:
            result
              .transaction
              .paidAt,

          escrowedAt:
            result
              .transaction
              .escrowedAt,

          completedAt:
            result
              .transaction
              .completedAt,

          cancelledAt:
            result
              .transaction
              .cancelledAt,

          createdAt:
            result
              .transaction
              .createdAt
              .toISOString(),

          updatedAt:
            result
              .transaction
              .updatedAt
              .toISOString(),
        },
      },

      message:
        "Offer accepted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to accept affiliate offer:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to accept affiliate offer.",
      },
      {
        status: 500,
      },
    );
  }
}