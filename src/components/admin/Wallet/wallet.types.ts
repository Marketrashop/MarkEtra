export type WalletAction =
  | "CREDIT"
  | "DEBIT";

export type WalletUser = {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  role: string;

  status: string;

  createdAt: string;

  wallet: {
    id: string;

    availableBalance: string;

    lockedBalance: string;
  } | null;

  profit: string;

  totalDeposit: string;

  affiliateCommission: string;
};

export type WalletUsersResponse = {
  success: boolean;

  data: WalletUser[];
};

export type WalletBalanceType =
  | "wallet"
  | "profit"
  | "totalDeposit"
  | "affiliateCommission";

export type WalletAdjustmentRequest = {
  userId: string;

  balanceType: WalletBalanceType;

  action: WalletAction;

  amount: number;
};

export type WalletAdjustmentResponse = {
  success: boolean;

  message: string;

  data: {
    balance: string;
  };
};

export type WalletActionModalState = {
  open: boolean;

  user: WalletUser | null;
};

export type WalletSearchProps = {
  value: string;

  onChange: (
    value: string,
  ) => void;
};

export type WalletUsersTableProps = {
  users: WalletUser[];

  loading: boolean;

  onManage: (
    user: WalletUser,
  ) => void;
};

export type WalletUserRowProps = {
  user: WalletUser;

  onManage: (
    user: WalletUser,
  ) => void;
};

export type WalletActionModalProps = {
  open: boolean;

  user: WalletUser | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (
    balanceType: WalletBalanceType,
    action: WalletAction,
    amount: number,
  ) => Promise<void>;
};