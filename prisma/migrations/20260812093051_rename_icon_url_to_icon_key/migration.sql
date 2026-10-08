/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `DepositMethod` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `WithdrawalMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DepositMethod" DROP COLUMN "iconUrl",
ADD COLUMN     "iconKey" VARCHAR(100);

-- AlterTable
ALTER TABLE "WithdrawalMethod" DROP COLUMN "iconUrl",
ADD COLUMN     "iconKey" VARCHAR(100);
