import { z } from "zod";

const phoneRegex =
  /^\+?[1-9]\d{7,14}$/;

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name must contain at least 2 characters.",
      )
      .max(
        100,
        "First name cannot exceed 100 characters.",
      ),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name must contain at least 2 characters.",
      )
      .max(
        100,
        "Last name cannot exceed 100 characters.",
      ),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        phoneRegex,
        "Enter a valid phone number.",
      ),

    secondaryPhoneNumber: z
      .string()
      .trim()
      .regex(
        phoneRegex,
        "Enter a valid secondary phone number.",
      )
      .optional()
      .or(z.literal("")),

    country: z
      .string()
      .trim()
      .min(
        2,
        "Please select a country.",
      )
      .max(
        100,
        "Country name is too long.",
      ),
  })
  .superRefine(
    (data, context) => {
      if (
        data.secondaryPhoneNumber &&
        data.phoneNumber ===
          data.secondaryPhoneNumber
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "secondaryPhoneNumber",
          ],
          message:
            "Primary and secondary phone numbers cannot be the same.",
        });
      }
    },
  );

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) =>
        file.size <=
        5 * 1024 * 1024,
      {
        message:
          "Avatar must not exceed 5 MB.",
      },
    )
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type),
      {
        message:
          "Only JPG, PNG and WebP images are supported.",
      },
    ),
});

export const deleteAccountSchema =
  z.object({
    confirmation: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "DELETE",
        {
          message:
            'Type "DELETE" to continue.',
        },
      ),
  });

export type ProfileInput =
  z.infer<
    typeof profileSchema
  >;

export type AvatarInput =
  z.infer<
    typeof avatarSchema
  >;

export type DeleteAccountInput =
  z.infer<
    typeof deleteAccountSchema
  >;