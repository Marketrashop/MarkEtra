/*
  Warnings:

  - You are about to drop the column `variantId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `WishlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,productId,variantSizeId,status]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,label]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wishlistId,productId,variantSizeId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_variantId_fkey";

-- DropIndex
DROP INDEX "CartItem_cartId_productId_variantId_status_key";

-- DropIndex
DROP INDEX "CartItem_variantId_idx";

-- DropIndex
DROP INDEX "ProductVariant_sortOrder_idx";

-- DropIndex
DROP INDEX "WishlistItem_variantId_idx";

-- DropIndex
DROP INDEX "WishlistItem_wishlistId_productId_variantId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "variantId",
ADD COLUMN     "variantSizeId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "variantSizeId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "color",
DROP COLUMN "isDefault",
DROP COLUMN "price",
DROP COLUMN "size",
DROP COLUMN "sku",
DROP COLUMN "sortOrder",
DROP COLUMN "stock",
ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "variantId",
ADD COLUMN     "variantSizeId" TEXT;

-- CreateTable
CREATE TABLE "ProductVariantSize" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "size" TEXT,
    "sku" TEXT,
    "price" DECIMAL(18,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "incomingStock" INTEGER NOT NULL DEFAULT 0,
    "allowPreorder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariantSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductVariantSize_variantId_idx" ON "ProductVariantSize"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantSize_variantId_size_key" ON "ProductVariantSize"("variantId", "size");

-- CreateIndex
CREATE INDEX "CartItem_variantSizeId_idx" ON "CartItem"("variantSizeId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_variantSizeId_status_key" ON "CartItem"("cartId", "productId", "variantSizeId", "status");

-- CreateIndex
CREATE INDEX "OrderItem_variantSizeId_idx" ON "OrderItem"("variantSizeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_label_key" ON "ProductVariant"("productId", "label");

-- CreateIndex
CREATE INDEX "WishlistItem_variantSizeId_idx" ON "WishlistItem"("variantSizeId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_wishlistId_productId_variantSizeId_key" ON "WishlistItem"("wishlistId", "productId", "variantSizeId");

-- AddForeignKey
ALTER TABLE "ProductVariantSize" ADD CONSTRAINT "ProductVariantSize_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantSizeId_fkey" FOREIGN KEY ("variantSizeId") REFERENCES "ProductVariantSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_variantSizeId_fkey" FOREIGN KEY ("variantSizeId") REFERENCES "ProductVariantSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantSizeId_fkey" FOREIGN KEY ("variantSizeId") REFERENCES "ProductVariantSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
