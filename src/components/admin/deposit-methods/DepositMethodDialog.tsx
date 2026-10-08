"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  Upload,
  X,
} from "lucide-react";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import type {
  DepositMethod,
} from "./types";

export type DepositMethodFormValues = {
  name: string;

  symbol: string;

  network: string;

  walletAddress: string;

  displayOrder: string;

  isActive: boolean;

  iconKey: string | null;

  qrCodeKey: string | null;
};

type DepositMethodDialogProps = {
  open: boolean;

  mode: "create" | "edit";

  method?: DepositMethod | null;

  submitting: boolean;

  onClose: () => void;

  onSubmit: (
    values: DepositMethodFormValues,
  ) => Promise<void>;
};

const EMPTY_FORM: DepositMethodFormValues = {
  name: "",
  symbol: "",
  network: "",
  walletAddress: "",
  displayOrder: "0",
  isActive: true,
  iconKey: null,
  qrCodeKey: null,
};

export default function DepositMethodDialog({
  open,
  mode,
  method,
  submitting,
  onClose,
  onSubmit,
}: DepositMethodDialogProps) {
  const [form, setForm] =
    useState<DepositMethodFormValues>(
      EMPTY_FORM,
    );

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [uploadingQr, setUploadingQr] =
    useState(false);

  const [qrUploadError, setQrUploadError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      mode === "edit" &&
      method
    ) {
      setForm({
        name: method.name,

        symbol: method.symbol,

        network: method.network,

        walletAddress:
          method.walletAddress,

        displayOrder:
          String(
            method.displayOrder,
          ),

        isActive:
          method.isActive,

        iconKey:
          method.iconKey ?? null,

        qrCodeKey:
          method.qrCodeKey ?? null,
      });

      return;
    }

    setForm(EMPTY_FORM);
  }, [
    open,
    mode,
    method,
  ]);

  const previewImage =
    useMemo(() => {
      return getCloudinaryImageUrl(
        form.iconKey,
      );
    }, [form.iconKey]);

  const previewQrCode =
    useMemo(() => {
      return getCloudinaryImageUrl(
        form.qrCodeKey,
      );
    }, [form.qrCodeKey]);

  function updateField<
    T extends keyof DepositMethodFormValues,
  >(
    key: T,
    value: DepositMethodFormValues[T],
  ) {
    setForm((previous) => ({
      ...previous,

      [key]: value,
    }));
  }

  async function handleUpload(
    file: File,
    field:
      | "iconKey"
      | "qrCodeKey",
  ) {
    try {
      setUploadError("");

      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      formData.append(
        "folder",
        "deposit-methods",
      );

      const response =
        await fetch(
          "/api/admin/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to upload image.",
        );
      }

      updateField(
        field,
        result.data.publicId,
      );

      setUploadError("");
    } catch {
      setUploadError(
        "Unable to upload image.",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleIconChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadError("");
      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      formData.append(
        "folder",
        "deposit-methods",
      );

      const response =
        await fetch(
          "/api/admin/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to upload icon.",
        );
      }

      updateField(
        "iconKey",
        result.data.publicId,
      );
    } catch {
      setUploadError(
        "Unable to upload icon.",
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  }

  async function handleQrCodeChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setQrUploadError("");
      setUploadingQr(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      formData.append(
        "folder",
        "deposit-methods",
      );

      const response =
        await fetch(
          "/api/admin/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to upload QR code.",
        );
      }

      updateField(
        "qrCodeKey",
        result.data.publicId,
      );
    } catch {
      setQrUploadError(
        "Unable to upload QR code.",
      );
    } finally {
      setUploadingQr(false);

      event.target.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit(form);
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-y-auto
        bg-black/50
        p-3
        backdrop-blur-sm
        sm:p-5
      "
    >
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            h-[92vh]
            w-full
            max-w-3xl
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            shadow-2xl
            sm:h-[90vh]
            sm:rounded-3xl
          "
        >
          <form
            onSubmit={handleSubmit}
            className="
              flex
              min-h-0
              flex-1
              flex-col
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-[var(--border)]
                px-4
                py-3
                sm:px-5
                sm:py-4
              "
            >
              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-base
                    font-semibold
                    sm:text-lg
                  "
                >
                  {mode === "create"
                    ? "Add Deposit Method"
                    : "Edit Deposit Method"}
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    leading-4
                    text-[var(--foreground-muted)]
                    sm:text-sm
                  "
                >
                  Configure how users can
                  fund their wallets.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  shrink-0
                  rounded-full
                  p-1.5
                  transition-colors
                  hover:bg-[var(--surface)]
                "
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
            >
              <div
                className="
                  grid
                  gap-3
                  p-4
                  md:grid-cols-2
                  sm:gap-4
                  sm:p-5
                "
              >
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                    "
                  >
                    Coin Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value,
                      )
                    }
                    required
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      text-sm
                      outline-none
                      focus:border-[var(--primary)]
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                    "
                  >
                    Symbol
                  </label>

                  <input
                    value={form.symbol}
                    onChange={(event) =>
                      updateField(
                        "symbol",
                        event.target.value.toUpperCase(),
                      )
                    }
                    required
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      text-sm
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                    "
                  >
                    Network
                  </label>

                  <input
                    value={form.network}
                    onChange={(event) =>
                      updateField(
                        "network",
                        event.target.value,
                      )
                    }
                    required
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      text-sm
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                    "
                  >
                    Wallet Address
                  </label>

                  <input
                    value={
                      form.walletAddress
                    }
                    onChange={(event) =>
                      updateField(
                        "walletAddress",
                        event.target.value,
                      )
                    }
                    required
                    className="
                      h-10
                      w-full
                      min-w-0
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      text-sm
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                    "
                  >
                    Display Order
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      form.displayOrder
                    }
                    onChange={(event) =>
                      updateField(
                        "displayOrder",
                        event.target.value,
                      )
                    }
                    required
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      text-sm
                      outline-none
                      focus:border-[var(--primary)]
                    "
                  />

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-4
                      text-[var(--foreground-muted)]
                    "
                  >
                    Lower numbers appear first.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div
                    className="
                      grid
                      gap-3
                      md:grid-cols-2
                      sm:gap-4
                    "
                  >
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-xs
                          font-medium
                        "
                      >
                        Coin Icon
                      </label>

                      <label
                        className="
                          flex
                          min-h-[150px]
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          rounded-xl
                          border-2
                          border-dashed
                          border-[var(--border)]
                          p-4
                          transition-colors
                          hover:border-[var(--primary)]
                          sm:min-h-[170px]
                        "
                      >
                        {previewImage ? (
                          <Image
                            src={
                              previewImage
                            }
                            alt="Coin Icon"
                            width={60}
                            height={60}
                            className="
                              h-14
                              w-14
                              rounded-full
                              object-cover
                            "
                          />
                        ) : (
                          <Upload
                            size={28}
                          />
                        )}

                        <span
                          className="
                            mt-2
                            text-xs
                            text-center
                            text-[var(--foreground-muted)]
                          "
                        >
                          {uploadingImage
                            ? "Uploading..."
                            : "Click to upload icon"}
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleIconChange
                          }
                          hidden
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-xs
                          font-medium
                        "
                      >
                        Deposit QR Code
                      </label>

                      <label
                        className="
                          flex
                          min-h-[150px]
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          rounded-xl
                          border-2
                          border-dashed
                          border-[var(--border)]
                          p-4
                          transition-colors
                          hover:border-[var(--primary)]
                          sm:min-h-[170px]
                        "
                      >
                        {previewQrCode ? (
                          <Image
                            src={
                              previewQrCode
                            }
                            alt="Deposit QR Code"
                            width={120}
                            height={120}
                            className="
                              h-[110px]
                              w-[110px]
                              rounded-lg
                              object-contain
                              sm:h-[120px]
                              sm:w-[120px]
                            "
                          />
                        ) : (
                          <Upload
                            size={28}
                          />
                        )}

                        <span
                          className="
                            mt-2
                            text-xs
                            text-center
                            text-[var(--foreground-muted)]
                          "
                        >
                          {uploadingQr
                            ? "Uploading..."
                            : "Click to upload QR code"}
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleQrCodeChange
                          }
                          hidden
                        />
                      </label>
                    </div>
                  </div>

                  {(uploadError ||
                    qrUploadError) && (
                    <p
                      className="
                        mt-2
                        text-xs
                        leading-4
                        text-red-500
                      "
                    >
                      {uploadError ||
                        qrUploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-[var(--border)]
                px-4
                py-3
                sm:px-5
                sm:py-3.5
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={
                  submitting ||
                  uploadingImage ||
                  uploadingQr
                }
                className="
                  h-9
                  rounded-lg
                  border
                  border-[var(--border)]
                  px-4
                  text-xs
                  transition-colors
                  hover:bg-[var(--surface)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  uploadingImage ||
                  uploadingQr
                }
                className="
                  h-9
                  rounded-lg
                  bg-[var(--primary)]
                  px-4
                  text-xs
                  font-medium
                  text-white
                  transition-opacity
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {submitting
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Method"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}