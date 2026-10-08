import { prisma } from "@/lib/prisma";

import type {
  Prisma,
  ProductReview,
} from "../../generated/prisma/client";

import type {
  CreateReviewInput,
  ReviewQuery,
  ReviewSummary,
  UpdateReviewInput,
} from "@/types/review.types";

export async function createReview(
  data: CreateReviewInput,
): Promise<ProductReview> {
  return prisma.productReview.create({
    data,
  });
}

export async function updateReview(
  id: string,
  data: UpdateReviewInput,
): Promise<ProductReview> {
  return prisma.productReview.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteReview(
  id: string,
): Promise<ProductReview> {
  return prisma.productReview.delete({
    where: {
      id,
    },
  });
}

export async function getReviewById(
  id: string,
): Promise<ProductReview | null> {
  return prisma.productReview.findUnique({
    where: {
      id,
    },
  });
}

export async function getReviews(
  query: ReviewQuery = {},
): Promise<ProductReview[]> {
  const {
    productId,
    verifiedPurchase,
    rating,
    page = 1,
    pageSize = 20,
  } = query;

  const where: Prisma.ProductReviewWhereInput = {};

  if (productId) {
    where.productId = productId;
  }

  if (verifiedPurchase !== undefined) {
    where.verifiedPurchase = verifiedPurchase;
  }

  if (rating !== undefined) {
    where.rating = rating;
  }

  return prisma.productReview.findMany({
    where,
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export async function getReviewSummary(
  productId: string,
): Promise<ReviewSummary> {
  const [
    total,
    average,
    fiveStars,
    fourStars,
    threeStars,
    twoStars,
    oneStar,
  ] = await Promise.all([
    prisma.productReview.count({
      where: {
        productId,
      },
    }),
    prisma.productReview.aggregate({
      where: {
        productId,
      },
      _avg: {
        rating: true,
      },
    }),
    prisma.productReview.count({
      where: {
        productId,
        rating: 5,
      },
    }),
    prisma.productReview.count({
      where: {
        productId,
        rating: 4,
      },
    }),
    prisma.productReview.count({
      where: {
        productId,
        rating: 3,
      },
    }),
    prisma.productReview.count({
      where: {
        productId,
        rating: 2,
      },
    }),
    prisma.productReview.count({
      where: {
        productId,
        rating: 1,
      },
    }),
  ]);

  return {
    totalReviews: total,
    averageRating: Number(
      average._avg.rating ?? 0,
    ),
    fiveStars,
    fourStars,
    threeStars,
    twoStars,
    oneStar,
  };
}