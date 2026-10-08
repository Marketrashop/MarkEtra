"use client";

import {
  useState,
} from "react";

import Button from "@/components/ui/Button";

import type {
  Deposit,
} from "./types";

type RejectDepositDialogProps = {
  open: boolean;

  deposit: Deposit | null;

  onClose: () => void;

  onSuccess: () => Promise<void>;
};

export default function RejectDepositDialog({
  open,
  deposit,
  onClose,
  onSuccess,
}: RejectDepositDialogProps) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    adminNote,
    setAdminNote,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  if (
    !open ||
    !deposit
  ) {
    return null;
  }

  const currentDeposit = deposit;

  async function handleReject() {
    try {
      if (!adminNote.trim()) {
        setError(
          "Please provide a reason for rejecting this deposit.",
        );

        return;
      }

      setLoading(true);

      setError("");

      const response =
        await fetch(
          `/api/admin/deposits/${currentDeposit.id}/reject`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              adminNote,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to reject deposit.",
        );
      }

      await onSuccess();

      setAdminNote("");

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to reject deposit.",
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
          Reject Deposit
        </h2>

        <p
          className="
            mt-1.5
            text-xs
            leading-5
            text-[var(--admin-muted-foreground)]
            sm:mt-2
            sm:text-sm
          "
        >
          This action cannot be undone. Tell the user why this
          deposit was rejected.
        </p>

        <div
          className="
            mt-4
            sm:mt-5
          "
        >
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
            Reason for rejection
          </label>

          <textarea
            value={adminNote}
            onChange={(event) =>
              setAdminNote(
                event.target.value,
              )
            }
            rows={4}
            placeholder="Explain why this deposit was rejected..."
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
            variant="primary"
            onClick={
              handleReject
            }
            disabled={loading}
          >
            {loading
              ? "Rejecting..."
              : "Reject Deposit"}
          </Button>
        </div>
      </div>
    </div>
  );
}