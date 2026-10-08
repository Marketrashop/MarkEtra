import type {
  ChangePasswordValues,
} from "./security.validation";

export type ChangePasswordPayload =
  ChangePasswordValues;

export type ActiveSessionLocation = {
  city: string | null;

  region: string | null;

  country: string | null;

  countryCode: string | null;
};

export type ActiveSession = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  location:
    | ActiveSessionLocation
    | null;
  rememberMe: boolean;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  current: boolean;
  active: boolean;
};

export type ActiveSessionsResponse = {
  success: boolean;

  sessions: ActiveSession[];
};

export type ChangePasswordResponse = {
  success: boolean;

  message: string;
};