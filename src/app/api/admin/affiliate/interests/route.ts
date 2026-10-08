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
  buildAffiliateInterestEmail,
  sendMail,
} from "@/mail";

export async function POST(
  request: Request,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const affiliateListingId =
      typeof body.affiliateListingId ===
        "string"
        ? body.affiliateListingId.trim()
        : "";

    const testBuyerId =
      typeof body.testBuyerId ===
        "string"
        ? body.testBuyerId.trim()
        : "";

    const rawOfferedPrice =
      body.offeredPrice;

    if (!affiliateListingId) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Affiliate listing is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!testBuyerId) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Test buyer is required.",
        },
        {
          status: 400,
        },
      );
    }

    const offeredPrice =
      typeof rawOfferedPrice ===
      "number"
        ? rawOfferedPrice
        : Number(
            rawOfferedPrice,
          );

    if (
      !Number.isFinite(
        offeredPrice,
      ) ||
      offeredPrice <= 0
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

    const [
      listing,
      testBuyer,
    ] = await Promise.all([
      prisma.affiliateListing.findUnique(
        {
          where: {
            id:
              affiliateListingId,
          },

          select: {
            id: true,

            userId: true,

            productId: true,

            publicationStatus: true,

            product: {
              select: {
                id: true,

                name: true,

                price: true,
              },
            },
          },
        },
      ),

      prisma.affiliateTestBuyer.findUnique(
        {
          where: {
            id:
              testBuyerId,
          },

          select: {
            id: true,

            name: true,

            imageKey: true,

            phone: true,

            email: true,
          },
        },
      ),
    ]);

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
      "PUBLISHED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Interest can only be created for a published affiliate product.",
        },
        {
          status: 400,
        },
      );
    }

    if (!testBuyer) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Test buyer not found.",
        },
        {
          status: 404,
        },
      );
    }

const affiliate =
  await prisma.user.findUnique({
    where: {
      id:
        listing.userId,
    },

    select: {
      email:
        true,

      firstName:
        true,
    },
  });

if (!affiliate) {
  return NextResponse.json(
    {
      success: false,

      error:
        "Affiliate user not found.",
    },
    {
      status: 404,
    },
  );
}

    const existingInterest =
      await prisma.affiliateInterest.findFirst(
        {
          where: {
            affiliateListingId,

            testBuyerId,

            status: {
              in: [
                "PENDING",
                "NEGOTIATING",
                "ACCEPTED",
              ],
            },
          },
        },
      );

    if (existingInterest) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This test buyer already has an active interest in this affiliate product.",
        },
        {
          status: 409,
        },
      );
    }

    const interest =
      await prisma.affiliateInterest.create(
        {
          data: {
            affiliateListingId,

            testBuyerId,

            status:
              "PENDING",

            offeredPrice,
          },

          include: {
            testBuyer: true,
          },
        },
      );

    try {
      await prisma.notification.create({
        data: {
          userId:
            listing.userId,

          type:
            "AFFILIATE_INTEREST_RECEIVED",

          title:
            `${testBuyer.name} is interested in your affiliate product`,

          message:
            `${testBuyer.name} has offered $${offeredPrice.toFixed(
              2,
            )} for "${listing.product.name}". Review the interest from your affiliate products.`,
        },
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Failed to create affiliate interest notification:",
        notificationError,
      );
    }

try {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const email =
    buildAffiliateInterestEmail({
      affiliateFirstName:
        affiliate.firstName,

      buyerName:
        testBuyer.name,

      productName:
        listing.product.name,

      offeredPrice,

      reviewUrl:
        `${appUrl}/affiliate`,
    });

  await sendMail({
    to:
      affiliate.email,

    subject:
      "New buyer interest in your affiliate product",

    html:
      email.html,

    text:
      email.text,
  });
} catch (
  emailError
) {
  console.error(
    "Failed to send affiliate interest email:",
    emailError,
  );
}

    return NextResponse.json(
      {
        success: true,

        data: {
          id:
            interest.id,

          affiliateListingId:
            interest.affiliateListingId,

          testBuyerId:
            interest.testBuyerId,

          status:
            interest.status,

          offeredPrice:
            Number(
              interest.offeredPrice,
            ),

          createdAt:
            interest.createdAt.toISOString(),

          updatedAt:
            interest.updatedAt.toISOString(),

          testBuyer: {
            id:
              interest
                .testBuyer.id,

            name:
              interest
                .testBuyer.name,

            imageKey:
              interest
                .testBuyer
                .imageKey,

            phone:
              interest
                .testBuyer
                .phone,

            email:
              interest
                .testBuyer
                .email,

            createdAt:
              interest
                .testBuyer
                .createdAt
                .toISOString(),

            updatedAt:
              interest
                .testBuyer
                .updatedAt
                .toISOString(),
          },
        },

        message:
          "Affiliate interest created successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create affiliate interest:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to create affiliate interest.",
      },
      {
        status: 500,
      },
    );
  }
}