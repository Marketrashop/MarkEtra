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
  buildAffiliateSubmissionReviewEmail,
  sendMail,
} from "@/mail";

type RouteContext = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function PATCH(
  _request: Request,
  { params }: RouteContext,
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
      "SUBMITTED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Only submitted affiliate products can be moved into review.",
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
                  "IN_REVIEW",

                reviewedAt:
                  new Date(),
              },
            });

          await tx.notification.create({
            data: {
              userId:
                listing.userId,

              title:
                "Affiliate product under review",

              message:
                `Your affiliate product "${listing.product.name}" is now under admin review.`,

              type:
                "AFFILIATE_PRODUCT_SUBMITTED",
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
          buildAffiliateSubmissionReviewEmail(
            {
              affiliateFirstName:
                listing.user.firstName,

              productName:
                listing.product.name,

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
            listing.user.email,

          subject:
            "Your affiliate product submission is under review",

          html:
            email.html,

          text:
            email.text,
        });
      } catch (
        emailError
      ) {
        console.error(
          "Failed to send affiliate submission review email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,

      data:
        updatedListing,

      message:
        "Affiliate product moved into review.",
    });
  } catch (error) {
    console.error(
      "Failed to move affiliate product into review:",
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
          "Failed to move affiliate product into review.",
      },
      {
        status: 500,
      },
    );
  }
}