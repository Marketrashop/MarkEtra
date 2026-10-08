import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import AffiliateProductsPage from "@/components/admin/affiliate/AffiliateProductsPage";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import type {
  AdminAffiliateListing,
} from "@/types/admin-affiliate.types";

function serializeDate(
  value: Date | null,
) {
  return (
    value?.toISOString() ??
    null
  );
}

export default async function AdminAffiliatePage() {
  await requireAdmin();

  const listings =
    await prisma.affiliateListing.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            avatarKey: true,
          },
        },

        subscription: {
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                commissionRate: true,
                badgeName: true,
              },
            },
          },
        },

product: {
  include: {
    categories: {
      include: {
        category: true,
      },
    },

images: {
  orderBy: {
    sortOrder: "asc",
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

              include: {
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                  },
                },
              },
            },

            transaction: true,
          },
        },
      },

      orderBy: [
        {
          publicationStatus:
            "asc",
        },

        {
          submittedAt:
            "desc",
        },

        {
          createdAt:
            "desc",
        },
      ],
    });

  const serializedListings =
    listings.map(
      (listing) =>
        ({
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
            serializeDate(
              listing.lastSaleAt,
            ),

          publishedAt:
            serializeDate(
              listing.publishedAt,
            ),

          submittedAt:
            serializeDate(
              listing.submittedAt,
            ),

          reviewedAt:
            serializeDate(
              listing.reviewedAt,
            ),

          rejectionReason:
            listing.rejectionReason,

          removedAt:
            serializeDate(
              listing.removedAt,
            ),

          createdAt:
            listing.createdAt.toISOString(),

          updatedAt:
            listing.updatedAt.toISOString(),

          user: {
            id:
              listing.user.id,

            firstName:
              listing.user
                .firstName,

            lastName:
              listing.user
                .lastName,

            email:
              listing.user.email,

            phoneNumber:
              listing.user
                .phoneNumber,

            avatarKey:
              listing.user
                .avatarKey,
          },

          subscription: {
            id:
              listing
                .subscription.id,

            commissionRate:
              Number(
                listing
                  .subscription
                  .commissionRate,
              ),

            status:
              listing
                .subscription
                .status,

            startsAt:
              listing
                .subscription
                .startsAt
                .toISOString(),

            expiresAt:
              listing
                .subscription
                .expiresAt
                .toISOString(),

            plan: {
              id:
                listing
                  .subscription
                  .plan.id,

              name:
                listing
                  .subscription
                  .plan
                  .name,

              commissionRate:
                Number(
                  listing
                    .subscription
                    .plan
                    .commissionRate,
                ),

              badgeName:
                listing
                  .subscription
                  .plan
                  .badgeName,
            },
          },

          product: {
            id:
              listing
                .product.id,

            name:
              listing
                .product.name,

            slug:
              listing
                .product.slug,

            description:
              listing
                .product
                .description,

            price:
              Number(
                listing
                  .product.price,
              ),

            compareAtPrice:
              listing
                .product
                .compareAtPrice ===
              null
                ? null
                : Number(
                    listing
                      .product
                      .compareAtPrice,
                  ),

            averageRating:
              Number(
                listing
                  .product
                  .averageRating,
              ),

            totalRatings:
              listing
                .product
                .totalRatings,

            totalSales:
              listing
                .product
                .totalSales,

            status:
              listing
                .product.status,

            featured:
              listing
                .product.featured,

            publishedAt:
              serializeDate(
                listing
                  .product
                  .publishedAt,
              ),

category: {
  id:
    listing
      .product
      .categories[0]
      .category.id,

  name:
    listing
      .product
      .categories[0]
      .category.name,

  slug:
    listing
      .product
      .categories[0]
      .category.slug,
},

            images:
              listing.product.images.map(
                (image) => ({
                  id:
                    image.id,

                  imageKey:
                    image.imageKey,

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
                  interest
                    .affiliateListingId,

                testBuyerId:
                  interest
                    .testBuyerId,

                status:
                  interest.status,

                offeredPrice:
                  Number(
                    interest
                      .offeredPrice,
                  ),

                createdAt:
                  interest
                    .createdAt
                    .toISOString(),

                updatedAt:
                  interest
                    .updatedAt
                    .toISOString(),

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
                        message
                          .interestId,

                      senderUserId:
                        message
                          .senderUserId,

                      message:
                        message
                          .message,

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
                        message
                          .createdAt
                          .toISOString(),

                      sender: {
                        id:
                          message
                            .sender
                            .id,

                        firstName:
                          message
                            .sender
                            .firstName,

                        lastName:
                          message
                            .sender
                            .lastName,

                        role:
                          message
                            .sender
                            .role,
                      },
                    }),
                  ),

                transaction:
                  interest
                    .transaction
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
                          serializeDate(
                            interest
                              .transaction
                              .paidAt,
                          ),

                        escrowedAt:
                          serializeDate(
                            interest
                              .transaction
                              .escrowedAt,
                          ),

                        completedAt:
                          serializeDate(
                            interest
                              .transaction
                              .completedAt,
                          ),

                        cancelledAt:
                          serializeDate(
                            interest
                              .transaction
                              .cancelledAt,
                          ),

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
        }) satisfies AdminAffiliateListing,
    );

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label:
            "Affiliate Products",
        },
      ]}
    >
      <section
        className="
          py-4
          sm:py-5
        "
      >
        <AffiliateProductsPage
          listings={
            serializedListings
          }
        />
      </section>
    </DashboardPageLayout>
  );
}