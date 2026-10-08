/*
  Warnings:

  - You are about to drop the column `priority` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `badgeColor` on the `UserSubscription` table. All the data in the column will be lost.
  - Added the required column `priorityLevel` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeHex` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "priority",
ADD COLUMN     "priorityLevel" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "badgeColor",
ADD COLUMN     "badgeHex" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AffiliateListing_subscriptionId_idx" ON "AffiliateListing"("subscriptionId");

-- CreateIndex
CREATE INDEX "UserSubscription_planId_idx" ON "UserSubscription"("planId");
