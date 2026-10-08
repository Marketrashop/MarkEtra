export type WithdrawStatus =
  | "pending"
  | "successful"
  | "rejected";

export type WithdrawMethodType =
  | "crypto"
  | "bank";

export type WithdrawBalanceType =
  | "wallet"
  | "profit"
  | "affiliate";

export type WithdrawCryptoMethod = {
  id: string;

  type: "crypto";

  name: string;

  symbol: string;

  icon: string;

  network: string;

  placeholder: string;

  minimumAmount?: number;

  maximumAmount?: number;

  networkFee?: number;

  isActive?: boolean;
};

export type WithdrawBankMethod = {
  id: string;

  type: "bank";

  name: string;

  symbol: string;

  icon?: string;

  minimumAmount?: number;

  maximumAmount?: number;

  isActive?: boolean;
};

export type WithdrawMethod =
  | WithdrawCryptoMethod
  | WithdrawBankMethod;

export type WithdrawBankDetails = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  country: string;
  currency: string;
  bankAddress: string;

  swiftBic: string;
  iban: string;
  routingNumber: string;
  sortCode: string;
  ifsc: string;
};

export type WithdrawHistoryItem = {
  id: string;

  reference: string;

  method: WithdrawMethod;

  destinationAddress?: string;

  bankDetails?: WithdrawBankDetails;

  amount: number;

  cryptoAmount: number;

  status: WithdrawStatus;

  createdAt: string;

  createdTime: string;
};

export type WithdrawSummary = {
  method: string;

  amount: number;

  networkFee: number;

  youReceive: number;
};

export type WithdrawFilter =
  | "all"
  | WithdrawStatus;

export type WithdrawAmountState = {
  availableBalance: number;

  withdrawalAmount: number;

  remainingBalance: number;
};

export type WithdrawDetailsProps = {
  method: WithdrawMethod;

  address: string;

  onAddressChange: (
    value: string,
  ) => void;

  bankDetails: WithdrawBankDetails;

  onBankDetailsChange: (
    values: Partial<WithdrawBankDetails>,
  ) => void;

  amount: number;

  onAmountChange: (
    amount: number,
  ) => void;

  availableBalance: number;

  withdrawFrom: WithdrawBalanceType;

  onWithdrawFromChange: (
    value: WithdrawBalanceType,
  ) => void;

  disabled?: boolean;
};