"use client";

import DepositReceiptUploader from "./DepositReceiptUploader";

import type {
  DepositMethod,
} from "./deposit.types";

import {
  formatDepositMoney,
} from "./deposit.utils";

type DepositReceiptModalProps = {
  open: boolean;

  method: DepositMethod;

  amount: number;

  file: File | null;

  submitting: boolean;

  onFileChange: (
    file: File
  ) => void;

  onClose: () => void;

  onSubmit: () => void;
};

export default function DepositReceiptModal({
  open,
  method,
  amount,
  file,
  submitting,
  onFileChange,
  onClose,
  onSubmit,
}: DepositReceiptModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-[var(--deposit-modal-overlay)]
        p-2
        sm:p-5
      "
    >
      <div
        className="
          max-h-[96vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-lg
          border
          border-[var(--deposit-modal-border)]
          bg-[var(--deposit-modal-bg)]
          p-3
          shadow-[var(--deposit-modal-shadow)]
          sm:max-h-none
          sm:rounded-[var(--deposit-modal-radius)]
          sm:overflow-visible
          sm:p-[var(--deposit-modal-padding)]
        "
      >
        <h2
          className="
            text-[16px]
            font-bold
            text-[var(--deposit-modal-title)]
            sm:text-2xl
          "
        >
          Proceed to Deposit
        </h2>

        <p
          className="
            mt-1
            text-[10px]
            leading-4
            text-[var(--deposit-modal-text)]
            sm:mt-2
            sm:text-sm
            sm:leading-normal
          "
        >
          Complete your payment using the
          details below.
        </p>

        <div
          className="
            mt-4
            space-y-2.5
            rounded-lg
            border
            border-[var(--deposit-modal-summary-border)]
            bg-[var(--deposit-modal-summary-bg)]
            p-2.5
            sm:mt-8
            sm:space-y-4
            sm:rounded-2xl
            sm:p-5
          "
        >
          <SummaryRow
            label="Payment Method"
            value={method.name}
          />

          <SummaryRow
            label="Wallet Address"
            value={method.address}
          />

          <SummaryRow
            label="Deposit Amount"
            value={formatDepositMoney(
              amount
            )}
          />
        </div>

        <DepositReceiptUploader
          file={file}
          onChange={onFileChange}
        />

        <div
          className="
            mt-4
            rounded-lg
            border
            border-[var(--deposit-modal-summary-border)]
            bg-[var(--deposit-modal-summary-bg)]
            p-2.5
            sm:mt-8
            sm:rounded-2xl
            sm:p-5
          "
        >
          <h3
            className="
              text-[11px]
              font-semibold
              text-[var(--deposit-modal-title)]
              sm:text-base
            "
          >
            Notes
          </h3>

          <ul
            className="
              mt-2
              list-disc
              space-y-1
              pl-4
              text-[10px]
              leading-4
              text-[var(--deposit-modal-text)]
              sm:mt-4
              sm:space-y-2
              sm:pl-5
              sm:text-sm
              sm:leading-normal
            "
          >
            <li>
              Make sure the
              transaction hash is
              visible.
            </li>

            <li>
              Upload only after successful payment.
            </li>
          </ul>
        </div>

        <div
          className="
            mt-4
            flex
            flex-col-reverse
            gap-1.5
            sm:mt-8
            sm:flex-row
            sm:justify-end
            sm:gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              h-8
              rounded-lg
              border
              border-[var(--deposit-modal-cancel-border)]
              bg-[var(--deposit-modal-cancel-bg)]
              px-3
              text-[10px]
              font-medium
              text-[var(--deposit-modal-cancel-text)]
              transition-all
              duration-300
              hover:bg-[var(--deposit-modal-cancel-hover)]
              sm:h-auto
              sm:rounded-xl
              sm:px-6
              sm:py-3
              sm:text-sm
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!file || submitting}
            className="
              h-8
              rounded-lg
              border
              border-white
              bg-[#0B3B91]
              px-3
              text-[10px]
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#082d6d]
              disabled:cursor-not-allowed
              disabled:border-white/50
              disabled:bg-[#0B3B91]/50
              disabled:text-white/70
              sm:h-auto
              sm:rounded-xl
              sm:px-6
              sm:py-3
              sm:text-sm
            "
          >
            {submitting
              ? "Submitting..."
              : "Submit Deposit"}
          </button>
        </div>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;

  value: string;
};

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-2.5
        sm:gap-4
      "
    >
      <span
        className="
          shrink-0
          text-[10px]
          text-[var(--deposit-modal-text)]
          sm:text-sm
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[65%]
          break-all
          text-right
          text-[10px]
          font-medium
          leading-4
          text-[var(--deposit-modal-title)]
          sm:max-w-[60%]
          sm:text-sm
          sm:leading-normal
        "
      >
        {value}
      </span>
    </div>
  );
}