import type {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
} from "../../generated/prisma/client";

export type Order = {
  id: string;

  userId: string;

  orderNumber: string;

  subtotal: number;

  discount: number;

  total: number;

  paymentMethod: PaymentMethod;

  paymentStatus: OrderPaymentStatus;

  status: OrderStatus;

  walletTransactionId: string | null;

  cryptoDepositId: string | null;

  paidAt: Date | null;

  notes: string | null;

  items: OrderItem[];

  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;

  productId: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  selectedColor: string | null;

  selectedSize: string | null;

  product: {
    id: string;
    name: string;
    slug: string;
    primaryImage: string | null;
  };
};

export type CreateOrderInput = {
  userId: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedColor?: string | null;
    selectedSize?: string | null;
  }[];
};

export type CheckoutOrderInput = {
  paymentMethod: PaymentMethod;

  depositMethodId?: string;

  receiptUrl?: string;

  notes?: string | null;
};

export type OrderFilters = {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  paymentMethod?: PaymentMethod;
};

export type OrderSortField =
  | "createdAt"
  | "paidAt"
  | "total";

export type OrderSortDirection = "asc" | "desc";

export type OrderQuery = {
  filters?: OrderFilters;
  sortField?: OrderSortField;
  sortDirection?: OrderSortDirection;
  page?: number;
  pageSize?: number;
};

export type OrderSummary = {
  totalOrders: number;

  pendingOrders: number;

  processingOrders: number;

  shippedOrders: number;

  deliveredOrders: number;

  cancelledOrders: number;

  totalRevenue: number;
};

export type UpdateOrderInput = {
  status?: OrderStatus;
 paymentStatus?: OrderPaymentStatus;
  paymentMethod?: PaymentMethod;
  walletTransactionId?: string | null;
  cryptoDepositId?: string | null;
  paidAt?: Date | null;
  notes?: string | null;
};