/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "ProductCategoryOnProduct" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategoryOnProduct_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateIndex
CREATE INDEX "ProductCategoryOnProduct_productId_idx" ON "ProductCategoryOnProduct"("productId");

-- CreateIndex
CREATE INDEX "ProductCategoryOnProduct_categoryId_idx" ON "ProductCategoryOnProduct"("categoryId");

-- CreateIndex
CREATE INDEX "ProductCategoryOnProduct_categoryId_isPrimary_idx" ON "ProductCategoryOnProduct"("categoryId", "isPrimary");

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
