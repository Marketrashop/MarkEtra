"use client";

import {
  Check,
  Copy,
  FileCheck2,
  Loader2,
  Upload,
} from "lucide-react";

import Image from "next/image";

import { useRef, useState } from "react";

import type {
  DepositMethod,
} from "@/components/Deposit/deposit.types";

type CheckoutCryptoPaymentProps = {
  methods: DepositMethod[];

  selectedMethodId:
    | string
    | null;

  onMethodChange: (
    methodId: string,
  ) => void;

  receiptFile:
    | File
    | null;

  receiptUrl:
    | string
    | null;

  uploadingReceipt: boolean;

  onReceiptUpload: (
    file: File,
  ) => Promise<void>;

  total: number;
};

export default function CheckoutCryptoPayment({
  methods,
  selectedMethodId,
  onMethodChange,
  receiptFile,
  receiptUrl,
  uploadingReceipt,
  onReceiptUpload,
  total,
}: CheckoutCryptoPaymentProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    copied,
    setCopied,
  ] = useState(false);

  const selectedMethod =
    methods.find(
      (method) =>
        method.id ===
        selectedMethodId,
    ) ?? null;

  const formattedTotal =
    total.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  async function handleCopy() {
    if (
      !selectedMethod
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        selectedMethod.address,
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1800,
      );
    } catch {
      setCopied(false);
    }
  }

  function handleFileChange(
    file?: File,
  ) {
    if (!file) {
      return;
    }

    void onReceiptUpload(
      file,
    );
  }

  return (
    <div
      className="
        mt-3
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-stat-bg)]
        p-3
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              text-[var(--user-title)]
            "
          >
            Crypto payment
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              text-[var(--user-text-muted)]
            "
          >
            Send the exact order amount and upload
            the payment receipt.
          </p>
        </div>

        <span
          className="
            shrink-0
            rounded-full
            border
            border-[var(--user-card-border)]
            px-2.5
            py-1
            text-[10px]
            font-medium
            text-[var(--user-text-muted)]
          "
        >
          ${formattedTotal}
        </span>
      </div>

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-2
        "
      >
        {methods.length === 0 ? (
          <div
            className="
              w-full
              rounded-lg
              border
              border-[var(--user-card-border)]
              px-3
              py-2.5
              text-xs
              text-[var(--user-text-muted)]
            "
          >
            No crypto payment methods are
            currently available.
          </div>
        ) : (
          methods.map(
            (method) => {
              const selected =
                method.id ===
                selectedMethodId;

              return (
                <button
                  key={method.id}
                  type="button"
                  aria-pressed={
                    selected
                  }
                  onClick={() =>
                    onMethodChange(
                      method.id,
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    px-3
                    py-2
                    transition
                    ${
                      selected
                        ? "border-[var(--primary)] bg-[var(--surface-card)]"
                        : "border-[var(--user-card-border)] bg-[var(--user-card-bg)] hover:border-[var(--primary)]"
                    }
                  `}
                >
                  {method.icon ? (
                    <Image
                      src={method.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="
                        h-[18px]
                        w-[18px]
                        rounded-full
                        object-contain
                      "
                    />
                  ) : (
                    <span
                      className="
                        flex
                        h-[18px]
                        w-[18px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--user-text-muted)]
                        text-[8px]
                        font-bold
                        text-[var(--user-card-bg)]
                      "
                    >
                      {method.symbol
                        .slice(
                          0,
                          1,
                        )
                        .toUpperCase()}
                    </span>
                  )}

                  <span
                    className="
                      text-xs
                      font-medium
                      text-[var(--user-title)]
                    "
                  >
                    {method.symbol}
                  </span>

                  {selected && (
                    <Check
                      size={14}
                      className="
                        text-[var(--primary)]
                      "
                    />
                  )}
                </button>
              );
            },
          )
        )}
      </div>

      {selectedMethod && (
        <div
          className="
            mt-3
            grid
            gap-3
            sm:grid-cols-[minmax(0,1fr)_136px]
            sm:items-start
          "
        >
          <div
            className="
              min-w-0
              rounded-lg
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2.5
              "
            >
              {selectedMethod.icon && (
                <Image
                  src={
                    selectedMethod.icon
                  }
                  alt=""
                  width={28}
                  height={28}
                  className="
                    h-7
                    w-7
                    shrink-0
                    rounded-full
                    object-contain
                  "
                />
              )}

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-xs
                    font-semibold
                    text-[var(--user-title)]
                  "
                >
                  {
                    selectedMethod.name
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-[var(--user-text-muted)]
                  "
                >
                  {selectedMethod.symbol}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-[var(--user-text-muted)]
                "
              >
                Payment address
              </p>

              <div
                className="
                  mt-1.5
                  flex
                  min-w-0
                "
              >
                <div
                  className="
                    min-w-0
                    flex-1
                    break-all
                    rounded-l-lg
                    border
                    border-r-0
                    border-[var(--user-card-border)]
                    bg-[var(--user-stat-bg)]
                    px-3
                    py-2
                    text-[11px]
                    leading-5
                    text-[var(--user-title)]
                  "
                >
                  {
                    selectedMethod.address
                  }
                </div>

                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  aria-label={
                    copied
                      ? "Address copied"
                      : "Copy payment address"
                  }
                  className={`
                    flex
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-r-lg
                    border
                    border-[var(--user-card-border)]
                    transition
                    ${
                      copied
                        ? "text-[var(--user-badge-success-text)]"
                        : "text-[var(--user-text-muted)] hover:text-[var(--primary)]"
                    }
                  `}
                >
                  {copied ? (
                    <Check
                      size={14}
                    />
                  ) : (
                    <Copy
                      size={14}
                    />
                  )}
                </button>
              </div>

              <p
                className="
                  mt-2
                  text-[10px]
                  leading-4
                  text-[var(--user-text-muted)]
                "
              >
                Send only{" "}
                <span className="font-medium">
                  {
                    selectedMethod.symbol
                  }
                </span>{" "}
                to this address.
              </p>
            </div>

            <div
              className="
                mt-3
                rounded-lg
                border
                border-[var(--user-card-border)]
                bg-[var(--user-stat-bg)]
                px-3
                py-2
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-[var(--user-text-muted)]
                "
              >
                Receipt
              </p>

              <button
                type="button"
                disabled={
                  uploadingReceipt
                }
                onClick={() =>
                  inputRef.current?.click()
                }
                className="
                  mt-2
                  flex
                  w-full
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-dashed
                  border-[var(--user-card-border)]
                  px-3
                  py-2.5
                  text-left
                  transition
                  hover:border-[var(--primary)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-[var(--surface-card)]
                    text-[var(--primary)]
                  "
                >
                  {uploadingReceipt ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : receiptUrl ? (
                    <FileCheck2
                      size={14}
                    />
                  ) : (
                    <Upload
                      size={14}
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="
                      block
                      truncate
                      text-[11px]
                      font-medium
                      text-[var(--user-title)]
                    "
                  >
                    {receiptFile
                      ? receiptFile.name
                      : "Upload payment receipt"}
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[10px]
                      text-[var(--user-text-muted)]
                    "
                  >
                    PNG, JPG, JPEG or PDF
                  </span>
                </span>
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="
                  image/png,
                  image/jpeg,
                  application/pdf
                "
                hidden
                disabled={
                  uploadingReceipt
                }
                onChange={(
                  event,
                ) => {
                  const file =
                    event.target
                      .files?.[0];

                  event.target.value =
                    "";

                  handleFileChange(
                    file,
                  );
                }}
              />

              <div
                className={`
                  mt-2
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  ${
                    receiptUrl
                      ? "text-[var(--user-badge-success-text)]"
                      : "text-[var(--user-text-muted)]"
                  }
                `}
              >
                {receiptUrl ? (
                  <>
                    <Check
                      size={12}
                    />
                    Receipt uploaded successfully.
                  </>
                ) : (
                  "Upload a receipt after sending the payment."
                )}
              </div>
            </div>
          </div>

          {selectedMethod.qrCode && (
            <div
              className="
                flex
                justify-center
                rounded-lg
                border
                border-[var(--user-card-border)]
                bg-[var(--user-card-bg)]
                p-2
              "
            >
              <Image
                src={
                  selectedMethod.qrCode
                }
                alt={`${selectedMethod.name} payment QR code`}
                width={128}
                height={128}
                className="
                  h-32
                  w-32
                  rounded-md
                  object-contain
                "
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}