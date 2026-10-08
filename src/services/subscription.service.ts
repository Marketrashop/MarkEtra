import {
  prisma,
} from "@/lib/prisma";

import {
  getPlanById,
} from "@/repositories/plan.repository";

export async function subscribeToPlan(input: {
  userId: string;
  planId: string;
}) {
  const plan = await getPlanById(
    input.planId,
  );

  if (!plan) {
    throw new Error(
      "Subscription plan not found.",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const wallet =
        await tx.wallet.findUnique({
          where: {
            userId: input.userId,
          },
        });

      if (!wallet) {
        throw new Error(
          "Wallet not found.",
        );
      }

      if (
        wallet.availableBalance.lt(
          plan.price,
        )
      ) {
        throw new Error(
          "Insufficient wallet balance.",
        );
      }

      const currentSubscription =
        await tx.userSubscription.findFirst(
          {
            where: {
              userId:
                input.userId,
              status: "ACTIVE",
            },
          },
        );

      if (
        currentSubscription?.planId ===
        plan.id
      ) {
        throw new Error(
          "You are already subscribed to this plan.",
        );
      }

      if (
        currentSubscription &&
        plan.priorityLevel <=
          currentSubscription.priority
      ) {
        throw new Error(
          "You can only upgrade to a higher plan.",
        );
      }

      const now = new Date();

      const expiresAt =
        new Date(now);

      expiresAt.setDate(
        expiresAt.getDate() +
          plan.durationInDays,
      );

      const balanceBefore =
        wallet.availableBalance;

      const balanceAfter =
        balanceBefore.minus(
          plan.price,
        );

      await tx.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          availableBalance:
            balanceAfter,
        },
      });

      await tx.walletTransaction.create(
        {
          data: {
            walletId:
              wallet.id,
            userId:
              input.userId,
            type: "DEBIT",
            amount: plan.price,
            balanceBefore,
            balanceAfter,
            description: `Subscription purchase: ${plan.name}`,
          },
        },
      );

      if (
        currentSubscription
      ) {
        await tx.userSubscription.update(
          {
            where: {
              id:
                currentSubscription.id,
            },
            data: {
              status:
                "EXPIRED",
              cancelledAt:
                now,
            },
          },
        );
      }

      return tx.userSubscription.create(
        {
          data: {
            userId:
              input.userId,
            planId: plan.id,
            amountPaid:
              plan.price,
            commissionRate:
              plan.commissionRate,
            maxPublishedProducts:
              plan.maxPublishedProducts,
            priority:
              plan.priorityLevel,
            badgeName:
              plan.badgeName,
            badgeHex:
              plan.badgeColor,
            startsAt: now,
            expiresAt,
          },
        },
      );
    },
  );
}