-- CreateTable
CREATE TABLE "AffiliateCommissionAdjustment" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "adminId" UUID NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateCommissionAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AffiliateCommissionAdjustment_userId_idx" ON "AffiliateCommissionAdjustment"("userId");

-- CreateIndex
CREATE INDEX "AffiliateCommissionAdjustment_adminId_idx" ON "AffiliateCommissionAdjustment"("adminId");

-- CreateIndex
CREATE INDEX "AffiliateCommissionAdjustment_createdAt_idx" ON "AffiliateCommissionAdjustment"("createdAt");

-- AddForeignKey
ALTER TABLE "AffiliateCommissionAdjustment" ADD CONSTRAINT "AffiliateCommissionAdjustment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateCommissionAdjustment" ADD CONSTRAINT "AffiliateCommissionAdjustment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
