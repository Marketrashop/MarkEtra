"use client";

import {
  Loader2,
  X,
} from "lucide-react";

import WithdrawalDetails from "./WithdrawalDetails";

import type {
  Withdrawal,
} from "./withdrawal.types";

type WithdrawalReviewModalProps = {
  open: boolean;

  withdrawal: Withdrawal | null;

  loading: boolean;

  onClose: () => void;

  onApprove: () => void;

  onReject: () => void;
};

export default function WithdrawalReviewModal({
  open,
  withdrawal,
  loading,
  onClose,
  onApprove,
  onReject,
}: WithdrawalReviewModalProps) {
  if (
    !open ||
    !withdrawal
  ) {
    return null;
  }

  const canReview =
    withdrawal.status ===
      "pending" ||
    withdrawal.status ===
      "processing";

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/60
        p-1.5
        sm:p-4
      "
    >
      <div
        className="
          flex
          max-h-[96vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-lg
          border
          border-[var(--admin-border)]
          bg-[var(--admin-card-bg)]
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-2xl
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-2
            border-b
            border-[var(--admin-border)]
            px-3
            py-2.5
            sm:items-center
            sm:px-6
            sm:py-5
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-sm
                font-bold
                text-[var(--admin-foreground)]
                sm:text-xl
              "
            >
              Review Withdrawal
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-[var(--admin-muted-foreground)]
                sm:mt-1
                sm:text-sm
                sm:leading-normal
              "
            >
              Review the withdrawal details before taking action.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              shrink-0
              rounded
              p-1
              transition-colors
              hover:bg-[var(--admin-muted-bg)]
              sm:rounded-lg
              sm:p-2
            "
          >
            <X
              size={14}
              className="sm:h-5 sm:w-5"
            />
          </button>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            p-2.5
            sm:p-6
          "
        >
          <WithdrawalDetails
            withdrawal={
              withdrawal
            }
          />
        </div>

        <div
          className="
            flex
            flex-col-reverse
            gap-1.5
            border-t
            border-[var(--admin-border)]
            p-2.5
            sm:flex-row
            sm:justify-end
            sm:gap-3
            sm:p-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-7
              rounded-md
              border
              border-[var(--admin-border)]
              px-2.5
              text-[9px]
              font-semibold
              text-[var(--admin-foreground)]
              transition-all
              hover:bg-[var(--admin-muted-bg)]
              sm:h-auto
              sm:rounded-lg
              sm:px-5
              sm:py-2.5
              sm:text-sm
            "
          >
            Close
          </button>

          {canReview && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={loading}
                className="
                  h-7
                  rounded-md
                  border
                  border-[var(--admin-danger)]
                  px-2.5
                  text-[9px]
                  font-semibold
                  text-[var(--admin-danger)]
                  transition-all
                  hover:bg-[var(--admin-danger)]
                  hover:text-white
                  disabled:opacity-60
                  sm:h-auto
                  sm:rounded-lg
                  sm:px-5
                  sm:py-2.5
                  sm:text-sm
                "
              >
                {loading ? (
                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      sm:gap-2
                    "
                  >
                    <Loader2
                      size={12}
                      className="
                        animate-spin
                        sm:h-4
                        sm:w-4
                      "
                    />

                    Processing...
                  </span>
                ) : (
                  "Reject"
                )}
              </button>

              <button
                type="button"
                onClick={onApprove}
                disabled={loading}
                className="
                  h-7
                  rounded-md
                  bg-[var(--admin-primary)]
                  px-2.5
                  text-[9px]
                  font-semibold
                  text-[var(--admin-primary-foreground)]
                  transition-opacity
                  hover:opacity-90
                  disabled:opacity-60
                  sm:h-auto
                  sm:rounded-lg
                  sm:px-5
                  sm:py-2.5
                  sm:text-sm
                "
              >
                {loading ? (
                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      sm:gap-2
                    "
                  >
                    <Loader2
                      size={12}
                      className="
                        animate-spin
                        sm:h-4
                        sm:w-4
                      "
                    />

                    Processing...
                  </span>
                ) : (
                  "Approve"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}