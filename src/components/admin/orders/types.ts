import type {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
} from "../../../../generated/prisma/client";

export type AdminOrderItem = {
  id: string;

  productId: string;

  productName: string;

  variantSizeId: string | null;

  quantity: number;

  unitPrice: string;

  totalPrice: string;

  selectedColor: string | null;

  selectedSize: string | null;

  primaryImage: string | null;
};

export type AdminOrderUser = {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  avatarKey: string | null;
};

export type AdminOrderCryptoPayment = {
  id: string;

  reference: string;

  amount: string;

  receiptUrl: string | null;

  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  depositMethod: {
    id: string;

    name: string;

    symbol: string;

    network: string;

    iconKey: string | null;
  };
};

export type AdminOrder = {
  id: string;

  orderNumber: string;

  subtotal: string;

  discount: string;

  total: string;

  paymentMethod: PaymentMethod;

  paymentStatus: OrderPaymentStatus;

  status: OrderStatus;

  paidAt: string | null;

  createdAt: string;

  updatedAt: string;

  notes: string | null;

  deliveryFullName: string | null;

  deliveryPhoneNumber: string | null;

  deliveryAlternatePhoneNumber:
    | string
    | null;

  deliveryAddressLine1: string | null;

  deliveryAddressLine2: string | null;

  deliveryCity: string | null;

  deliveryState: string | null;

  deliveryCountry: string | null;

  deliveryPostalCode: string | null;

  user: AdminOrderUser;

  cryptoDeposit:
    | AdminOrderCryptoPayment
    | null;

  items: AdminOrderItem[];
};

export type AdminOrderFilters = {
  search: string;

  paymentMethod:
    | PaymentMethod
    | "ALL";

  paymentStatus:
    | OrderPaymentStatus
    | "ALL";

  status:
    | OrderStatus
    | "ALL";
};

export type AdminOrdersResponse = {
  success: boolean;

  data: AdminOrder[];
};

export type AdminOrderActionPayload = {
  adminNote?: string;
};

export type RejectAdminOrderPayload = {
  adminNote: string;
};