"use client";

import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

import ImageUploader from "./ImageUploader";

import type {
  KycFormValues,
} from "./kyc.validation";

type IdentityDocumentSectionProps = {
  register: UseFormRegister<KycFormValues>;

  watch: UseFormWatch<KycFormValues>;

  errors: FieldErrors<KycFormValues>;

  frontPreview: string | null;

  backPreview: string | null;

  frontLoading: boolean;

  backLoading: boolean;

  onFrontSelect: (
    file: File
  ) => Promise<void>;

  onBackSelect: (
    file: File
  ) => Promise<void>;

  onRemoveFront: () => void;

  onRemoveBack: () => void;
};

export default function IdentityDocumentSection({
  register,
  watch,
  errors,
  frontPreview,
  backPreview,
  frontLoading,
  backLoading,
  onFrontSelect,
  onBackSelect,
  onRemoveFront,
  onRemoveBack,
}: IdentityDocumentSectionProps) {
  const documentType =
    watch("documentType");

  return (
    <section
      className="
        rounded-[var(--user-radius-lg)]
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-3
        sm:p-6
      "
    >
      <div
        className="
          mb-4
          sm:mb-6
        "
      >
        <h2
          className="
            text-[15px]
            font-semibold
            text-[var(--user-title)]
            sm:text-lg
          "
        >
          Identity Document
        </h2>

        <p
          className="
            mt-1
            text-[10px]
            leading-4
            text-[var(--user-text-muted)]
            sm:text-sm
            sm:leading-normal
          "
        >
          Select your identification document and upload clear,
          uncropped images.
        </p>
      </div>

      <div
        className="
          space-y-4
          pb-8
          sm:space-y-6
          sm:pb-16
        "
      >
        <div>
          <label
            className="
              mb-1.5
              block
              text-[10px]
              font-medium
              text-[var(--user-title)]
              sm:mb-2
              sm:text-sm
            "
          >
            Document Type
          </label>

          <select
            {...register(
              "documentType"
            )}
            className="
              h-9
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-select-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-select-text)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-3
              sm:text-base
            "
          >
            <option value="">
              Select document
            </option>

            <option value="NATIONAL_ID">
              National ID Card
            </option>

            <option value="PASSPORT">
              International Passport
            </option>

            <option value="DRIVERS_LICENSE">
              Driver's License
            </option>
          </select>

          {errors.documentType && (
            <p
              className="
                mt-1.5
                text-[9px]
                text-[var(--user-danger)]
                sm:mt-2
                sm:text-xs
              "
            >
              {
                errors.documentType
                  .message
              }
            </p>
          )}
        </div>

        <ImageUploader
          label="Front Image"
          description="Upload the front of your document."
          required
          preview={frontPreview}
          loading={frontLoading}
          onSelect={
            onFrontSelect
          }
          onRemove={
            onRemoveFront
          }
        />

        {documentType !==
          "PASSPORT" && (
          <ImageUploader
            label="Back Image"
            description="Upload the back of your document."
            required
            preview={backPreview}
            loading={backLoading}
            onSelect={
              onBackSelect
            }
            onRemove={
              onRemoveBack
            }
          />
        )}
      </div>
    </section>
  );
}