"use client";

import {
  Check,
  Eye,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  Deposit,
} from "./types";

type DepositActionsProps = {
  deposit: Deposit;

  onView: (
    deposit: Deposit,
  ) => void;

  onApprove: (
    deposit: Deposit,
  ) => void;

  onReject: (
    deposit: Deposit,
  ) => void;
};

export default function DepositActions({
  deposit,
  onView,
  onApprove,
  onReject,
}: DepositActionsProps) {
  const isPending =
    deposit.status ===
    "PENDING";

  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-1
        sm:gap-2
      "
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() =>
          onView(deposit)
        }
      >
        <Eye
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </Button>

      <Button
        type="button"
        variant="primary"
        disabled={!isPending}
        onClick={() =>
          onApprove(deposit)
        }
      >
        <Check
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </Button>

      <Button
        type="button"
        variant="secondary"
        disabled={!isPending}
        onClick={() =>
          onReject(deposit)
        }
      >
        <X
          size={16}
          className="sm:h-[18px] sm:w-[18px]"
        />
      </Button>
    </div>
  );
}