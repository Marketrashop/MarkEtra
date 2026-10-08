import type { Metadata } from "next";

import { ArrowUpRight, ArrowDownLeft, DollarSign, BadgeCheck, BadgePlus, HandCoins, ShoppingCart, Wallet } from "lucide-react";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import PageHeader from "@/components/dashboard/PageHeader";

import { DashboardFeaturedProducts, DashboardShoppingOverview, DashboardStatCard } from "@/components/user";

import { getCurrentSession } from "@/lib/auth/session";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

import { WithdrawalStatus } from "../../../../generated/prisma/client";

export const dynamic =
  "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",

  description:
    "Manage your subscriptions, orders, wallet, affiliate earnings, and account activity from your MarkEtra dashboard.",
};

export default async function DashboardPage() {
  const session =
    await getCurrentSession();

  if (!session) {
    return null;
  }

  const firstName =
    session.user.firstName;

const [
  wallet,
  user,
  withdrawals,
  subscription,
  activeOrders,
  pendingPayments,
  savedForLater,
  deliveredOrders,
  featuredProducts,
] = await Promise.all([
    prisma.wallet.findUnique({
      where: {
        userId:
          session.user.id,
      },

      select: {
        availableBalance:
          true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

select: {
  affiliateBalance: true,
  profit: true,
  totalDeposit: true,
},
    }),

    prisma.withdrawal.aggregate({
      where: {
        userId:
          session.user.id,

        status:
          WithdrawalStatus.COMPLETED,
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.userSubscription.findFirst({
      where: {
        userId:
          session.user.id,

        status: "ACTIVE",
      },

      select: {
        badgeName: true,
        expiresAt: true,
      },
    }),

    prisma.order.count({
      where: {
        userId:
          session.user.id,

        status: {
          in: [
            "PROCESSING",
            "NEAR_DESTINATION",
            "SHIPPED",
          ],
        },
      },
    }),

    prisma.order.count({
      where: {
        userId:
          session.user.id,

        paymentStatus:
          "PENDING",
      },
    }),

prisma.cart.findUnique({
  where: {
    userId: session.user.id,
  },
  select: {
    _count: {
      select: {
        items: {
          where: {
            status: "SAVED_FOR_LATER",
            variantSize: {
              isNot: null,
            },
          },
        },
      },
    },
  },
}),

    prisma.order.count({
      where: {
        userId:
          session.user.id,

        status:
          "DELIVERED",

        updatedAt: {
          gte: new Date(
            Date.now() -
              30 *
                24 *
                60 *
                60 *
                1000,
          ),
        },
      },
    }),

prisma.product.findMany({
  take: 10,
      where: {
        featured: true,
        status: "ACTIVE",
      },

      orderBy: [
        {
          publishedAt:
            "desc",
        },
        {
          createdAt:
            "desc",
        },
      ],

      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice:
          true,

        images: {
          where: {
            isPrimary: true,
          },

          take: 1,

          select: {
            imageKey: true,
          },
        },
      },
    }),
  ]);

  const walletBalance =
    Number(
      wallet?.availableBalance ??
        0,
    );

  const totalProfit =
    Number(
      user?.profit ??
        0,
    );

  const totalDeposits =
    Number(
      user?.totalDeposit ??
        0,
    );

  const totalWithdrawals =
    Number(
      withdrawals._sum.amount ??
        0,
    );

const affiliateCommission =
  Number(
    user?.affiliateBalance ?? 0,
  );

  const planTitle =
    subscription
      ? `${subscription.badgeName} Plan`
      : "No Plan";

  const planValue =
    subscription
      ? `Expires ${subscription.expiresAt.toLocaleDateString()}`
      : "Subscribe to a new plan";

  const currency = (
    value: number,
  ) =>
    `$${value.toLocaleString(
      undefined,
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      },
    )}`;

const savedForLaterCount =
  savedForLater?._count.items ??
  0;

  const dashboardFeaturedProducts =
    featuredProducts.map(
      (product) => ({
        id: product.id,

        name: product.name,

        slug: product.slug,

        price: Number(
          product.price,
        ),

        compareAtPrice:
          product.compareAtPrice ===
          null
            ? null
            : Number(
                product.compareAtPrice,
              ),

        imageUrl:
          getCloudinaryImageUrl(
            product.images[0]
              ?.imageKey ??
              null,
          ),
      }),
    );

  return (
    <DashboardPageLayout
      environment="user"
    >
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's your account overview for today."
      />

<DashboardShoppingOverview
  activeOrders={
    activeOrders
  }
  pendingPayments={
    pendingPayments
  }
  savedForLater={
    savedForLaterCount
  }
  deliveredOrders={
    deliveredOrders
  }
/>

<section
  className="
    mt-5
    mb-12
    grid
    gap-5
    sm:grid-cols-2
    xl:grid-cols-3
  "
>
<DashboardStatCard
  href="/plans"
  title={planTitle}
  value={planValue}
  icon={
    subscription
      ? BadgeCheck
      : BadgePlus
  }
/>

        <DashboardStatCard
          title="Wallet Balance"
          value={currency(
            walletBalance,
          )}
          icon={Wallet}
        />

        <DashboardStatCard
          title="Profits"
          value={currency(
            totalProfit,
          )}
          icon={HandCoins}
        />

        <DashboardStatCard
          href="/Orders"
          title="My Orders"
          value="0"
          icon={ShoppingCart}
        />

        <DashboardStatCard
          href="/Deposit"
          title="Total Deposits"
          value={currency(
            totalDeposits,
          )}
          icon={ArrowDownLeft}
        />

        {subscription ? (
          <DashboardStatCard
            href="/affiliate"
            title="Affiliate Commission"
            value={currency(
              affiliateCommission,
            )}
            icon={DollarSign}
          />
        ) : (
          <DashboardStatCard
            href="/Withdraw"
            title="Total Withdrawals"
            value={currency(
              totalWithdrawals,
            )}
            icon={ArrowUpRight}
          />
        )}
      </section>

<DashboardFeaturedProducts
  products={
    dashboardFeaturedProducts
  }
/>
    </DashboardPageLayout>
  );
}