export type DepositMethod = {
  id: string;

  name: string;

  symbol: string;

  address: string;

  icon: string;

  qrCode: string;
};

export type DepositStatus =
  | "pending"
  | "successful"
  | "failed";

export type DepositHistoryItem = {
  id: string;

  method: DepositMethod;

  amount: number;

  status: DepositStatus;

  createdAt: string;

  reference: string;
};

export type DepositSummary = {
  method: string;

  amount: number;

  gatewayFee: number;

  bonus: number;

  totalCredit: number;
};