export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  country: string;
};

export type ProfileUser = {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  phoneNumber: string;
  secondaryPhoneNumber: string | null;

  country: string;

  avatarKey: string | null;
  avatarUrl?: string | null;

  status: string;

  createdAt: string;

  emailVerified?: boolean;

  phoneVerified?: boolean;

  profileCompletion?: number;

  lastUpdatedAt?: string;
};

export type UpdateProfilePayload =
  ProfileFormValues;

export type UpdateProfileResponse = {
  success: boolean;
  user: ProfileUser;
};

export type DeleteProfileResponse = {
  success: boolean;
  message: string;
};

export type AvatarUploadResponse = {
  success: boolean;
  avatarKey: string;
  avatarUrl: string;
};

export type AvatarUploaderProps = {
  avatarKey: string | null;

  fullName: string;

  onUploaded: (
    avatarKey: string,
    avatarUrl: string,
  ) => void;
};

export type ProfileHeaderProps = {
  user: ProfileUser;
  onEdit: () => void;
};

export type EditProfileDialogProps = {
  open: boolean;
  onClose: () => void;

  initialValues: ProfileFormValues;

  onSuccess: (
    values: ProfileFormValues,
  ) => void;
};

export type EditProfileFormProps = {
  initialValues: ProfileFormValues;

  loading?: boolean;

  onSuccess: (
    values: ProfileFormValues,
  ) => void;
};

export type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};