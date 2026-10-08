import { z } from "zod";

import {
  PRODUCT_STATUSES,
} from "@/constants/product-status";

export const PRODUCT_VARIANT_TYPES = [
  "DEFAULT",
  "COLOR",
  "STORAGE",
  "MATERIAL",
  "PACK_SIZE",
  "STYLE",
  "OTHER",
] as const;

export type ProductVariantType =
  (typeof PRODUCT_VARIANT_TYPES)[number];

export const productImageSchema =
  z.object({
    imageKey: z
      .string()
      .trim()
      .min(
        1,
        "Product image is required.",
      ),

    altText: z
      .string()
      .trim()
      .max(255)
      .optional()
      .or(z.literal("")),

    isPrimary: z
      .boolean()
      .default(false),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  });

export const productVariantImageSchema =
  z.object({
    id: z
      .string()
      .cuid()
      .optional(),

    imageKey: z
      .string()
      .trim()
      .min(
        1,
        "Variant image is required.",
      ),

    altText: z
      .string()
      .trim()
      .max(255)
      .optional()
      .or(z.literal("")),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .default(0),

    isPrimary: z
      .boolean()
      .default(false),
  });

export const productVariantSizeSchema =
  z.object({
    id: z
      .string()
      .cuid()
      .optional(),

    size: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    sku: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    price: z
      .number()
      .nonnegative()
      .nullable()
      .optional(),

    stock: z
      .number()
      .int()
      .min(
        0,
        "Stock cannot be negative.",
      ),

    reservedStock: z
      .number()
      .int()
      .min(0)
      .default(0),

    incomingStock: z
      .number()
      .int()
      .min(0)
      .default(0),

    allowPreorder: z
      .boolean()
      .default(false),
  });

export const productVariantSchema =
  z.object({
    id: z
      .string()
      .cuid()
      .optional(),

    type: z.enum(
      PRODUCT_VARIANT_TYPES,
    ),

    label: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    images: z
      .array(
        productVariantImageSchema,
      )
      .max(
        4,
        "A variant can have a maximum of 4 images.",
      )
      .default([]),

    sizes: z
      .array(
        productVariantSizeSchema,
      )
      .min(
        1,
        "At least one inventory option is required.",
      ),
  });

export const productSpecificationSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Specification name is required.",
      )
      .max(100),

    value: z
      .string()
      .trim()
      .min(
        1,
        "Specification value is required.",
      )
      .max(500),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  });

export const productReviewSchema =
  z.object({
    customerName: z
      .string()
      .trim()
      .min(
        2,
        "Customer name is required.",
      )
      .max(100),

    rating: z
      .number()
      .int()
      .min(
        1,
        "Rating must be at least 1.",
      )
      .max(
        5,
        "Rating cannot exceed 5.",
      ),

    title: z
      .string()
      .trim()
      .max(255)
      .optional()
      .or(z.literal("")),

    comment: z
      .string()
      .trim()
      .min(
        5,
        "Review is required.",
      )
      .max(5000),

    verifiedPurchase: z
      .boolean()
      .default(false),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  });

export const createProductSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Product name is required.",
      )
      .max(200),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Slug is required.",
      )
      .max(200)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens.",
      ),

    description: z
      .string()
      .trim()
      .min(
        10,
        "Description is required.",
      ),

    sku: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    price: z
      .number()
      .nonnegative(),

    compareAtPrice: z
      .number()
      .nonnegative()
      .nullable()
      .optional(),

    initialRating: z
      .number()
      .min(
        0,
        "Rating cannot be below 0.",
      )
      .max(
        5,
        "Rating cannot exceed 5.",
      )
      .default(0),

    featured: z
      .boolean()
      .default(false),

    status: z
      .enum(PRODUCT_STATUSES)
      .default("DRAFT"),

    metaTitle: z
      .string()
      .trim()
      .max(255)
      .optional()
      .or(z.literal("")),

    metaDescription: z
      .string()
      .trim()
      .max(500)
      .optional()
      .or(z.literal("")),

categoryIds: z
  .array(
    z.string().min(1),
  )
  .min(
    1,
    "Select at least one category.",
  ),

    images: z
      .array(productImageSchema)
      .min(
        1,
        "At least one product image is required.",
      ),

    variants: z
      .array(
        productVariantSchema,
      )
      .default([]),

    specifications: z
      .array(
        productSpecificationSchema,
      )
      .default([]),

    reviews: z
      .array(
        productReviewSchema,
      )
      .default([]),
  });

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput =
  z.input<
    typeof createProductSchema
  >;

export type CreateProductSchema =
  z.output<
    typeof createProductSchema
  >;

export type UpdateProductInput =
  z.input<
    typeof updateProductSchema
  >;

export type UpdateProductSchema =
  z.output<
    typeof updateProductSchema
  >;

export type ProductImageInput =
  z.input<
    typeof productImageSchema
  >;

export type ProductImageSchema =
  z.output<
    typeof productImageSchema
  >;

export type ProductVariantImageInput =
  z.input<
    typeof productVariantImageSchema
  >;

export type ProductVariantImageSchema =
  z.output<
    typeof productVariantImageSchema
  >;

export type ProductVariantInput =
  z.input<
    typeof productVariantSchema
  >;

export type ProductVariantSchema =
  z.output<
    typeof productVariantSchema
  >;

export type ProductVariantSizeInput =
  z.input<
    typeof productVariantSizeSchema
  >;

export type ProductVariantSizeSchema =
  z.output<
    typeof productVariantSizeSchema
  >;

export type ProductSpecificationInput =
  z.input<
    typeof productSpecificationSchema
  >;

export type ProductSpecificationSchema =
  z.output<
    typeof productSpecificationSchema
  >;

export type ProductReviewInput =
  z.input<
    typeof productReviewSchema
  >;

export type ProductReviewSchema =
  z.output<
    typeof productReviewSchema
  >;