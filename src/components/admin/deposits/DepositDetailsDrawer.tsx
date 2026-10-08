"use client";

import Image from "next/image";
import {
  Copy,
  Download,
  ExternalLink,
  File,
  FileText,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import type {
  Deposit,
} from "./types";

type DepositDetailsDrawerProps = {
  open: boolean;

  deposit: Deposit | null;

  onClose: () => void;

  onApprove: (
    deposit: Deposit,
  ) => void;

  onReject: (
    deposit: Deposit,
  ) => void;
};

export default function DepositDetailsDrawer({
  open,
  deposit,
  onClose,
  onApprove,
  onReject,
}: DepositDetailsDrawerProps) {
  if (!open || !deposit) {
    return null;
  }

  const currentDeposit = deposit;

  const receiptUrl =
    currentDeposit.receiptUrl
      ? getCloudinaryImageUrl(
          currentDeposit.receiptUrl,
        )
      : null;

  const receiptExtension =
    currentDeposit.receiptUrl
      ?.split(".")
      .pop()
      ?.toLowerCase() ?? "";

  const isImage =
    [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "avif",
    ].includes(
      receiptExtension,
    );

  const isPdf =
    receiptExtension ===
    "pdf";

  const fullName = [
    currentDeposit.user.firstName,
    currentDeposit.user.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(
        currentDeposit.reference,
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-[9998]
          bg-black/50
          backdrop-blur-sm
        "
      />

      <aside
        className="
          fixed
          right-0
          top-0
          z-[9999]
          flex
          h-screen
          w-full
          max-w-xl
          flex-col
          bg-[var(--background)]
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
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
                text-base
                font-semibold
                sm:text-lg
              "
            >
              Deposit Details
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                leading-4
                text-[var(--foreground-muted)]
                sm:mt-1
                sm:text-sm
              "
            >
              Review this deposit before taking action.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              ml-3
              shrink-0
              rounded-full
              p-1.5
              transition-colors
              hover:bg-[var(--surface)]
              sm:p-2
            "
          >
            <X
              size={18}
              className="sm:h-5 sm:w-5"
            />
          </button>
        </div>

        <div
          className="
            flex-1
            space-y-4
            overflow-y-auto
            p-4
            sm:space-y-5
            sm:p-5
          "
        >
          <Section title="User">
            <InfoRow
              label="Name"
              value={fullName}
            />

            <InfoRow
              label="Email"
              value={currentDeposit.user.email}
            />
          </Section>

          <Section title="Deposit">
            <InfoRow
              label="Amount"
              value={`$${Number(
                currentDeposit.amount,
              ).toLocaleString()}`}
            />

            <InfoRow
              label="Coin"
              value={`${currentDeposit.depositMethod.name} (${currentDeposit.depositMethod.symbol})`}
            />

            <InfoRow
              label="Network"
              value={
                currentDeposit.depositMethod.network
              }
            />

            <InfoRow
              label="Reference"
              value={
                <button
                  type="button"
                  onClick={
                    copyReference
                  }
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-1.5
                    text-left
                    text-[var(--primary)]
                  "
                >
                  <span className="break-all">
                    {currentDeposit.reference}
                  </span>

                  <Copy
                    size={13}
                    className="shrink-0"
                  />
                </button>
              }
            />

            <InfoRow
              label="Submitted"
              value={new Date(
                currentDeposit.createdAt,
              ).toLocaleString()}
            />
          </Section>

          <Section title="Receipt">
            {!receiptUrl ? (
              <div
                className="
                  rounded-lg
                  border
                  border-dashed
                  border-[var(--border)]
                  p-5
                  text-center
                  text-xs
                  text-[var(--foreground-muted)]
                  sm:rounded-xl
                  sm:p-6
                  sm:text-sm
                "
              >
                No receipt uploaded.
              </div>
            ) : isImage ? (
              <>
                <Image
                  src={receiptUrl}
                  alt="Receipt"
                  width={800}
                  height={800}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--border)]
                    sm:rounded-2xl
                  "
                />

                <div
                  className="
                    mt-2.5
                    flex
                    gap-2
                    sm:mt-3
                    sm:gap-3
                  "
                >
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                    >
                      <ExternalLink
                        size={15}
                      />

                      Open
                    </Button>
                  </a>

                  <a
                    href={receiptUrl}
                    download
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      className="w-full"
                    >
                      <Download
                        size={15}
                      />

                      Download
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              <div
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  p-4
                  sm:rounded-2xl
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  {isPdf ? (
                    <FileText
                      size={34}
                      className="shrink-0 sm:h-[38px] sm:w-[38px]"
                    />
                  ) : (
                    <File
                      size={34}
                      className="shrink-0 sm:h-[38px] sm:w-[38px]"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {isPdf
                        ? "PDF Receipt"
                        : "Receipt File"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-4
                        text-[var(--foreground-muted)]
                        sm:text-sm
                      "
                    >
                      Open or download the uploaded receipt.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    gap-2
                    sm:mt-4
                    sm:gap-3
                  "
                >
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                    >
                      <ExternalLink
                        size={15}
                      />

                      Open
                    </Button>
                  </a>

                  <a
                    href={receiptUrl}
                    download
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      className="w-full"
                    >
                      <Download
                        size={15}
                      />

                      Download
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </Section>

          {currentDeposit.reviewNote && (
            <Section title="Review Note">
              <p
                className="
                  text-xs
                  leading-5
                  sm:text-sm
                  sm:leading-6
                "
              >
                {currentDeposit.reviewNote}
              </p>
            </Section>
          )}
        </div>

        <div
          className="
            shrink-0
            border-t
            border-[var(--border)]
            bg-[var(--background)]
            px-4
            py-3
            pb-[max(0.75rem,env(safe-area-inset-bottom))]
            shadow-[0_-8px_24px_rgba(0,0,0,0.08)]
            sm:px-5
            sm:py-4
            sm:pb-[max(1rem,env(safe-area-inset-bottom))]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:gap-3
            "
          >
            <Button
              type="button"
              variant="primary"
              className="w-full sm:flex-1"
              disabled={
                currentDeposit.status !==
                "PENDING"
              }
              onClick={() =>
                onApprove(
                  currentDeposit,
                )
              }
            >
              Approve
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full sm:flex-1"
              disabled={
                currentDeposit.status !==
                "PENDING"
              }
              onClick={() =>
                onReject(
                  currentDeposit,
                )
              }
            >
              Reject
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

type SectionProps = {
  title: string;

  children: React.ReactNode;
};

function Section({
  title,
  children,
}: SectionProps) {
  return (
    <section>
      <h3
        className="
          mb-2.5
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-[var(--foreground-muted)]
          sm:mb-3
          sm:text-xs
        "
      >
        {title}
      </h3>

      <div
        className="
          space-y-2.5
          sm:space-y-3
        "
      >
        {children}
      </div>
    </section>
  );
}

type InfoRowProps = {
  label: string;

  value: React.ReactNode;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-0.5
      "
    >
      <span
        className="
          text-[10px]
          uppercase
          tracking-wide
          text-[var(--foreground-muted)]
        "
      >
        {label}
      </span>

      <div
        className="
          break-all
          text-xs
          leading-5
          sm:text-sm
        "
      >
        {value}
      </div>
    </div>
  );
}