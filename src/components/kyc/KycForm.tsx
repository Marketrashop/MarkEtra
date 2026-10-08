"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

import PersonalInformationSection from "./PersonalInformationSection";
import IdentityDocumentSection from "./IdentityDocumentSection";
import SelfieVerificationSection from "./SelfieVerificationSection";

import {
  uploadKycImage,
  submitKyc,
} from "./kyc.service";

import {
  kycSchema,
  type KycFormValues,
} from "./kyc.validation";

import { useRouter } from "next/navigation";

export default function KycForm() {
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      residentialAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      documentType: "NATIONAL_ID",

      frontDocumentKey: "",
      backDocumentKey: "",
      selfieKey: "",
    },
  });

  const [
    frontPreview,
    setFrontPreview,
  ] = useState<string | null>(null);

  const [
    backPreview,
    setBackPreview,
  ] = useState<string | null>(null);

  const [
    selfiePreview,
    setSelfiePreview,
  ] = useState<string | null>(null);

  const [
    frontLoading,
    setFrontLoading,
  ] = useState(false);

  const [
    backLoading,
    setBackLoading,
  ] = useState(false);

  const [
    selfieLoading,
    setSelfieLoading,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const router = useRouter();

  async function handleFrontSelect(
    file: File,
  ) {
    try {
      setFrontLoading(true);

      const upload =
        await uploadKycImage(file);

      setValue(
        "frontDocumentKey",
        upload.key,
        {
          shouldValidate: true,
        },
      );

      setFrontPreview(
        URL.createObjectURL(file),
      );

      toast.success(
        "Front document uploaded.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload front document.",
      );
    } finally {
      setFrontLoading(false);
    }
  }

  async function handleBackSelect(
    file: File,
  ) {
    try {
      setBackLoading(true);

      const upload =
        await uploadKycImage(file);

      setValue(
        "backDocumentKey",
        upload.key,
        {
          shouldValidate: true,
        },
      );

      setBackPreview(
        URL.createObjectURL(file),
      );

      toast.success(
        "Back document uploaded.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload back document.",
      );
    } finally {
      setBackLoading(false);
    }
  }

  async function handleSelfieSelect(
    file: File,
  ) {
    try {
      setSelfieLoading(true);

      const upload =
        await uploadKycImage(file);

      setValue(
        "selfieKey",
        upload.key,
        {
          shouldValidate: true,
        },
      );

      setSelfiePreview(
        URL.createObjectURL(file),
      );

      toast.success(
        "Selfie uploaded.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload selfie.",
      );
    } finally {
      setSelfieLoading(false);
    }
  }

  async function onSubmit(
    values: KycFormValues,
  ) {
    try {
      setLoading(true);

      await submitKyc(values);

      toast.success(
        "KYC submitted successfully.",
      );

      router.replace("/kyc");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit KYC.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        space-y-3
        sm:space-y-5
      "
    >
      <PersonalInformationSection
        register={register}
        control={control}
        errors={errors}
      />

      <IdentityDocumentSection
        register={register}
        watch={watch}
        errors={errors}
        frontPreview={frontPreview}
        backPreview={backPreview}
        frontLoading={frontLoading}
        backLoading={backLoading}
        onFrontSelect={handleFrontSelect}
        onBackSelect={handleBackSelect}
        onRemoveFront={() => {
          setFrontPreview(null);

          setValue(
            "frontDocumentKey",
            "",
            {
              shouldValidate: true,
            },
          );
        }}
        onRemoveBack={() => {
          setBackPreview(null);

          setValue(
            "backDocumentKey",
            "",
            {
              shouldValidate: true,
            },
          );
        }}
      />

      <SelfieVerificationSection
        selfiePreview={selfiePreview}
        selfieLoading={selfieLoading}
        onSelfieSelect={
          handleSelfieSelect
        }
        onRemoveSelfie={() => {
          setSelfiePreview(null);

          setValue(
            "selfieKey",
            "",
            {
              shouldValidate: true,
            },
          );
        }}
      />

      <button
        type="submit"
        disabled={
          loading ||
          frontLoading ||
          backLoading ||
          selfieLoading
        }
        className="
          h-9
          w-full
          rounded-lg
          bg-[var(--user-button-bg)]
          px-3
          text-[11px]
          font-semibold
          text-[var(--user-button-text)]
          transition-colors
          duration-[var(--user-transition)]
          hover:bg-[var(--user-button-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-auto
          sm:rounded-xl
          sm:px-4
          sm:py-2.5
          sm:text-sm
        "
      >
        {loading
          ? "Submitting..."
          : "Submit KYC"}
      </button>
    </form>
  );
}