export type Address = {
  id: string;

  userId: string;

  fullName: string;

  phoneNumber: string;

  alternatePhoneNumber: string | null;

  addressLine1: string;

  addressLine2: string | null;

  city: string;

  state: string | null;

  country: string;

  postalCode: string | null;

  label: string | null;

  isPrimary: boolean;

  createdAt: string;

  updatedAt: string;
};

export type CreateAddressInput = {
  fullName: string;

  phoneNumber: string;

  alternatePhoneNumber?: string | null;

  addressLine1: string;

  addressLine2?: string | null;

  city: string;

  state?: string | null;

  country: string;

  postalCode?: string | null;

  label?: string | null;

  isPrimary?: boolean;
};

export type UpdateAddressInput =
  Partial<CreateAddressInput>;