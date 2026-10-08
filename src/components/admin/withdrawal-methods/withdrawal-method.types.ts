export type WithdrawalMethodType =
  | "crypto"
  | "bank";

export type ProcessingFeeType =
  | "fixed"
  | "percentage";

export type WithdrawalMethodStatus =
  | "active"
  | "inactive";

export interface WithdrawalMethod {
  id: string;

  type: WithdrawalMethodType;

  name: string;

  symbol: string;

  network: string | null;

  placeholder: string;

  fee: number;

  feeType: ProcessingFeeType;

  minimumAmount: number;

  maximumAmount: number | null;

  icon: string | null;

  isActive: boolean;

  displayOrder: number;

  createdAt: string;

  updatedAt: string;
}

export interface WithdrawalMethodFormValues {
  type: WithdrawalMethodType;

  name: string;

  symbol: string;

  network: string;

  placeholder: string;

  fee: number | null;

  feeType: ProcessingFeeType;

  minimumAmount: number | null;

  maximumAmount: number | null;

  icon: string | null;
}

export interface WithdrawalMethodFormErrors {
  type?: string;

  name?: string;

  symbol?: string;

  network?: string;

  placeholder?: string;

  fee?: string;

  feeType?: string;

  minimumAmount?: string;

  maximumAmount?: string;

  icon?: string;
}

export interface CreateWithdrawalMethodPayload {
  type: WithdrawalMethodType;

  name: string;

  symbol: string;

  network?: string;

  placeholder: string;

  fee: number | null;

  feeType: ProcessingFeeType;

  minimumAmount: number | null;

  maximumAmount?: number | null;

  icon: string | null;
}

export interface UpdateWithdrawalMethodPayload
  extends Partial<CreateWithdrawalMethodPayload> {}

export interface ReorderWithdrawalMethodPayload {
  methods: {
    id: string;
    displayOrder: number;
  }[];
}

export interface ToggleWithdrawalMethodPayload {
  id: string;

  isActive: boolean;
}

export interface WithdrawalMethodResponse {
  success: boolean;

  message: string;

  method: WithdrawalMethod;
}

export interface WithdrawalMethodsResponse {
  success: boolean;

  methods: WithdrawalMethod[];
}

export interface DeleteWithdrawalMethodResponse {
  success: boolean;

  message: string;
}

export interface WithdrawalMethodOption {
  label: string;

  value: WithdrawalMethodType;
}

export const WITHDRAWAL_METHOD_TYPES: WithdrawalMethodOption[] =
  [
    {
      label: "Crypto",
      value: "crypto",
    },
    {
      label: "Bank",
      value: "bank",
    },
  ];

export const PROCESSING_FEE_TYPES: {
  label: string;
  value: ProcessingFeeType;
}[] = [
  {
    label: "Fixed",
    value: "fixed",
  },
  {
    label: "Percentage",
    value: "percentage",
  },
];