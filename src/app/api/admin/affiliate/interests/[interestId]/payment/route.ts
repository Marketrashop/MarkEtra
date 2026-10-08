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
  buildAffiliateEscrowStartedEmail,
  buildAffiliatePaymentReceivedEmail,
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
    await requireAdmin();

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

            listing: {
              select: {
                publicationStatus:
                  true,

                userId:
                  true,

                user: {
                  select: {
                    firstName:
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
                name:
                  true,
              },
            },

            transaction: {
              select: {
                id:
                  true,

                status:
                  true,

                agreedPrice:
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

    if (!interest.transaction) {
      return NextResponse.json(
        {
          success: false,

          error:
            "No transaction exists for this interest.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      interest.transaction
        .status !==
      "AWAITING_PAYMENT"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This transaction is not awaiting payment.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      interest.status !==
      "ACCEPTED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only accepted offers can be marked as paid.",
        },
        {
          status: 400,
        },
      );
    }

    const now =
      new Date();

    const transaction =
      await prisma.affiliateTransaction.update(
        {
          where: {
            id:
              interest.transaction
                .id,
          },

          data: {
            status:
              "IN_ESCROW",

            paidAt:
              now,

            escrowedAt:
              now,
          },
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            interest.listing.userId,

          type:
            "AFFILIATE_PAYMENT_CONFIRMED",

          title:
            "Affiliate payment confirmed",

          message:
            `${interest.testBuyer.name} has paid $${Number(
              transaction.agreedPrice,
            ).toFixed(
              2,
            )} for "${interest.listing.product.name}". The transaction is now in escrow.`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate payment notification:",
        notificationError,
      );
    }

    if (
      interest.listing.user.email
    ) {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000";

      const affiliateFirstName =
        interest.listing.user
          .firstName;

      if (
        affiliateFirstName
          .trim()
          .length > 0
      ) {
        try {
          const email =
            buildAffiliatePaymentReceivedEmail(
              {
                affiliateFirstName,

                buyerName:
                  interest.testBuyer
                    .name,

                productName:
                  interest.listing
                    .product.name,

                agreedPrice:
                  Number(
                    transaction
                      .agreedPrice,
                  ),

                escrowUrl:
                  `${appUrl}/affiliate`,
              },
            );

          await sendMail({
            to:
              interest.listing.user
                .email,

            subject:
              "Payment received for your affiliate sale",

            html:
              email.html,

            text:
              email.text,
          });
        } catch (
          emailError
        ) {
          console.error(
            "Failed to send affiliate payment received email:",
            emailError,
          );
        }
      }

      try {
        const email =
          buildAffiliateEscrowStartedEmail(
            {
              affiliateFirstName:
                affiliateFirstName ||
                "Affiliate",

              buyerName:
                interest.testBuyer
                  .name,

              productName:
                interest.listing
                  .product.name,

              agreedPrice:
                Number(
                  transaction
                    .agreedPrice,
                ),

              transactionUrl:
                `${appUrl}/affiliate`,
            },
          );

        await sendMail({
          to:
            interest.listing.user
              .email,

          subject:
            "Your affiliate transaction is now in escrow",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate escrow started email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data: {
        transaction: {
          id:
            transaction.id,

          interestId:
            interest.id,

          agreedPrice:
            Number(
              transaction.agreedPrice,
            ),

          commissionRate:
            Number(
              transaction
                .commissionRate,
            ),

          commissionAmount:
            Number(
              transaction
                .commissionAmount,
            ),

          status:
            transaction.status,

          paidAt:
            transaction.paidAt
              ?.toISOString() ??
            null,

          escrowedAt:
            transaction.escrowedAt
              ?.toISOString() ??
            null,

          completedAt:
            transaction.completedAt
              ?.toISOString() ??
            null,

          cancelledAt:
            transaction.cancelledAt
              ?.toISOString() ??
            null,

          createdAt:
            transaction.createdAt
              .toISOString(),

          updatedAt:
            transaction.updatedAt
              .toISOString(),
        },
      },

      message:
        "Payment confirmed and transaction moved to escrow.",
    });
  } catch (error) {
    console.error(
      "Failed to confirm affiliate payment:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to confirm affiliate payment.",
      },
      {
        status: 500,
      },
    );
  }
}