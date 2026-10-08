UPDATE "User" AS u
SET "totalDeposit" = COALESCE(
  (
    SELECT SUM(d."amount")
    FROM "Deposit" AS d
    WHERE d."userId" = u."id"
      AND d."status" = 'APPROVED'
  ),
  0
);