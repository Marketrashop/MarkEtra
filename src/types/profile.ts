export type AccountStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED";

export interface UserProfile {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  secondaryPhoneNumber: string | null;

  country: string;

  avatarKey: string | null;

  status: AccountStatus;

  createdAt: string;
}

export interface UpdateProfileInput {
  firstName: string;

  lastName: string;

  phoneNumber: string;

  secondaryPhoneNumber: string;

  country: string;

  avatarKey: string | null;
}

export interface ProfileResponse {
  success: true;

  user: UserProfile;
}

export interface ProfileErrorResponse {
  success: false;

  error: string;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

export type ProfileApiResponse =
  | ProfileResponse
  | ProfileErrorResponse;

export interface DeleteAccountResponse {
  success: boolean;

  message: string;
}