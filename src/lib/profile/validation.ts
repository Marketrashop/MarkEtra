import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters.")
      .max(100, "First name is too long."),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters.")
      .max(100, "Last name is too long."),

    phoneNumber: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number.")
      .max(20, "Phone number is too long."),

    secondaryPhoneNumber: z
      .string()
      .trim()
      .max(20, "Secondary phone number is too long.")
      .optional()
      .or(z.literal("")),

    country: z
      .string()
      .trim()
      .min(2, "Please select your country.")
      .max(100, "Country is too long."),

    avatarKey: z
      .string()
      .trim()
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const secondary = data.secondaryPhoneNumber?.trim();

    if (
      secondary &&
      secondary === data.phoneNumber.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondaryPhoneNumber"],
        message:
          "Secondary phone number must be different from your primary phone number.",
      });
    }
  });

export type ProfileInput = z.infer<
  typeof profileSchema
>;