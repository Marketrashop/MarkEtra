-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddressLine1" VARCHAR(255),
ADD COLUMN     "deliveryAddressLine2" VARCHAR(255),
ADD COLUMN     "deliveryAlternatePhoneNumber" VARCHAR(20),
ADD COLUMN     "deliveryCity" VARCHAR(100),
ADD COLUMN     "deliveryCountry" VARCHAR(100),
ADD COLUMN     "deliveryFullName" VARCHAR(200),
ADD COLUMN     "deliveryPhoneNumber" VARCHAR(20),
ADD COLUMN     "deliveryPostalCode" VARCHAR(20),
ADD COLUMN     "deliveryState" VARCHAR(100);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "alternatePhoneNumber" VARCHAR(20),
    "addressLine1" VARCHAR(255) NOT NULL,
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postalCode" VARCHAR(20),
    "label" VARCHAR(50),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Address_userId_isPrimary_idx" ON "Address"("userId", "isPrimary");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
