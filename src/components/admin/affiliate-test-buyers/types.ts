export type AffiliateTestBuyer = {
  id: string;

  name: string;

  imageKey: string | null;

  phone: string;

  email: string | null;

  createdAt: string;

  updatedAt: string;
};

export type CreateAffiliateTestBuyerInput = {
  name: string;

  imageKey?: string | null;

  phone: string;

  email?: string | null;
};

export type UpdateAffiliateTestBuyerInput =
  CreateAffiliateTestBuyerInput;

export type AffiliateTestBuyerResponse = {
  success: boolean;

  data: AffiliateTestBuyer;

  error?: string;

  message?: string;
};

export type AffiliateTestBuyersResponse = {
  success: boolean;

  data: AffiliateTestBuyer[];

  error?: string;

  message?: string;
};