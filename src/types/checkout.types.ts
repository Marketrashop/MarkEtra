import type {
  PaymentMethod,
} from "../../generated/prisma/client";

import type {
  Address,
} from "@/types/address.types";

import type {
  CartItem,
  CartSummary,
} from "@/components/Cart/cart.types";

import type {
  DepositMethod,
} from "@/components/Deposit/deposit.types";

import type {
  CheckoutValidationInput,
} from "@/validation/checkout.validation";

export type CheckoutPaymentMethod =
  PaymentMethod;

export type CheckoutDeliveryDetails = {
  fullName: string;

  phoneNumber: string;

  alternatePhoneNumber?:
    | string
    | null;

  addressLine1: string;

  addressLine2?:
    | string
    | null;

  city: string;

  state?:
    | string
    | null;

  country: string;

  postalCode?:
    | string
    | null;
};

export type CheckoutAddressSource =
  | {
      type: "SAVED";

      addressId: string;
    }
  | {
      type: "NEW";

      details: CheckoutDeliveryDetails;

      saveAsPrimary: boolean;
    };

export type CheckoutCartData = {
  items: CartItem[];

  summary: CartSummary;
};

export type CheckoutPaymentState = {
  method: CheckoutPaymentMethod;

  walletBalance: number;

  selectedDepositMethod:
    | DepositMethod
    | null;

  receiptUrl:
    | string
    | null;

  receiptUploaded: boolean;
};

export type CheckoutInitialData = {
  cart: CheckoutCartData;

  addresses: Address[];

  primaryAddress:
    | Address
    | null;

  walletBalance: number;

  depositMethods:
    DepositMethod[];
};

export type CheckoutFormState = {
  delivery:
    | CheckoutDeliveryDetails
    | null;

  addressSource:
    | CheckoutAddressSource
    | null;

  paymentMethod:
    | CheckoutPaymentMethod
    | null;

  selectedDepositMethodId:
    | string
    | null;

  receiptUrl:
    | string
    | null;

  notes: string;
};

export type CheckoutSubmitInput =
  CheckoutValidationInput;

export type CheckoutOrderItemPreview = {
  productId: string;

  variantSizeId: string;

  name: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  imageUrl:
    | string
    | null;
};

export type CheckoutSummary = {
  items:
    CheckoutOrderItemPreview[];

  subtotal: number;

  discount: number;

  total: number;
};

export type CheckoutResponse = {
  success: true;

  order: {
    id: string;

    orderNumber: string;

    paymentMethod:
      CheckoutPaymentMethod;

    paymentStatus:
      "PENDING"
      | "PAID"
      | "FAILED";

    status:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED";

    total: number;
  };
};