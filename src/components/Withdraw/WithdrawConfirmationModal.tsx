"use client";

import {
  X,
} from "lucide-react";

import {
  formatWithdrawAmount,
} from "./withdraw.utils";

import type {
  WithdrawSummary,
  WithdrawMethod,
} from "./withdraw.types";

type WithdrawConfirmationModalProps = {
  open: boolean;

  method: WithdrawMethod;

  address: string;

  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    country: string;
    currency: string;
    bankAddress: string;
    swiftBic: string;
    iban: string;
    routingNumber: string;
    sortCode: string;
    ifsc: string;
  };

  summary: WithdrawSummary;

  onClose: () => void;

  onConfirm: () => void;

  loading?: boolean;
};

export default function WithdrawConfirmationModal({
  open,
  method,
  address,
  bankDetails,
  summary,
  onClose,
  onConfirm,
  loading = false,
}: WithdrawConfirmationModalProps) {
  if (!open) {
    return null;
  }

  const isBank =
    method.type === "bank";

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-[var(--withdraw-modal-overlay)]
        p-2
        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdraw-confirmation-title"
    >
      <div
        className="
          max-h-[96vh]
          w-full
          max-w-md
          overflow-y-auto
          rounded-lg
          border
          border-[var(--withdraw-modal-border)]
          bg-[var(--withdraw-modal-bg)]
          p-3
          shadow-[var(--withdraw-modal-shadow)]
          sm:max-h-none
          sm:rounded-[var(--withdraw-modal-radius)]
          sm:overflow-visible
          sm:p-[var(--withdraw-modal-padding)]
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-2.5
            sm:gap-4
          "
        >
          <div className="min-w-0">
            <h2
              id="withdraw-confirmation-title"
              className="
                text-[15px]
                font-bold
                text-[var(--withdraw-modal-title)]
                sm:text-[18px]
              "
            >
              Confirm Withdrawal
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-[var(--withdraw-modal-text)]
                sm:mt-1.5
                sm:text-[12px]
                sm:leading-5
              "
            >
              Review your withdrawal details
              before confirming.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close confirmation"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[var(--withdraw-modal-close-border)]
              bg-[var(--withdraw-modal-close-bg)]
              text-[var(--withdraw-modal-close-text)]
              transition-all
              duration-[var(--withdraw-modal-transition)]
              hover:bg-[var(--withdraw-modal-close-hover-bg)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-8
              sm:w-8
              sm:rounded-lg
            "
          >
            <X
              size={14}
              className="
                sm:h-4
                sm:w-4
              "
            />
          </button>
        </div>

        <div
          className="
            mt-3
            rounded-lg
            border
            border-[var(--withdraw-modal-summary-border)]
            bg-[var(--withdraw-modal-summary-bg)]
            p-2.5
            sm:mt-5
            sm:rounded-xl
            sm:p-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-2.5
              sm:gap-3
            "
          >
            <span
              className="
                text-[9px]
                text-[var(--withdraw-modal-label)]
                sm:text-[11px]
              "
            >
              Withdrawal Method
            </span>

            <span
              className="
                text-right
                text-[10px]
                font-semibold
                text-[var(--withdraw-modal-value)]
                sm:text-[12px]
              "
            >
              {method.name}{" "}
              ({method.symbol})
            </span>
          </div>

          {isBank ? (
            <>
              <InfoRow
                label="Account Holder"
                value={
                  bankDetails.accountHolderName
                }
              />

              <InfoRow
                label="Bank Name"
                value={
                  bankDetails.bankName
                }
              />

              <InfoRow
                label="Account Number"
                value={
                  bankDetails.accountNumber
                }
              />

              <InfoRow
                label="Country"
                value={
                  bankDetails.country
                }
              />

              <InfoRow
                label="Currency"
                value={
                  bankDetails.currency
                }
              />

              <InfoRow
                label="Bank Address"
                value={
                  bankDetails.bankAddress
                }
              />

              {bankDetails.swiftBic && (
                <InfoRow
                  label="SWIFT / BIC"
                  value={
                    bankDetails.swiftBic
                  }
                />
              )}

              {bankDetails.iban && (
                <InfoRow
                  label="IBAN"
                  value={
                    bankDetails.iban
                  }
                />
              )}

              {bankDetails.routingNumber && (
                <InfoRow
                  label="Routing Number"
                  value={
                    bankDetails.routingNumber
                  }
                />
              )}

              {bankDetails.sortCode && (
                <InfoRow
                  label="Sort Code"
                  value={
                    bankDetails.sortCode
                  }
                />
              )}

              {bankDetails.ifsc && (
                <InfoRow
                  label="IFSC"
                  value={
                    bankDetails.ifsc
                  }
                />
              )}
            </>
          ) : (
            <div
              className="
                mt-2.5
                flex
                items-start
                justify-between
                gap-2.5
                sm:mt-3
                sm:gap-3
              "
            >
              <span
                className="
                  shrink-0
                  text-[9px]
                  text-[var(--withdraw-modal-label)]
                  sm:text-[11px]
                "
              >
                Destination
              </span>

              <span
                className="
                  max-w-[65%]
                  break-all
                  text-right
                  text-[9px]
                  font-medium
                  text-[var(--withdraw-modal-value)]
                  sm:text-[11px]
                "
              >
                {address}
              </span>
            </div>
          )}

          <div
            className="
              my-2.5
              border-t
              border-[var(--withdraw-modal-divider)]
              sm:my-3
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              gap-2.5
              sm:gap-3
            "
          >
            <span
              className="
                text-[9px]
                text-[var(--withdraw-modal-label)]
                sm:text-[11px]
              "
            >
              Withdrawal Amount
            </span>

            <span
              className="
                text-[10px]
                font-semibold
                text-[var(--withdraw-modal-value)]
                sm:text-[12px]
              "
            >
              {formatWithdrawAmount(
                summary.amount
              )}
            </span>
          </div>

          <div
            className="
              mt-1.5
              flex
              items-center
              justify-between
              gap-2.5
              sm:mt-2
              sm:gap-3
            "
          >
            <span
              className="
                text-[9px]
                text-[var(--withdraw-modal-label)]
                sm:text-[11px]
              "
            >
              Network Fee
            </span>

            <span
              className="
                text-[10px]
                font-semibold
                text-[var(--withdraw-modal-value)]
                sm:text-[12px]
              "
            >
              {formatWithdrawAmount(
                summary.networkFee
              )}
            </span>
          </div>

          <div
            className="
              mt-2.5
              border-t
              border-[var(--withdraw-modal-divider)]
              sm:mt-3
            "
          />

          <div
            className="
              mt-2.5
              flex
              items-center
              justify-between
              gap-2.5
              sm:mt-3
              sm:gap-3
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                text-[var(--withdraw-modal-receive-label)]
                sm:text-[12px]
              "
            >
              You Receive
            </span>

            <span
              className="
                text-[15px]
                font-extrabold
                text-[var(--withdraw-modal-receive-value)]
                sm:text-[17px]
              "
            >
              {formatWithdrawAmount(
                summary.youReceive
              )}
            </span>
          </div>
        </div>

        <div
          className="
            mt-3
            flex
            gap-2
            sm:mt-5
            sm:gap-2.5
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-8
              flex-1
              rounded-lg
              border
              border-[var(--withdraw-modal-cancel-border)]
              bg-[var(--withdraw-modal-cancel-bg)]
              px-2.5
              text-[10px]
              font-semibold
              text-[var(--withdraw-modal-cancel-text)]
              transition-all
              duration-[var(--withdraw-modal-transition)]
              hover:bg-[var(--withdraw-modal-cancel-hover-bg)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-auto
              sm:rounded-xl
              sm:px-4
              sm:py-2.5
              sm:text-[12px]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              h-8
              flex-1
              rounded-lg
              bg-[var(--withdraw-modal-confirm-bg)]
              px-2.5
              text-[10px]
              font-semibold
              text-[var(--withdraw-modal-confirm-text)]
              shadow-[var(--withdraw-modal-confirm-shadow)]
              transition-all
              duration-[var(--withdraw-modal-transition)]
              hover:bg-[var(--withdraw-modal-confirm-hover-bg)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-auto
              sm:rounded-xl
              sm:px-4
              sm:py-2.5
              sm:text-[12px]
            "
          >
            {loading
              ? "Processing..."
              : "Confirm Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div
      className="
        mt-2
        flex
        items-start
        justify-between
        gap-2.5
        sm:mt-3
        sm:gap-3
      "
    >
      <span
        className="
          shrink-0
          text-[9px]
          text-[var(--withdraw-modal-label)]
          sm:text-[11px]
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[65%]
          break-words
          text-right
          text-[9px]
          font-medium
          text-[var(--withdraw-modal-value)]
          sm:text-[11px]
        "
      >
        {value}
      </span>
    </div>
  );
}