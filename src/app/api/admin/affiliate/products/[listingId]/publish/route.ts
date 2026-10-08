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

import {
  buildAffiliateProductPublishedEmail,
  sendMail,
} from "@/mail";

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

          status:
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
      "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only approved affiliate products can be published.",
        },
        {
          status: 400,
        },
      );
    }

    const publishedAt =
      new Date();

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
                  "PUBLISHED",

                status:
                  "ACTIVE",

                publishedAt,

                removedAt:
                  null,
              },
            });

          await tx.notification.create({
            data: {
              userId:
                listing.userId,

              title:
                "Affiliate product published",

              message:
                `Your affiliate product "${listing.product.name}" has been successfully published and is now available on the MarkEtra Marketplace.`,

              type:
                "AFFILIATE_PRODUCT_PUBLISHED",
            },
          });

          return updated;
        },
      );

    if (
      listing.user.email
    ) {
      try {
        const email =
          buildAffiliateProductPublishedEmail(
            {
              affiliateFirstName:
                listing.user
                  .firstName,

              productName:
                listing.product
                  .name,

              publishedUrl:
                `${
                  process.env
                    .NEXT_PUBLIC_APP_URL ??
                  "http://localhost:3000"
                }/affiliate`,
            },
          );

        await sendMail({
          to:
            listing.user
              .email,

          subject:
            "Your affiliate product has been approved and published",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate product published email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data:
        updatedListing,

      message:
        "Affiliate product published successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to publish affiliate product:",
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
          "Failed to publish affiliate product.",
      },
      {
        status: 500,
      },
    );
  }
}