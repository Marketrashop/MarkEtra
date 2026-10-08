import { prisma } from "@/lib/prisma";

import WithdrawalMethodTable from "./WithdrawalMethodTable";

export default async function WithdrawalMethodsPage() {
  const methods =
    await prisma.withdrawalMethod.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        sm:gap-[var(--admin-page-gap)]
      "
    >
      <WithdrawalMethodTable
        methods={methods.map((method) => ({
          id: method.id,

          type:
            method.type === "CRYPTO"
              ? "crypto"
              : "bank",

          name: method.name,

          symbol: method.symbol ?? "",

          network: method.network ?? "",

          placeholder: method.placeholder,

          fee: Number(method.processingFee),

          feeType:
            method.processingFeeType === "FIXED"
              ? "fixed"
              : "percentage",

          minimumAmount: Number(
            method.minimumAmount,
          ),

          maximumAmount:
            method.maximumAmount === null
              ? null
              : Number(
                  method.maximumAmount,
                ),

          icon: method.iconKey ?? null,

          isActive: method.isActive,

          displayOrder:
            method.displayOrder,

          createdAt:
            method.createdAt.toISOString(),

          updatedAt:
            method.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}