/*
  Warnings:

  - The values [APPROVED] on the enum `WithdrawalStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reviewNote` on the `Withdrawal` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `Withdrawal` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedById` on the `Withdrawal` table. All the data in the column will be lost.
  - Added the required column `receiveAmount` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeholder` to the `WithdrawalMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `WithdrawalMethod` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WithdrawalMethodType" AS ENUM ('CRYPTO', 'BANK');

-- AlterEnum
BEGIN;
CREATE TYPE "WithdrawalStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');
ALTER TABLE "public"."Withdrawal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Withdrawal" ALTER COLUMN "status" TYPE "WithdrawalStatus_new" USING ("status"::text::"WithdrawalStatus_new");
ALTER TYPE "WithdrawalStatus" RENAME TO "WithdrawalStatus_old";
ALTER TYPE "WithdrawalStatus_new" RENAME TO "WithdrawalStatus";
DROP TYPE "public"."WithdrawalStatus_old";
ALTER TABLE "Withdrawal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_reviewedById_fkey";

-- DropIndex
DROP INDEX "Withdrawal_reviewedById_idx";

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "reviewNote",
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewedById",
ADD COLUMN     "accountHolderName" VARCHAR(150),
ADD COLUMN     "accountNumber" VARCHAR(100),
ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "bankAddress" TEXT,
ADD COLUMN     "bankName" VARCHAR(150),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "currency" VARCHAR(20),
ADD COLUMN     "iban" VARCHAR(100),
ADD COLUMN     "ifsc" VARCHAR(50),
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedById" UUID,
ADD COLUMN     "receiveAmount" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "routingNumber" VARCHAR(100),
ADD COLUMN     "sortCode" VARCHAR(50),
ADD COLUMN     "swiftBic" VARCHAR(50),
ALTER COLUMN "destinationAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WithdrawalMethod" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "placeholder" TEXT NOT NULL,
ADD COLUMN     "type" "WithdrawalMethodType" NOT NULL,
ALTER COLUMN "symbol" DROP NOT NULL,
ALTER COLUMN "network" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Withdrawal_processedById_idx" ON "Withdrawal"("processedById");

-- CreateIndex
CREATE INDEX "Withdrawal_createdAt_idx" ON "Withdrawal"("createdAt");

-- CreateIndex
CREATE INDEX "WithdrawalMethod_type_idx" ON "WithdrawalMethod"("type");

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
