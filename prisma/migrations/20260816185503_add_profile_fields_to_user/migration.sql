/*
  Warnings:

  - A unique constraint covering the columns `[secondaryPhoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarKey" TEXT,
ADD COLUMN     "secondaryPhoneNumber" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "User_secondaryPhoneNumber_key" ON "User"("secondaryPhoneNumber");

-- CreateIndex
CREATE INDEX "User_secondaryPhoneNumber_idx" ON "User"("secondaryPhoneNumber");
