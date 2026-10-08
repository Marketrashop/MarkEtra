-- CreateEnum
CREATE TYPE "AffiliatePublicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AffiliateInterestStatus" AS ENUM ('PENDING', 'NEGOTIATING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AffiliateTransactionStatus" AS ENUM ('AWAITING_PAYMENT', 'IN_ESCROW', 'COMPLETED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_PRODUCT_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_PRODUCT_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_PRODUCT_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_PRODUCT_PUBLISHED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_INTEREST_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_NEGOTIATION_MESSAGE';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_OFFER_ACCEPTED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_PAYMENT_CONFIRMED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_ESCROW_STARTED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_ORDER_COMPLETED';
ALTER TYPE "NotificationType" ADD VALUE 'AFFILIATE_COMMISSION_CREDITED';

-- AlterTable
ALTER TABLE "AffiliateListing" ADD COLUMN     "publicationStatus" "AffiliatePublicationStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'PAUSED',
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "AffiliateTestBuyer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "imageKey" TEXT,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(320),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateTestBuyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateInterest" (
    "id" TEXT NOT NULL,
    "affiliateListingId" TEXT NOT NULL,
    "testBuyerId" TEXT NOT NULL,
    "status" "AffiliateInterestStatus" NOT NULL DEFAULT 'PENDING',
    "offeredPrice" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateNegotiationMessage" (
    "id" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "senderUserId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "offeredPrice" DECIMAL(18,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateNegotiationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateTransaction" (
    "id" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "agreedPrice" DECIMAL(18,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(18,2) NOT NULL,
    "status" "AffiliateTransactionStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "paidAt" TIMESTAMP(3),
    "escrowedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AffiliateTestBuyer_name_idx" ON "AffiliateTestBuyer"("name");

-- CreateIndex
CREATE INDEX "AffiliateInterest_affiliateListingId_idx" ON "AffiliateInterest"("affiliateListingId");

-- CreateIndex
CREATE INDEX "AffiliateInterest_testBuyerId_idx" ON "AffiliateInterest"("testBuyerId");

-- CreateIndex
CREATE INDEX "AffiliateInterest_status_idx" ON "AffiliateInterest"("status");

-- CreateIndex
CREATE INDEX "AffiliateInterest_createdAt_idx" ON "AffiliateInterest"("createdAt");

-- CreateIndex
CREATE INDEX "AffiliateNegotiationMessage_interestId_createdAt_idx" ON "AffiliateNegotiationMessage"("interestId", "createdAt");

-- CreateIndex
CREATE INDEX "AffiliateNegotiationMessage_senderUserId_idx" ON "AffiliateNegotiationMessage"("senderUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateTransaction_interestId_key" ON "AffiliateTransaction"("interestId");

-- CreateIndex
CREATE INDEX "AffiliateTransaction_status_idx" ON "AffiliateTransaction"("status");

-- CreateIndex
CREATE INDEX "AffiliateTransaction_createdAt_idx" ON "AffiliateTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "AffiliateInterest" ADD CONSTRAINT "AffiliateInterest_affiliateListingId_fkey" FOREIGN KEY ("affiliateListingId") REFERENCES "AffiliateListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateInterest" ADD CONSTRAINT "AffiliateInterest_testBuyerId_fkey" FOREIGN KEY ("testBuyerId") REFERENCES "AffiliateTestBuyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateNegotiationMessage" ADD CONSTRAINT "AffiliateNegotiationMessage_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "AffiliateInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateNegotiationMessage" ADD CONSTRAINT "AffiliateNegotiationMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateTransaction" ADD CONSTRAINT "AffiliateTransaction_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "AffiliateInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
