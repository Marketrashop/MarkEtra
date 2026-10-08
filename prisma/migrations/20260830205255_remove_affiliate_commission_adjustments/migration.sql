/*
  Warnings:

  - You are about to drop the `AffiliateCommissionAdjustment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AffiliateCommissionAdjustment" DROP CONSTRAINT "AffiliateCommissionAdjustment_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateCommissionAdjustment" DROP CONSTRAINT "AffiliateCommissionAdjustment_userId_fkey";

-- DropTable
DROP TABLE "AffiliateCommissionAdjustment";
