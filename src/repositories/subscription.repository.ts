import { prisma } from "@/lib/prisma";

import type {
  Prisma,
} from "../../generated/prisma/client";

export async function getCurrentSubscription(
  userId: string,
) {
  return prisma.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSubscriptionById(
  id: string,
) {
  return prisma.userSubscription.findUnique({
    where: {
      id,
    },
    include: {
      plan: true,
    },
  });
}

export async function getUserSubscriptions(
  userId: string,
) {
  return prisma.userSubscription.findMany({
    where: {
      userId,
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createSubscription(
  data: Prisma.UserSubscriptionCreateInput,
) {
  return prisma.userSubscription.create({
    data,
    include: {
      plan: true,
    },
  });
}

export async function expireSubscriptions(
  userId: string,
) {
  return prisma.userSubscription.updateMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    data: {
      status: "EXPIRED",
      cancelledAt: new Date(),
    },
  });
}

export async function cancelSubscription(
  id: string,
) {
  return prisma.userSubscription.update({
    where: {
      id,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
}