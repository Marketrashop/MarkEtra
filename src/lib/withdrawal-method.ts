export function toPrismaWithdrawalType(
  type: "crypto" | "bank"
): "CRYPTO" | "BANK" {
  return type === "bank"
    ? "BANK"
    : "CRYPTO";
}

export function fromPrismaWithdrawalType(
  type: "CRYPTO" | "BANK"
): "crypto" | "bank" {
  return type === "BANK"
    ? "bank"
    : "crypto";
}