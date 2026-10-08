/*
  Warnings:

  - A unique constraint covering the columns `[walletReversalTransactionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "walletReversalTransactionId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Order_walletReversalTransactionId_key" ON "Order"("walletReversalTransactionId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_walletReversalTransactionId_fkey" FOREIGN KEY ("walletReversalTransactionId") REFERENCES "WalletTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
