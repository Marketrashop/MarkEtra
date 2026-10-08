import { prisma } from "@/lib/prisma";

import type {
  Order,
  OrderItem,
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  Prisma,
} from "../../generated/prisma/client";

import type {
  CreateOrderInput,
  OrderFilters,
  UpdateOrderInput,
} from "@/types/order.types";

export async function createOrder(
  data: CreateOrderInput,
): Promise<Order> {
  return prisma.order.create({
    data: {
      userId: data.userId,
      orderNumber: data.orderNumber,
      subtotal: data.subtotal,
      discount: data.discount,
      total: data.total,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: {
        create: data.items,
      },
    },
    include: {
      items: true,
    },
  });
}

export async function getOrderById(
  id: string,
) {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: {
                  isPrimary: true,
                },
                take: 1,
              },
            },
          },
        },
      },
      user: true,
      walletTransaction: true,
      cryptoDeposit: true,
    },
  });
}

export async function getOrderByNumber(
  orderNumber: string,
) {
  return prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: true,
    },
  });
}

export async function getOrders(
  filters: OrderFilters = {},
) {
  const where: Prisma.OrderWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod;
  }

  return prisma.order.findMany({
    where,
    include: {
      user: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateOrder(
  id: string,
  data: UpdateOrderInput,
): Promise<Order> {
  return prisma.order.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: OrderPaymentStatus,
): Promise<Order> {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      paymentStatus,
      paidAt:
        paymentStatus === "PAID"
          ? new Date()
          : null,
    },
  });
}

export async function attachWalletTransaction(
  orderId: string,
  walletTransactionId: string,
): Promise<Order> {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      walletTransactionId,
    },
  });
}

export async function attachCryptoDeposit(
  orderId: string,
  cryptoDepositId: string,
): Promise<Order> {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      cryptoDepositId,
    },
  });
}

export async function deleteOrder(
  id: string,
): Promise<Order> {
  return prisma.order.delete({
    where: {
      id,
    },
  });
}