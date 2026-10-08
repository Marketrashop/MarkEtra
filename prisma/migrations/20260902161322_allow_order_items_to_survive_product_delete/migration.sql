/*
  Warnings:

  - Made the column `productId` on table `AffiliateListing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AffiliateListing" DROP CONSTRAINT "AffiliateListing_productId_fkey";

-- AlterTable
ALTER TABLE "AffiliateListing" ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AffiliateListing" ADD CONSTRAINT "AffiliateListing_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
