import { prisma } from "@/lib/prisma";

export async function getAdminDashboard() {
  const [
    users,
    products,
    affiliateProducts,
    orders,
    pendingUsers,
    pendingDeposits,
    pendingWithdrawals,
    pendingAffiliateProducts,
    recentActivity,
    affiliateListings,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count(),

    prisma.affiliateListing.count(),

    prisma.order.count(),

    prisma.user.count({
      where: {
        status: "PENDING_VERIFICATION",
      },
    }),

    prisma.deposit.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.withdrawal.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.affiliateListing.count({
      where: {
        publicationStatus: "SUBMITTED",
      },
    }),

    prisma.activityLog.findMany({
      take: 6,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.affiliateListing.findMany({
      where: {
        publicationStatus: "SUBMITTED",
      },

      take: 5,

      orderBy: {
        submittedAt: "desc",
      },

      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    users,
    products,
    affiliateProducts,
    orders,

    pendingUsers,
    pendingDeposits,
    pendingWithdrawals,
    pendingAffiliateProducts,

    recentActivity,
    affiliateListings,
  };
}