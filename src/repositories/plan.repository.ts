import { prisma } from "@/lib/prisma";

import type {
  Prisma,
} from "../../generated/prisma/client";

export async function getPlans() {
  return prisma.subscriptionPlan.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getActivePlans() {
  return prisma.subscriptionPlan.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getPlanById(
  id: string,
) {
  return prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });
}

export async function getPlanBySlug(
  slug: string,
) {
  return prisma.subscriptionPlan.findUnique({
    where: {
      slug,
    },
  });
}

export async function createPlan(
  data: Prisma.SubscriptionPlanCreateInput,
) {
  return prisma.subscriptionPlan.create({
    data,
  });
}

export async function updatePlan(
  id: string,
  data: Prisma.SubscriptionPlanUpdateInput,
) {
  return prisma.subscriptionPlan.update({
    where: {
      id,
    },
    data,
  });
}

export async function deletePlan(
  id: string,
) {
  return prisma.subscriptionPlan.delete({
    where: {
      id,
    },
  });
}