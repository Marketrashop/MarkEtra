import {
  randomUUID,
} from "crypto";

import {
  Prisma,
} from "../../generated/prisma/client";

import {
  attachCryptoDeposit,
  attachWalletTransaction,
  createOrder,
  deleteOrder,
  getOrderById,
  getOrderByNumber,
  getOrders,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/repositories/order.repository";

import {
  prisma,
} from "@/lib/prisma";

import type {
  CheckoutSubmitInput,
} from "@/types/checkout.types";

import type {
  CreateOrderInput,
  OrderFilters,
  UpdateOrderInput,
} from "@/types/order.types";

import {
  OrderStatus,
} from "../../generated/prisma/client";

import type {
  OrderPaymentStatus,
} from "../../generated/prisma/client";

function generateOrderNumber() {
  return `MS-${Date.now()}-${randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;
}

function generateDepositReference() {
  return `ORD-DEP-${Date.now()}-${randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;
}

function getSellableStock(
  stock: number,
  reservedStock: number,
) {
  return Math.max(
    0,
    stock - reservedStock,
  );
}

async function resolveDeliveryAddress(
  tx: Prisma.TransactionClient,
  userId: string,
  input: CheckoutSubmitInput,
) {
  if (
    input.addressSource.type ===
    "SAVED"
  ) {
    const address =
      await tx.address.findFirst({
        where: {
          id:
            input.addressSource
              .addressId,

          userId,
        },
      });

    if (!address) {
      throw new Error(
        "ADDRESS_NOT_FOUND",
      );
    }

    return address;
  }

  const details =
    input.addressSource.details;

  if (
    input.addressSource
      .saveAsPrimary
  ) {
    await tx.address.updateMany({
      where: {
        userId,
        isPrimary: true,
      },

      data: {
        isPrimary: false,
      },
    });

    return tx.address.create({
      data: {
        userId,

        fullName:
          details.fullName,

        phoneNumber:
          details.phoneNumber,

        alternatePhoneNumber:
          details.alternatePhoneNumber ??
          null,

        addressLine1:
          details.addressLine1,

        addressLine2:
          details.addressLine2 ??
          null,

        city:
          details.city,

        state:
          details.state ??
          null,

        country:
          details.country,

        postalCode:
          details.postalCode ??
          null,

        isPrimary: true,
      },
    });
  }

  return {
    id: `checkout:${randomUUID()}`,

    userId,

    fullName:
      details.fullName,

    phoneNumber:
      details.phoneNumber,

    alternatePhoneNumber:
      details.alternatePhoneNumber ??
      null,

    addressLine1:
      details.addressLine1,

    addressLine2:
      details.addressLine2 ??
      null,

    city:
      details.city,

    state:
      details.state ??
      null,

    country:
      details.country,

    postalCode:
      details.postalCode ??
      null,

    label: null,

    isPrimary: false,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}

async function getCheckoutItems(
  tx: Prisma.TransactionClient,
  userId: string,
  input: CheckoutSubmitInput,
) {
if (input.mode === "DIRECT") {
  const inventory =
    await tx.productVariantSize.findUnique({
      where: {
        id: input.variantSizeId,
      },

      select: {
        id: true,

        size: true,

        price: true,

        stock: true,

        reservedStock: true,

        allowPreorder: true,

        variant: {
          select: {
            id: true,

            type: true,

            label: true,

            product: {
              select: {
                id: true,

                name: true,

                status: true,

                price: true,
              },
            },
          },
        },
      },
    });

  if (!inventory) {
    throw new Error(
      "INVENTORY_NOT_FOUND",
    );
  }

  const directItem = {
    id: `direct:${randomUUID()}`,

    productId:
      inventory.variant.product.id,

    variantSizeId:
      inventory.id,

    quantity:
      input.quantity,

    product:
      inventory.variant.product,

    variantSize: {
      id:
        inventory.id,

      size:
        inventory.size,

      price:
        inventory.price,

      stock:
        inventory.stock,

      reservedStock:
        inventory.reservedStock,

      allowPreorder:
        inventory.allowPreorder,

      variant: {
        id:
          inventory.variant.id,

        type:
          inventory.variant.type,

        label:
          inventory.variant.label,
      },
    },
  };

  if (!input.includeCart) {
    return {
      cartId: null,

      items: [
        directItem,
      ],
    };
  }

  const cart =
    await tx.cart.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        items: {
          where: {
            status: "CART",

            variantSize: {
              isNot: null,
            },
          },

          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,

            productId: true,

            variantSizeId: true,

            quantity: true,

            product: {
              select: {
                id: true,

                name: true,

                status: true,

                price: true,
              },
            },

            variantSize: {
              select: {
                id: true,

                size: true,

                price: true,

                stock: true,

                reservedStock: true,

                allowPreorder: true,

                variant: {
                  select: {
                    id: true,

                    type: true,

                    label: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  return {
    cartId:
      cart?.id ?? null,

    items: [
      ...(cart?.items ?? []),
      directItem,
    ],
  };
}

  const cart =
    await tx.cart.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        items: {
          where: {
            status: "CART",

            variantSize: {
              isNot: null,
            },
          },

          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,

            productId: true,

            variantSizeId: true,

            quantity: true,

            product: {
              select: {
                id: true,

                name: true,

                status: true,

                price: true,
              },
            },

            variantSize: {
              select: {
                id: true,

                size: true,

                price: true,

                stock: true,

                reservedStock: true,

                allowPreorder: true,

                variant: {
                  select: {
                    id: true,

                    type: true,

                    label: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (
    !cart ||
    cart.items.length === 0
  ) {
    throw new Error(
      "CART_EMPTY",
    );
  }

  return {
    cartId: cart.id,

    items: cart.items,
  };
}

export async function createCheckoutOrderService(
  userId: string,
  input: CheckoutSubmitInput,
) {
  const execute =
    async () =>
      prisma.$transaction(
        async (tx) => {
const checkout =
  await getCheckoutItems(
    tx,
    userId,
    input,
  );

          const address =
            await resolveDeliveryAddress(
              tx,
              userId,
              input,
            );

          const orderNumber =
            generateOrderNumber();

const orderItems: {
  productId: string;
  variantSizeId: string;
  quantity: number;
  stockQuantity: number;
  preorderQuantity: number;
  unitPrice: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  selectedColor: string | null;
  selectedSize: string | null;
}[] = [];

          let subtotal =
            new Prisma.Decimal(0);

          for (const item of checkout.items) {
            if (
              item.product.status !==
              "ACTIVE"
            ) {
              throw new Error(
                `PRODUCT_UNAVAILABLE:${item.product.name}`,
              );
            }

            if (
              !item.variantSize
            ) {
              throw new Error(
                "INVENTORY_NOT_FOUND",
              );
            }

            const currentInventory =
              await tx.productVariantSize.findUnique(
                {
where: {
  id:
    item.variantSize.id,

  variant: {
    productId:
      item.productId,
  },
},

                  select: {
                    id: true,

                    size: true,

                    price: true,

                    stock: true,

                    reservedStock: true,

                    allowPreorder:
                      true,

                    variant: {
                      select: {
                        type: true,

                        label: true,
                      },
                    },
                  },
                },
              );

            if (
              !currentInventory
            ) {
              throw new Error(
                "INVENTORY_NOT_FOUND",
              );
            }

            const availableStock =
              getSellableStock(
                currentInventory.stock,
                currentInventory.reservedStock,
              );

            if (
              item.quantity >
                availableStock &&
              !currentInventory.allowPreorder
            ) {
              throw new Error(
                `INSUFFICIENT_STOCK:${item.product.name}`,
              );
            }

            const unitPrice =
              currentInventory.price ??
              item.product.price;

            const totalPrice =
              unitPrice.mul(
                item.quantity,
              );

            subtotal =
              subtotal.plus(
                totalPrice,
              );

orderItems.push({
  productId:
    item.productId,

  variantSizeId:
    currentInventory.id,

  quantity:
    item.quantity,

  stockQuantity: 0,

  preorderQuantity: 0,

  unitPrice,

  totalPrice,

  selectedColor:
    currentInventory
      .variant
      .type ===
    "COLOR"
      ? currentInventory
          .variant
          .label
      : null,

  selectedSize:
    currentInventory.size,
});
          }

          const total =
            subtotal;

          if (
            input.paymentMethod ===
            "CRYPTO"
          ) {
            if (
              !input.depositMethodId
            ) {
              throw new Error(
                "DEPOSIT_METHOD_REQUIRED",
              );
            }

            if (
              !input.receiptUrl
            ) {
              throw new Error(
                "RECEIPT_REQUIRED",
              );
            }

            const depositMethod =
              await tx.depositMethod.findUnique(
                {
                  where: {
                    id:
                      input.depositMethodId,
                  },

                  select: {
                    id: true,

                    isActive: true,

                    minimumAmount:
                      true,

                    maximumAmount:
                      true,
                  },
                },
              );

            if (
              !depositMethod ||
              !depositMethod.isActive
            ) {
              throw new Error(
                "DEPOSIT_METHOD_UNAVAILABLE",
              );
            }

            if (
              total.lessThan(
                depositMethod.minimumAmount,
              )
            ) {
              throw new Error(
                "ORDER_TOTAL_BELOW_MINIMUM_DEPOSIT",
              );
            }

            if (
              depositMethod.maximumAmount !==
                null &&
              total.greaterThan(
                depositMethod.maximumAmount,
              )
            ) {
              throw new Error(
                "ORDER_TOTAL_ABOVE_MAXIMUM_DEPOSIT",
              );
            }

            const deposit =
              await tx.deposit.create({
                data: {
                  userId,

                  depositMethodId:
                    depositMethod.id,

                  amount: total,

                  reference:
                    generateDepositReference(),

                  receiptUrl:
                    input.receiptUrl,

                  status:
                    "PENDING",
                },
              });

            const order =
              await tx.order.create({
                data: {
                  userId,

                  orderNumber,

                  subtotal,

                  discount:
                    new Prisma.Decimal(
                      0,
                    ),

                  total,

                  paymentMethod:
                    "CRYPTO",

                  paymentStatus:
                    "PENDING",

                  status:
                    "PENDING",

                  cryptoDepositId:
                    deposit.id,

                  deliveryFullName:
                    address.fullName,

                  deliveryPhoneNumber:
                    address.phoneNumber,

                  deliveryAlternatePhoneNumber:
                    address.alternatePhoneNumber,

                  deliveryAddressLine1:
                    address.addressLine1,

                  deliveryAddressLine2:
                    address.addressLine2,

                  deliveryCity:
                    address.city,

                  deliveryState:
                    address.state,

                  deliveryCountry:
                    address.country,

                  deliveryPostalCode:
                    address.postalCode,

                  notes:
                    input.notes ??
                    null,

items: {
  create: orderItems.map(
    (item) => ({
      quantity:
        item.quantity,

      stockQuantity:
        item.stockQuantity,

      preorderQuantity:
        item.preorderQuantity,

      unitPrice:
        item.unitPrice,

      totalPrice:
        item.totalPrice,

      selectedColor:
        item.selectedColor,

      selectedSize:
        item.selectedSize,

      product: item.productId
        ? {
            connect: {
              id:
                item.productId,
            },
          }
        : undefined,

      variantSize:
        item.variantSizeId
          ? {
              connect: {
                id:
                  item.variantSizeId,
              },
            }
          : undefined,
    }),
  ),
},
                },

                include: {
                  items: true,
                },
              });

if (checkout.cartId) {
  await tx.cartItem.deleteMany({
    where: {
      cartId: checkout.cartId,
      status: "CART",
    },
  });
}

            return {
              order,
              paymentStatus:
                "PENDING" as const,
              status:
                "PENDING" as const,
            };
          }

          const wallet =
            await tx.wallet.findUnique({
              where: {
                userId,
              },

              select: {
                id: true,

                availableBalance:
                  true,
              },
            });

          if (!wallet) {
            throw new Error(
              "WALLET_NOT_FOUND",
            );
          }

          const balanceBefore =
            wallet.availableBalance;

          if (
            balanceBefore.lessThan(
              total,
            )
          ) {
            throw new Error(
              "INSUFFICIENT_WALLET_BALANCE",
            );
          }

          const balanceAfter =
            balanceBefore.minus(
              total,
            );

          const walletTransaction =
            await tx.walletTransaction.create(
              {
                data: {
                  walletId:
                    wallet.id,

                  userId,

                  type: "DEBIT",

                  amount: total,

                  balanceBefore,

                  balanceAfter,

                  description:
                    `Order ${orderNumber} payment`,
                },
              },
            );

for (
  let index = 0;
  index < checkout.items.length;
  index++
) {
  const item =
    checkout.items[index];

  if (!item.variantSizeId) {
    throw new Error(
      "INVENTORY_NOT_FOUND",
    );
  }

  const inventory =
    await tx.productVariantSize.findUnique({
      where: {
        id:
          item.variantSizeId,

        variant: {
          productId:
            item.productId,
        },
      },

      select: {
        id: true,
        stock: true,
        reservedStock: true,
        allowPreorder: true,
      },
    });

  if (!inventory) {
    throw new Error(
      "INVENTORY_NOT_FOUND",
    );
  }

  const availableStock =
    getSellableStock(
      inventory.stock,
      inventory.reservedStock,
    );

  if (
    item.quantity <=
    availableStock
  ) {
    await tx.productVariantSize.update({
      where: {
        id: inventory.id,
      },

      data: {
        stock: {
          decrement:
            item.quantity,
        },
      },
    });

    orderItems[index].stockQuantity =
      item.quantity;

    orderItems[index].preorderQuantity =
      0;

    continue;
  }

  if (
    !inventory.allowPreorder
  ) {
    throw new Error(
      "INSUFFICIENT_STOCK",
    );
  }

  const inStockQuantity =
    availableStock;

  const preorderQuantity =
    item.quantity -
    inStockQuantity;

  await tx.productVariantSize.update({
    where: {
      id: inventory.id,
    },

    data: {
      ...(inStockQuantity > 0
        ? {
            stock: {
              decrement:
                inStockQuantity,
            },
          }
        : {}),

      reservedStock: {
        increment:
          preorderQuantity,
      },
    },
  });

  orderItems[index].stockQuantity =
    inStockQuantity;

  orderItems[index].preorderQuantity =
    preorderQuantity;
}

          await tx.wallet.update({
            where: {
              id: wallet.id,
            },

            data: {
              availableBalance:
                balanceAfter,
            },
          });

          const order =
            await tx.order.create({
              data: {
                userId,

                orderNumber,

                subtotal,

                discount:
                  new Prisma.Decimal(
                    0,
                  ),

                total,

                paymentMethod:
                  "WALLET",

                paymentStatus:
                  "PAID",

                status:
                  "PROCESSING",

                walletTransactionId:
                  walletTransaction.id,

                paidAt:
                  new Date(),

                deliveryFullName:
                  address.fullName,

                deliveryPhoneNumber:
                  address.phoneNumber,

                deliveryAlternatePhoneNumber:
                  address.alternatePhoneNumber,

                deliveryAddressLine1:
                  address.addressLine1,

                deliveryAddressLine2:
                  address.addressLine2,

                deliveryCity:
                  address.city,

                deliveryState:
                  address.state,

                deliveryCountry:
                  address.country,

                deliveryPostalCode:
                  address.postalCode,

                notes:
                  input.notes ??
                  null,

items: {
  create: orderItems.map(
    (item) => ({
      quantity:
        item.quantity,

      stockQuantity:
        item.stockQuantity,

      preorderQuantity:
        item.preorderQuantity,

      unitPrice:
        item.unitPrice,

      totalPrice:
        item.totalPrice,

      selectedColor:
        item.selectedColor,

      selectedSize:
        item.selectedSize,

      product: item.productId
        ? {
            connect: {
              id:
                item.productId,
            },
          }
        : undefined,

      variantSize:
        item.variantSizeId
          ? {
              connect: {
                id:
                  item.variantSizeId,
              },
            }
          : undefined,
    }),
  ),
},
              },

              include: {
                items: true,
              },
            });

if (checkout.cartId) {
  await tx.cartItem.deleteMany({
    where: {
      cartId: checkout.cartId,
      status: "CART",
    },
  });
}

          return {
            order,
            paymentStatus:
              "PAID" as const,
            status:
              "PROCESSING" as const,
          };
        },
{
  isolationLevel:
    Prisma.TransactionIsolationLevel.Serializable,

  maxWait: 5000,

  timeout: 15000,
},
      );

try {
  const result =
    await execute();

  if (
    result.order.paymentMethod ===
    "WALLET"
  ) {
    try {
      await prisma.notification.create({
        data: {
          userId,

          type: "SYSTEM",

          title:
            "Order Confirmed",

          message:
            `Your order ${result.order.orderNumber} has been paid successfully and is now being processed.`,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create order confirmation notification:",
        notificationError,
      );
    }
  }

  return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      const retryResult =
        await execute();

      if (
        retryResult.order.paymentMethod ===
        "WALLET"
      ) {
        try {
          await prisma.notification.create({
            data: {
              userId,

              type: "SYSTEM",

              title:
                "Order Confirmed",

              message:
                `Your order ${retryResult.order.orderNumber} has been paid successfully and is now being processed.`,
            },
          });
        } catch (notificationError) {
          console.error(
            "Failed to create order confirmation notification:",
            notificationError,
          );
        }
      }

      return retryResult;
    }

    throw error;
  }
}



type CancelOrderActor =
  | {
      type: "USER";
      userId: string;
    }
  | {
      type: "ADMIN";
      adminId: string;
    };

export async function cancelOrderService(
  orderId: string,
  actor: CancelOrderActor,
) {
  const execute = async () =>
    prisma.$transaction(
      async (tx) => {
        const order =
          await tx.order.findUnique({
            where: {
              id: orderId,
            },

            include: {
              items: true,
            },
          });

        if (!order) {
          throw new Error(
            "ORDER_NOT_FOUND",
          );
        }

        /*
         * Ownership is always checked server-side.
         */
        if (
          actor.type === "USER" &&
          order.userId !== actor.userId
        ) {
          throw new Error(
            "ORDER_NOT_FOUND",
          );
        }

        /*
         * Already cancelled orders are idempotent.
         *
         * This prevents a repeated request from creating
         * another wallet credit or reversing inventory twice.
         */
        if (
          order.status ===
          OrderStatus.CANCELLED
        ) {
          return {
            order,
            alreadyCancelled: true,
            walletCredited:
              order.walletReversalTransactionId !==
              null,
          };
        }

        /*
         * Delivered orders can never be cancelled.
         * Refund will be handled separately later.
         */
        if (
          order.status ===
          OrderStatus.DELIVERED
        ) {
          throw new Error(
            "ORDER_ALREADY_DELIVERED",
          );
        }

        /*
         * User cancellation rules:
         *
         * - Only PENDING or PROCESSING
         * - Must be within 2 hours
         *
         * Admin cancellation has no time restriction
         * and can proceed from any non-delivered status.
         */
        if (actor.type === "USER") {
          if (
            order.status !==
              OrderStatus.PENDING &&
            order.status !==
              OrderStatus.PROCESSING
          ) {
            throw new Error(
              "ORDER_CANCELLATION_NOT_ALLOWED",
            );
          }

          const cancellationDeadline =
            order.createdAt.getTime() +
            2 * 60 * 60 * 1000;

          if (
            Date.now() >=
            cancellationDeadline
          ) {
            throw new Error(
              "ORDER_CANCELLATION_WINDOW_EXPIRED",
            );
          }
        }

        /*
         * Reverse inventory using the exact allocation
         * recorded on each OrderItem.
         *
         * Legacy orders created before this allocation
         * tracking was introduced have 0/0 and therefore
         * cannot safely have their historical allocation
         * reconstructed.
         */
        for (const item of order.items) {
          if (
            item.stockQuantity === 0 &&
            item.preorderQuantity === 0
          ) {
            continue;
          }

          if (
            item.stockQuantity <
              0 ||
            item.preorderQuantity <
              0 ||
            item.stockQuantity +
              item.preorderQuantity !==
              item.quantity
          ) {
            throw new Error(
              "INVALID_ORDER_INVENTORY_ALLOCATION",
            );
          }

          if (!item.variantSizeId) {
            throw new Error(
              "INVENTORY_NOT_FOUND",
            );
          }

          const inventory =
            await tx.productVariantSize.findUnique({
              where: {
                id:
                  item.variantSizeId,
              },

              select: {
                id: true,
                reservedStock: true,
              },
            });

          if (!inventory) {
            throw new Error(
              "INVENTORY_NOT_FOUND",
            );
          }

          if (
            inventory.reservedStock <
            item.preorderQuantity
          ) {
            throw new Error(
              "INVENTORY_REVERSAL_CONFLICT",
            );
          }

          await tx.productVariantSize.update({
            where: {
              id: inventory.id,
            },

            data: {
              ...(item.stockQuantity >
              0
                ? {
                    stock: {
                      increment:
                        item.stockQuantity,
                    },
                  }
                : {}),

              ...(item.preorderQuantity >
              0
                ? {
                    reservedStock: {
                      decrement:
                        item.preorderQuantity,
                    },
                  }
                : {}),
            },
          });
        }

        /*
         * Only paid orders receive a wallet credit.
         *
         * The credit is exactly order.total.
         */
        let walletTransactionId:
          | string
          | null = null;

        if (
          order.paymentStatus ===
          "PAID"
        ) {
          const wallet =
            await tx.wallet.findUnique({
              where: {
                userId:
                  order.userId,
              },

              select: {
                id: true,
                availableBalance:
                  true,
              },
            });

          if (!wallet) {
            throw new Error(
              "WALLET_NOT_FOUND",
            );
          }

          const balanceBefore =
            wallet.availableBalance;

          const balanceAfter =
            balanceBefore.plus(
              order.total,
            );

          const walletTransaction =
            await tx.walletTransaction.create({
              data: {
                walletId:
                  wallet.id,

                userId:
                  order.userId,

                adminId:
                  actor.type === "ADMIN"
                    ? actor.adminId
                    : null,

                type: "CREDIT",

                amount:
                  order.total,

                balanceBefore,

                balanceAfter,

                description:
                  `Order ${order.orderNumber} cancellation credit`,
              },
            });

          walletTransactionId =
            walletTransaction.id;

          await tx.wallet.update({
            where: {
              id: wallet.id,
            },

            data: {
              availableBalance:
                balanceAfter,
            },
          });
        }

        const updatedOrder =
          await tx.order.update({
            where: {
              id: order.id,
            },

            data: {
              status:
                OrderStatus.CANCELLED,

              ...(walletTransactionId
                ? {
                    walletReversalTransactionId:
                      walletTransactionId,
                  }
                : {}),
            },

            include: {
              items: true,
            },
          });

        return {
          order: updatedOrder,
          alreadyCancelled: false,
          walletCredited:
            walletTransactionId !== null,
        };
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,

        maxWait: 5000,

        timeout: 15000,
      },
    );

  try {
    return await execute();
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return await execute();
    }

    throw error;
  }
}


export async function createOrderService(
  input: CreateOrderInput,
) {
  return createOrder(input);
}

export async function getOrderService(
  id: string,
) {
  return getOrderById(id);
}

export async function getOrderByNumberService(
  orderNumber: string,
) {
  return getOrderByNumber(
    orderNumber,
  );
}

export async function listOrdersService(
  filters: OrderFilters = {},
) {
  return getOrders(filters);
}

export async function updateOrderService(
  id: string,
  input: UpdateOrderInput,
) {
  return updateOrder(
    id,
    input,
  );
}

export async function updateOrderStatusService(
  id: string,
  status: OrderStatus,
) {
  return updateOrderStatus(
    id,
    status,
  );
}

export async function updatePaymentStatusService(
  id: string,
  paymentStatus: OrderPaymentStatus,
) {
  return updatePaymentStatus(
    id,
    paymentStatus,
  );
}

export async function attachWalletTransactionService(
  orderId: string,
  walletTransactionId: string,
) {
  return attachWalletTransaction(
    orderId,
    walletTransactionId,
  );
}

export async function attachCryptoDepositService(
  orderId: string,
  cryptoDepositId: string,
) {
  return attachCryptoDeposit(
    orderId,
    cryptoDepositId,
  );
}

export async function deleteOrderService(
  id: string,
) {
  return deleteOrder(id);
}