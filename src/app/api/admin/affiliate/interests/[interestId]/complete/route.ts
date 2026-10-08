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
  buildAffiliateSaleCompletedEmail,
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
                id: true,

                userId:
                  true,

                publicationStatus:
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

                interestId:
                  true,

                agreedPrice:
                  true,

                commissionRate:
                  true,

                commissionAmount:
                  true,

                status:
                  true,

                paidAt:
                  true,

                escrowedAt:
                  true,

                completedAt:
                  true,

                cancelledAt:
                  true,

                createdAt:
                  true,

                updatedAt:
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
      "ACCEPTED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only accepted affiliate interests can be completed.",
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
            "No transaction exists for this affiliate interest.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      interest.transaction
        .status !==
      "IN_ESCROW"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only transactions currently in escrow can be completed.",
        },
        {
          status: 400,
        },
      );
    }

    const now =
      new Date();

    const result =
      await prisma.$transaction(
        async (tx) => {
          const transaction =
            await tx.affiliateTransaction.update(
              {
                where: {
                  id:
                    interest
                      .transaction!
                      .id,
                },

                data: {
                  status:
                    "COMPLETED",

                  completedAt:
                    now,
                },
              },
            );

const listing =
  await tx.affiliateListing.update(
    {
      where: {
        id:
          interest
            .listing
            .id,
      },

      data: {
        totalSales: {
          increment:
            1,
        },

        totalRevenue: {
          increment:
            transaction
              .agreedPrice,
        },

        totalCommission: {
          increment:
            transaction
              .commissionAmount,
        },
      },
    },
  );

await tx.user.update({
  where: {
    id: interest.listing.userId,
  },

  data: {
    affiliateBalance: {
      increment: transaction.commissionAmount,
    },
  },
});

          await tx.activityLog.create({
            data: {
              adminId:
                session.user.id,

              action:
                "PROFIT_CREDIT",

              entity:
                "Affiliate Commission",

              entityId:
                interest.listing
                  .userId,

              description:
                `Completed affiliate transaction ${transaction.id} for user ${interest.listing.userId}. Commission of $${Number(
                  transaction
                    .commissionAmount,
                ).toLocaleString()} was earned from the completed sale.`,
            },
          });

          return {
            transaction,

            listing,
          };
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            interest.listing.userId,

          type:
            "SYSTEM",

          title:
            "Affiliate order completed",

          message:
            `${interest.testBuyer.name} has received "${interest.listing.product.name}". Your affiliate transaction is now complete and $${Number(
              result
                .transaction
                .commissionAmount,
            ).toFixed(
              2,
            )} in commission has been credited and recorded.`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate completion notification:",
        notificationError,
      );
    }

    if (
      interest.listing.user.email
    ) {
      try {
        const email =
          buildAffiliateSaleCompletedEmail(
            {
              affiliateFirstName:
                interest.listing.user
                  .firstName,

              buyerName:
                interest.testBuyer
                  .name,

              productName:
                interest.listing
                  .product.name,

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

              completedAt:
                result
                  .transaction
                  .completedAt
                  ?.toLocaleString() ??
                now.toLocaleString(),

              transactionUrl:
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
            "Your affiliate sale is complete",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate sale completed email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data: {
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
              .paidAt
              ?.toISOString() ??
            null,

          escrowedAt:
            result
              .transaction
              .escrowedAt
              ?.toISOString() ??
            null,

          completedAt:
            result
              .transaction
              .completedAt
              ?.toISOString() ??
            null,

          cancelledAt:
            result
              .transaction
              .cancelledAt
              ?.toISOString() ??
            null,

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

        listing: {
          totalSales:
            result
              .listing
              .totalSales,

          totalRevenue:
            Number(
              result
                .listing
                .totalRevenue,
            ),

          totalCommission:
            Number(
              result
                .listing
                .totalCommission,
            ),
        },
      },

      message:
        "Affiliate transaction completed successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to complete affiliate transaction:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to complete affiliate transaction.",
      },
      {
        status: 500,
      },
    );
  }
}