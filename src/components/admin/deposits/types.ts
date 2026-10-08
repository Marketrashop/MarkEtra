export type DepositStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type DepositMethod = {
  id: string;

  name: string;

  symbol: string;

  network: string;

  iconKey: string | null;
};

export type DepositUser = {
  id: string;

  firstName: string;
  lastName: string;

  email: string;
};

export type DepositReceipt = {
  fileKey: string | null;

  fileUrl: string | null;
};

export type Deposit = {
  id: string;

  amount: string;

  reference: string;

  receiptUrl: string | null;

  status: DepositStatus;

  reviewNote: string | null;

  createdAt: string;

  reviewedAt: string | null;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  depositMethod: {
    id: string;
    name: string;
    symbol: string;
    network: string;
    iconKey: string | null;
  };

  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type DepositFilters = {
  search: string;

  status: DepositStatus | "ALL";

  methodId: string | "ALL";
};

export type DepositListResponse = {
  success: boolean;

  data: Deposit[];
};

export type ApproveDepositPayload = {
  adminNote?: string;
};

export type RejectDepositPayload = {
  adminNote: string;
};