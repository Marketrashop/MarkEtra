"use client";

import { useState } from "react";

import Image from "next/image";

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import Button from "@/components/ui/Button";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import type {
  DepositMethod,
} from "./types";

type DeleteDepositMethodDialogProps = {
  open: boolean;

  method: DepositMethod | null;

  onClose: () => void;

  onSuccess: () => void;
};

export default function DeleteDepositMethodDialog({
  open,
  method,
  onClose,
  onSuccess,
}: DeleteDepositMethodDialogProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!method) {
    return null;
  }

  const imageUrl =
    getCloudinaryImageUrl(
      method.iconKey,
    );

  async function handleDelete() {
    if (!method) {
      return;
    }

    try {
      setLoading(true);

      setError("");

      const response =
        await fetch(
          `/api/admin/deposit-methods/${method.id}`,
          {
            method: "DELETE",
          },
        );

      const text =
        await response.text();

      const result = text
        ? JSON.parse(text)
        : {};

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Failed to delete deposit method",
        );
      }

      onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete deposit method",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading && !value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          w-[calc(100%-1.5rem)]
          max-w-md
          rounded-xl
          p-4
          sm:w-full
          sm:p-5
        "
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle
            className="
              flex
              items-center
              gap-1.5
              text-base
              leading-tight
              sm:text-lg
            "
          >
            <AlertTriangle
              size={18}
              className="
                shrink-0
                text-red-500
              "
            />

            <span className="min-w-0">
              Delete Deposit Method
            </span>
          </DialogTitle>

          <DialogDescription
            className="
              text-xs
              leading-4
              sm:text-sm
            "
          >
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-3
          "
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={method.name}
              width={44}
              height={44}
              className="
                h-11
                w-11
                shrink-0
                rounded-lg
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-gray-200
                text-sm
                font-semibold
              "
            >
              {method.symbol.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-semibold
                leading-5
              "
            >
              {method.name}
            </p>

            <p
              className="
                truncate
                text-xs
                leading-4
                text-muted-foreground
              "
            >
              {method.network}
            </p>

            <p
              className="
                mt-1.5
                text-xs
                leading-4
                text-red-600
              "
            >
              Deleting this method removes it
              from the platform immediately.
            </p>
          </div>
        </div>

        {error && (
          <p
            className="
              text-xs
              leading-4
              text-red-600
            "
          >
            {error}
          </p>
        )}

        <DialogFooter
          className="
            flex-row
            justify-end
            gap-2
            sm:gap-2
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
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={14}
                  className="
                    mr-1.5
                    animate-spin
                  "
                />

                Deleting...
              </>
            ) : (
              <>
                <Trash2
                  size={14}
                  className="mr-1.5"
                />

                Delete Method
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}