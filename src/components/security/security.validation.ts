import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(
        1,
        "Current password is required.",
      ),

    newPassword: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters.",
      )
      .max(
        128,
        "Password is too long.",
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter.",
      )
      .regex(
        /\d/,
        "Password must contain at least one number.",
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(
        1,
        "Please confirm your new password.",
      ),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: [
        "confirmPassword",
      ],
      message:
        "Passwords do not match.",
    },
  )
  .refine(
    (data) =>
      data.currentPassword !==
      data.newPassword,
    {
      path: [
        "newPassword",
      ],
      message:
        "Your new password must be different from your current password.",
    },
  );

export type ChangePasswordValues =
  z.infer<
    typeof changePasswordSchema
  >;