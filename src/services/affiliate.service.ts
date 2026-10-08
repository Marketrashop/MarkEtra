import {
  prisma,
} from "@/lib/prisma";

import {
  ACTIVE_SESSION_WINDOW_MS,
} from "@/lib/auth/activity";

import {
  getCurrentSubscription,
} from "@/repositories/subscription.repository";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary/url";

export async function submitAffiliateProduct(
  input: {
    userId: string;

    productId: string;
  },
) {
  const subscription =
    await getCurrentSubscription(
      input.userId,
    );

  if (!subscription) {
    throw new Error(
      "You need an active subscription to publish products.",
    );
  }

  const publishedCount =
    await prisma.affiliateListing.count({
      where: {
        userId:
          input.userId,

        status:
          "ACTIVE",

        publicationStatus:
          "PUBLISHED",
      },
    });

  if (
    publishedCount >=
    subscription.maxPublishedProducts
  ) {
    throw new Error(
      "Your plan's publishing limit has been reached.",
    );
  }

  const existing =
    await prisma.affiliateListing.findUnique({
      where: {
        userId_productId: {
          userId:
            input.userId,

          productId:
            input.productId,
        },
      },
    });

  if (existing) {
    throw new Error(
      "This product has already been submitted.",
    );
  }

  const listing =
    await prisma.affiliateListing.create({
      data: {
        userId:
          input.userId,

        subscriptionId:
          subscription.id,

        productId:
          input.productId,

        publicationStatus:
          "SUBMITTED",

        status:
          "PAUSED",

        submittedAt:
          new Date(),

        publishedAt:
          null,
      },

      include: {
        product: {
          include: {
            images: {
              orderBy: {
                sortOrder:
                  "asc",
              },
            },
          },
        },
      },
    });

  return {
    ...listing,

    totalRevenue:
      Number(
        listing.totalRevenue,
      ),

    totalCommission:
      Number(
        listing.totalCommission,
      ),

    lastSaleAt:
      listing.lastSaleAt?.toISOString() ??
      null,

    publishedAt:
      listing.publishedAt?.toISOString() ??
      null,

    submittedAt:
      listing.submittedAt?.toISOString() ??
      null,

    reviewedAt:
      listing.reviewedAt?.toISOString() ??
      null,

    rejectionReason:
      listing.rejectionReason,

    removedAt:
      listing.removedAt?.toISOString() ??
      null,

    createdAt:
      listing.createdAt.toISOString(),

    updatedAt:
      listing.updatedAt.toISOString(),

    product: {
      id:
        listing.product.id,

      name:
        listing.product.name,

      slug:
        listing.product.slug,

      description:
        listing.product.description,

      price:
        Number(
          listing.product.price,
        ),

      compareAtPrice:
        listing.product
          .compareAtPrice ===
        null
          ? null
          : Number(
              listing.product
                .compareAtPrice,
            ),

      averageRating:
        Number(
          listing.product
            .averageRating,
        ),

      totalRatings:
        listing.product
          .totalRatings,

      images:
        listing.product.images.map(
          (image) => ({
            id:
              image.id,

            imageKey:
              image.imageKey,

            imageUrl:
              getCloudinaryImageUrl(
                image.imageKey,
              ) ??
              `/api/image/${image.imageKey}`,

            altText:
              image.altText,

            isPrimary:
              image.isPrimary,

            sortOrder:
              image.sortOrder,
          }),
        ),
    },

    interests: [],
  };
}



export async function getAffiliateTestBuyerPresence() {
  const now = new Date();

  const activeSince = new Date(
    now.getTime() - ACTIVE_SESSION_WINDOW_MS,
  );

  const latestSession =
    await prisma.session.findFirst({
      where: {
        user: {
          role: "ADMIN",
          status: "ACTIVE",
        },
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
        lastActivityAt: {
          gte: activeSince,
        },
      },

      select: {
        lastActivityAt: true,
      },

      orderBy: {
        lastActivityAt: "desc",
      },
    });

  return {
    active: latestSession !== null,
    lastActiveAt:
      latestSession?.lastActivityAt
        .toISOString() ?? null,
  };
}



