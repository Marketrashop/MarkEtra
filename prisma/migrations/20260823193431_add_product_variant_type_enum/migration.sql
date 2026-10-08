-- CreateEnum
CREATE TYPE "ProductVariantType" AS ENUM ('DEFAULT', 'COLOR', 'STORAGE', 'MATERIAL', 'PACK_SIZE', 'STYLE', 'OTHER');

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "type" "ProductVariantType" NOT NULL DEFAULT 'DEFAULT';
