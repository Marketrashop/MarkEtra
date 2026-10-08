import { z } from "zod";

export const kycDocumentTypes = [
  "NATIONAL_ID",
  "PASSPORT",
  "DRIVERS_LICENSE",
] as const;

export const kycSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name is required."
      )
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name is required."
      )
      .max(100),

    dateOfBirth: z
      .string()
      .min(
        1,
        "Date of birth is required."
      ),

    nationality: z
      .string()
      .trim()
      .min(
        2,
        "Nationality is required."
      )
      .max(100),

    residentialAddress: z
      .string()
      .trim()
      .min(
        5,
        "Residential address is required."
      )
      .max(255),

    city: z
      .string()
      .trim()
      .min(
        2,
        "City is required."
      )
      .max(100),

    state: z
      .string()
      .trim()
      .min(
        2,
        "State or province is required."
      )
      .max(100),

    postalCode: z
      .string()
      .trim()
      .min(
        2,
        "Postal code is required."
      )
      .max(30),

    country: z
      .string()
      .trim()
      .min(
        2,
        "Country is required."
      )
      .max(100),

    documentType: z.enum(
      kycDocumentTypes
    ),

    frontDocumentKey: z
      .string()
      .min(
        1,
        "Front document image is required."
      ),

    backDocumentKey: z
      .string()
      .optional(),

    selfieKey: z
      .string()
      .min(
        1,
        "Selfie image is required."
      ),
  })
  .superRefine(
    (data, ctx) => {
      if (
        data.documentType !==
          "PASSPORT" &&
        !data.backDocumentKey
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "backDocumentKey",
          ],

          message:
            "Back document image is required.",
        });
      }
    }
  );

export type KycFormValues =
  z.infer<typeof kycSchema>;