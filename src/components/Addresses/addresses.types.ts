export type Address = {
  id: string;

  userId: string;

  fullName: string;

  phoneNumber: string;

  alternatePhoneNumber:
    | string
    | null;

  addressLine1: string;

  addressLine2:
    | string
    | null;

  city: string;

  state:
    | string
    | null;

  country: string;

  postalCode:
    | string
    | null;

  isPrimary: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export type AddressFormValues = {
  fullName: string;

  phoneNumber: string;

  alternatePhoneNumber:
    | string
    | null;

  addressLine1: string;

  addressLine2:
    | string
    | null;

  city: string;

  state:
    | string
    | null;

  country: string;

  postalCode:
    | string
    | null;

  isPrimary: boolean;
};

export type AddressResponse = {
  success: boolean;

  data: Address;

  error?: string;
};

export type AddressesResponse = {
  success: boolean;

  data: Address[];

  error?: string;
};

export type AddressMutationResponse = {
  success: boolean;

  data?: Address;

  message?: string;

  error?: string;

  fieldErrors?: Record<
    string,
    string[] | undefined
  >;
};