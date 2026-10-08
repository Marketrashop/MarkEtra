/*
  Safe migration for existing users.
*/

ALTER TABLE "User"
ADD COLUMN "country" VARCHAR(100),
ADD COLUMN "phoneNumber" VARCHAR(20);

UPDATE "User"
SET
  "country" = 'Nigeria',
  "phoneNumber" = CASE
    WHEN "email" = 'admin@marketsparks.com' THEN '+2348000000000'
    ELSE '+2348000000001'
  END
WHERE "country" IS NULL
   OR "phoneNumber" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

CREATE UNIQUE INDEX "User_phoneNumber_key"
ON "User"("phoneNumber");

CREATE INDEX "User_phoneNumber_idx"
ON "User"("phoneNumber");

CREATE INDEX "User_country_idx"
ON "User"("country");