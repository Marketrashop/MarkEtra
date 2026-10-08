-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "preorderQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;
