import type { KycFormValues } from "./kyc.validation";

export type KycStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type KycDocumentType =
  | "NATIONAL_ID"
  | "PASSPORT"
  | "DRIVERS_LICENSE";

export type KycRecord = {
  id: string;

  userId: string;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  nationality: string;

  residentialAddress: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  documentType: KycDocumentType;

  frontDocumentKey: string;

  backDocumentKey: string | null;

  selfieKey: string;

  status: KycStatus;

  rejectionReason: string | null;

  submittedAt: string;

  reviewedAt: string | null;

  createdAt: string;

  updatedAt: string;
};

export type SubmitKycPayload = KycFormValues;

export type ReviewKycPayload = {
  action:
    | "approve"
    | "reject";

  rejectionReason?: string;
};