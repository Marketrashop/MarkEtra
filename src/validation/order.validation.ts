import {
  OrderStatus,
  OrderPaymentStatus,
  PaymentMethod,
} from "../../generated/prisma/client";

import { z } from "zod";

const orderNotesSchema = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .or(z.literal(""));

export const createOrderSchema =
  z.discriminatedUnion(
    "paymentMethod",
    [
      z.object({
        paymentMethod:
          z.literal(
            PaymentMethod.WALLET,
          ),

        notes:
          orderNotesSchema,
      }),

      z.object({
        paymentMethod:
          z.literal(
            PaymentMethod.CRYPTO,
          ),

        depositMethodId:
          z
            .string()
            .uuid(
              "Invalid deposit method.",
            ),

        receiptUrl:
          z
            .string()
            .url(
              "Invalid receipt URL.",
            ),

        notes:
          orderNotesSchema,
      }),
    ],
  );

export const updateOrderStatusSchema =
  z.object({
    status:
      z.nativeEnum(
        OrderStatus,
      ),
  });

export const updatePaymentStatusSchema =
  z.object({
    paymentStatus:
      z.nativeEnum(
        OrderPaymentStatus,
      ),
  });

export const orderFiltersSchema =
  z.object({
    status:
      z
        .nativeEnum(
          OrderStatus,
        )
        .optional(),

    paymentStatus:
      z
        .nativeEnum(
          OrderPaymentStatus,
        )
        .optional(),

    paymentMethod:
      z
        .nativeEnum(
          PaymentMethod,
        )
        .optional(),

    search:
      z
        .string()
        .trim()
        .optional(),

    page:
      z
        .number()
        .int()
        .min(1)
        .default(1),

    pageSize:
      z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
  });

export type CreateOrderSchema =
  z.infer<
    typeof createOrderSchema
  >;

export type UpdateOrderStatusSchema =
  z.infer<
    typeof updateOrderStatusSchema
  >;

export type UpdatePaymentStatusSchema =
  z.infer<
    typeof updatePaymentStatusSchema
  >;

export type OrderFiltersSchema =
  z.infer<
    typeof orderFiltersSchema
  >;