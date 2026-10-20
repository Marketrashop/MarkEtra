import type { Metadata } from "next";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  DashboardFeaturedProducts,
  DashboardShoppingOverview,
} from "@/components/user";

import { getCurrentSession } from "@/lib/auth/session";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

import DashboardHero from "@/components/user/DashboardHero";
import DashboardShopByCategory from "@/components/user/DashboardShopByCategory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Explore products, manage your orders, and keep track of your MarkEtra account.",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  const [
    activeOrders,
    pendingPayments,
    savedForLater,
    deliveredOrders,
    featuredProducts,
    categories,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        userId: session.user.id,
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
        userId: session.user.id,
        paymentStatus: "PENDING",
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
        userId: session.user.id,
        status: "DELIVERED",
        updatedAt: {
          gte: new Date(
            Date.now() -
              30 * 24 * 60 * 60 * 1000,
          ),
        },
      },
    }),

    prisma.product.findMany({
      // The component shows 7 at a time and rotates through the rest,
      // so a bigger pool means more variety between rotations.
      take: 24,
      where: {
        featured: true,
        status: "ACTIVE",
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
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

    prisma.productCategory.findMany({
      take: 12,
      where: {
        isActive: true,
        products: {
          some: {
            product: {
              status: "ACTIVE",
            },
          },
        },
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        imageKey: true,
        _count: {
          select: {
            products: {
              where: {
                product: {
                  status: "ACTIVE",
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const savedForLaterCount =
    savedForLater?._count.items ?? 0;

  const dashboardFeaturedProducts =
    featuredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      compareAtPrice:
        product.compareAtPrice === null
          ? null
          : Number(product.compareAtPrice),
      imageUrl: getCloudinaryImageUrl(
        product.images[0]?.imageKey ?? null,
      ),
    }));

  const dashboardCategories = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: getCloudinaryImageUrl(
        category.imageKey ?? null,
      ),
      productCount: category._count.products,
    }),
  );

  return (
    <DashboardPageLayout environment="user">
      <DashboardHero
        firstName={session.user.firstName}
      />

      <DashboardShoppingOverview
        activeOrders={activeOrders}
        pendingPayments={pendingPayments}
        savedForLater={savedForLaterCount}
        deliveredOrders={deliveredOrders}
      />

      <div className="mt-5">
        <DashboardFeaturedProducts
          products={dashboardFeaturedProducts}
        />
      </div>

      <DashboardShopByCategory
        categories={dashboardCategories}
      />
    </DashboardPageLayout>
  );
}