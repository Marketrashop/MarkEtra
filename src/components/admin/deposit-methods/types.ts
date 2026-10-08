export type DepositMethod = {
  id: string;

  name: string;

  symbol: string;

  network: string;

  walletAddress: string;

  instructions: string | null;

  minimumAmount: string;

  maximumAmount: string | null;

  isActive: boolean;

  displayOrder: number;

  iconKey: string | null;

  qrCodeKey: string | null;

  createdAt: string;

  updatedAt: string;
};