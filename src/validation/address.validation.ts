import { z } from "zod";

const optionalNullableString = (
  max: number,
) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional();

export const createAddressSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name is required.",
      )
      .max(200),

    phoneNumber: z
      .string()
      .trim()
      .min(
        7,
        "Phone number is invalid.",
      )
      .max(20),

    alternatePhoneNumber:
      optionalNullableString(
        20,
      ),

    addressLine1: z
      .string()
      .trim()
      .min(
        3,
        "Address is required.",
      )
      .max(255),

    addressLine2:
      optionalNullableString(
        255,
      ),

    city: z
      .string()
      .trim()
      .min(
        2,
        "City is required.",
      )
      .max(100),

    state:
      optionalNullableString(
        100,
      ),

    country: z
      .string()
      .trim()
      .min(
        2,
        "Country is required.",
      )
      .max(100),

    postalCode:
      optionalNullableString(
        20,
      ),

    label:
      optionalNullableString(
        50,
      ),

    isPrimary:
      z.boolean().optional(),
  });

export const updateAddressSchema =
  createAddressSchema.partial();

export type CreateAddressSchema =
  z.infer<
    typeof createAddressSchema
  >;

export type UpdateAddressSchema =
  z.infer<
    typeof updateAddressSchema
  >;