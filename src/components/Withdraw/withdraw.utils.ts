export function formatWithdrawAmount(
  amount: number
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);
}

export function calculateRemainingBalance(
  availableBalance: number,
  withdrawalAmount: number
): number {
  return Math.max(
    availableBalance -
      withdrawalAmount,
    0
  );
}

export function calculateReceiveAmount(
  withdrawalAmount: number,
  networkFee: number
): number {
  return Math.max(
    withdrawalAmount -
      networkFee,
    0
  );
}

export function isValidWithdrawalAmount(
  amount: number,
  availableBalance: number,
  minimumWithdrawal: number
): boolean {
  return (
    amount >= minimumWithdrawal &&
    amount <= availableBalance
  );
}

export function getWithdrawalAmountError(
  amount: number,
  availableBalance: number,
  minimumWithdrawal: number
): string | null {
  if (amount <= 0) {
    return null;
  }

  if (
    amount < minimumWithdrawal
  ) {
    return `Minimum withdrawal: ${formatWithdrawAmount(
      minimumWithdrawal
    )}`;
  }

  if (
    amount > availableBalance
  ) {
    return "Withdrawal amount exceeds your available balance.";
  }

  return null;
}