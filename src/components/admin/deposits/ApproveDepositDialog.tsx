"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

import type { Deposit } from "./types";

type ApproveDepositDialogProps = {
  open: boolean;
  deposit: Deposit | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export default function ApproveDepositDialog({
  open,
  deposit,
  onClose,
  onSuccess,
}: ApproveDepositDialogProps) {
  const [adminNote, setAdminNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open || !deposit) {
    return null;
  }

  const depositId = deposit.id;

  async function handleApprove() {
    try {
      setLoading(true);

      setError("");

      const response =
        await fetch(
          `/api/admin/deposits/${depositId}/approve`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              adminNote:
                adminNote.trim() ||
                undefined,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to approve deposit.",
        );
      }

      setAdminNote("");

      await onSuccess();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to approve deposit.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        p-3
        backdrop-blur-sm
        sm:p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-xl
          border
          border-[var(--admin-border)]
          bg-[var(--admin-card-bg)]
          p-4
          shadow-2xl
          sm:rounded-2xl
          sm:p-5
        "
      >
        <h2
          className="
            text-base
            font-semibold
            text-[var(--admin-foreground)]
            sm:text-lg
          "
        >
          Approve Deposit
        </h2>

        <p
          className="
            mt-1.5
            text-xs
            leading-5
            text-[var(--admin-muted-foreground)]
            sm:mt-2
            sm:text-sm
            sm:leading-5
          "
        >
          This will approve the deposit request.
          Wallet crediting will occur after the
          approval process is completed.
        </p>

        <div className="mt-4 sm:mt-5">
          <label
            className="
              mb-1.5
              block
              text-xs
              font-medium
              text-[var(--admin-foreground)]
              sm:text-sm
            "
          >
            Admin Note

            <span
              className="
                ml-1
                text-[var(--admin-muted-foreground)]
              "
            >
              (Optional)
            </span>
          </label>

          <textarea
            rows={4}
            value={adminNote}
            onChange={(event) =>
              setAdminNote(
                event.target.value,
              )
            }
            placeholder="Add an internal note..."
            className="
              w-full
              resize-none
              rounded-lg
              border
              border-[var(--admin-border)]
              bg-[var(--admin-background)]
              px-3
              py-2.5
              text-sm
              text-[var(--admin-foreground)]
              placeholder:text-[var(--admin-muted-foreground)]
              outline-none
              transition-colors
              focus:border-[var(--admin-primary)]
              focus:ring-2
              focus:ring-[var(--admin-primary)]/20
              sm:rounded-xl
              sm:px-4
              sm:py-3
            "
          />
        </div>

        {error && (
          <div
            className="
              mt-3
              rounded-lg
              border
              border-red-500/20
              bg-red-500/10
              px-3
              py-2.5
              text-xs
              leading-4
              text-red-400
              sm:mt-4
              sm:rounded-xl
              sm:px-4
              sm:py-3
              sm:text-sm
            "
          >
            {error}
          </div>
        )}

        <div
          className="
            mt-5
            flex
            justify-end
            gap-2
            sm:mt-6
            sm:gap-3
          "
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleApprove}
            disabled={loading}
          >
            {loading
              ? "Approving..."
              : "Approve Deposit"}
          </Button>
        </div>
      </div>
    </div>
  );
}