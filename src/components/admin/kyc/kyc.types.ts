import type {
  KycDocumentType,
  KycRecord,
  KycStatus,
} from "@/components/kyc/kyc.types";

export type {
  KycDocumentType,
  KycRecord,
  KycStatus,
};

export type AdminKycRecord =
  KycRecord & {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };

export type KycFilters = {
  search: string;

  status:
    | "ALL"
    | KycStatus;
};