export async function getAffiliateEarnings(
  userId: string,
) {

const testBuyerPresence =
  await getAffiliateTestBuyerPresence();

  const listings =
    await prisma.affiliateListing.findMany({
      where: {
        userId,
      },

      include: {
        product: {
          include: {
            images: {
              orderBy: {
                sortOrder:
                  "asc",
              },
            },
          },
        },

        interests: {
          orderBy: {
            createdAt:
              "desc",
          },

          include: {
            testBuyer: true,

            messages: {
              orderBy: {
                createdAt:
                  "asc",
              },
            },

            transaction: true,
          },
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });

const user =
  await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      affiliateBalance: true,
    },
  });

  const totalSales =
    listings.reduce(
      (
        total,
        listing,
      ) =>
        total +
        listing.totalSales,
      0,
    );

  const totalRevenue =
    listings.reduce(
      (
        total,
        listing,
      ) =>
        total +
        Number(
          listing.totalRevenue,
        ),
      0,
    );

  const totalCommission =
    listings.reduce(
      (
        total,
        listing,
      ) =>
        total +
        Number(
          listing.totalCommission,
        ),
      0,
    );

  return {
    listings:
      listings.map(
        (listing) => ({
          id:
            listing.id,

          userId:
            listing.userId,

          subscriptionId:
            listing.subscriptionId,

          productId:
            listing.productId,

          status:
            listing.status,

          publicationStatus:
            listing.publicationStatus,

          totalSales:
            listing.totalSales,

          totalRevenue:
            Number(
              listing.totalRevenue,
            ),

          totalCommission:
            Number(
              listing.totalCommission,
            ),

          lastSaleAt:
            listing.lastSaleAt?.toISOString() ??
            null,

          publishedAt:
            listing.publishedAt?.toISOString() ??
            null,

          submittedAt:
            listing.submittedAt?.toISOString() ??
            null,

          reviewedAt:
            listing.reviewedAt?.toISOString() ??
            null,

          rejectionReason:
            listing.rejectionReason,

          removedAt:
            listing.removedAt?.toISOString() ??
            null,

          createdAt:
            listing.createdAt.toISOString(),

          updatedAt:
            listing.updatedAt.toISOString(),

          product: {
            id:
              listing.product.id,

            name:
              listing.product.name,

            slug:
              listing.product.slug,

            description:
              listing.product.description,

            price:
              Number(
                listing.product.price,
              ),

            compareAtPrice:
              listing.product
                .compareAtPrice ===
              null
                ? null
                : Number(
                    listing.product
                      .compareAtPrice,
                  ),

            averageRating:
              Number(
                listing.product
                  .averageRating,
              ),

            totalRatings:
              listing.product
                .totalRatings,

            images:
              listing.product.images.map(
                (image) => ({
                  id:
                    image.id,

                  imageKey:
                    image.imageKey,

                  imageUrl:
                    getCloudinaryImageUrl(
                      image.imageKey,
                    ) ??
                    `/api/image/${image.imageKey}`,

                  altText:
                    image.altText,

                  isPrimary:
                    image.isPrimary,

                  sortOrder:
                    image.sortOrder,
                }),
              ),
          },

          interests:
            listing.interests.map(
              (interest) => ({
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
                      .testBuyer
                      .id,

                  name:
                    interest
                      .testBuyer
                      .name,

                  imageKey:
                    interest
                      .testBuyer
                      .imageKey,

active:
  testBuyerPresence.active,

lastActiveAt:
  testBuyerPresence.lastActiveAt,

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

                messages:
                  interest.messages.map(
                    (message) => ({
                      id:
                        message.id,

                      interestId:
                        message.interestId,

                      senderUserId:
                        message.senderUserId,

                      message:
                        message.message,

                      offeredPrice:
                        message
                          .offeredPrice ===
                        null
                          ? null
                          : Number(
                              message
                                .offeredPrice,
                            ),

                      createdAt:
                        message.createdAt.toISOString(),
                    }),
                  ),

                transaction:
                  interest.transaction
                    ? {
                        id:
                          interest
                            .transaction
                            .id,

                        interestId:
                          interest
                            .transaction
                            .interestId,

                        agreedPrice:
                          Number(
                            interest
                              .transaction
                              .agreedPrice,
                          ),

                        commissionRate:
                          Number(
                            interest
                              .transaction
                              .commissionRate,
                          ),

                        commissionAmount:
                          Number(
                            interest
                              .transaction
                              .commissionAmount,
                          ),

                        status:
                          interest
                            .transaction
                            .status,

                        paidAt:
                          interest
                            .transaction
                            .paidAt
                            ?.toISOString() ??
                          null,

                        escrowedAt:
                          interest
                            .transaction
                            .escrowedAt
                            ?.toISOString() ??
                          null,

                        completedAt:
                          interest
                            .transaction
                            .completedAt
                            ?.toISOString() ??
                          null,

                        cancelledAt:
                          interest
                            .transaction
                            .cancelledAt
                            ?.toISOString() ??
                          null,

                        createdAt:
                          interest
                            .transaction
                            .createdAt
                            .toISOString(),

                        updatedAt:
                          interest
                            .transaction
                            .updatedAt
                            .toISOString(),
                      }
                    : null,
              }),
            ),
        }),
      ),

    overview: {
      totalPublishedProducts:
        listings.filter(
          (listing) =>
            listing.publicationStatus ===
            "PUBLISHED",
        ).length,

      totalSales,

      totalRevenue,

totalCommission:
  Number(
    user?.affiliateBalance ??
      0,
  ),
    },
  };
}