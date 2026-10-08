-- CreateEnum
CREATE TYPE "AuthRequestType" AS ENUM ('EMAIL_VERIFICATION_RESEND', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "AuthRequestLog" (
    "id" UUID NOT NULL,
    "type" "AuthRequestType" NOT NULL,
    "userId" UUID,
    "identifierHash" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthRequestLog_type_identifierHash_createdAt_idx" ON "AuthRequestLog"("type", "identifierHash", "createdAt");

-- CreateIndex
CREATE INDEX "AuthRequestLog_userId_type_createdAt_idx" ON "AuthRequestLog"("userId", "type", "createdAt");

-- AddForeignKey
ALTER TABLE "AuthRequestLog" ADD CONSTRAINT "AuthRequestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
