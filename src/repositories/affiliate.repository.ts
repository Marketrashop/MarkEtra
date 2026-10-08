import {
  prisma,
} from "@/lib/prisma";

import type {
  Prisma,
} from "../../generated/prisma/client";

export async function getAffiliateListing(
  userId: string,
  productId: string,
) {
  return prisma.affiliateListing.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },

    include: {
      subscription: {
        include: {
          plan: true,
        },
      },

      product: true,

      interests: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getAffiliateListings(
  userId: string,
) {
  return prisma.affiliateListing.findMany({
    where: {
      userId,
    },

    include: {
      subscription: {
        include: {
          plan: true,
        },
      },

      product: true,

      interests: {
        orderBy: {
          createdAt: "desc",
        },
      },
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
  });
}

export async function getActiveListingsCount(
  userId: string,
) {
  return prisma.affiliateListing.count({
    where: {
      userId,

      publicationStatus:
        "PUBLISHED",

      status:
        "ACTIVE",
    },
  });
}

export async function createAffiliateListing(
  data: Prisma.AffiliateListingCreateInput,
) {
  return prisma.affiliateListing.create({
    data,

    include: {
      subscription: {
        include: {
          plan: true,
        },
      },

      product: true,

      interests: true,
    },
  });
}

export async function updateAffiliateListing(
  id: string,
  data: Prisma.AffiliateListingUpdateInput,
) {
  return prisma.affiliateListing.update({
    where: {
      id,
    },

    data,

    include: {
      subscription: {
        include: {
          plan: true,
        },
      },

      product: true,

      interests: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}