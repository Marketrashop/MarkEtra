export type WithdrawalStatus =
  | "pending"
  | "processing"
  | "completed"
  | "rejected";

export type WithdrawalMethodType =
  | "crypto"
  | "bank";

export type WithdrawalCryptoDetails = {
  address: string;
  network: string;
  symbol: string;
};

export type WithdrawalBankDetails = {
  accountHolderName: string;

  bankName: string;

  accountNumber: string;

  country: string;

  currency: string;

  bankAddress: string;

  swiftCode: string;

  swiftBic: string;

  iban: string;

  routingNumber: string;

  sortCode: string;

  ifscCode: string;

  ifsc: string;
};

export type WithdrawalMethod = {
  id: string;

  type: WithdrawalMethodType;

  name: string;

  symbol: string;

  network: string;

  icon: string | null;
};

export type WithdrawalUser = {
  id: string;

  name: string;

  firstName: string;

  lastName: string;

  email: string;
};

export type Withdrawal = {
  id: string;

  reference: string;

  amount: number;

  fee: number;

  receiveAmount: number;

  status: WithdrawalStatus;

  createdAt: string;

  updatedAt: string;

  rejectionReason: string | null;

  destinationAddress: string;

  method: WithdrawalMethod;

  user: WithdrawalUser;

  cryptoDetails?: WithdrawalCryptoDetails;

  bankDetails?: WithdrawalBankDetails;
};

export type WithdrawalFilters = {
  search: string;

  methodId: string;
};

export type WithdrawalReviewAction =
  | "approve"
  | "reject";