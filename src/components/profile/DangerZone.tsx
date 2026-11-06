"use client";

import { useState } from "react";

import { Trash2 } from "lucide-react";

import { DeleteAccountDialog } from "./DeleteAccountDialog";

export function DangerZone() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <section
        aria-labelledby="danger-zone-title"
        className="
          mb-2
          flex
          flex-col
          gap-3
          rounded-lg
          border
          p-3
          sm:mb-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-6
          sm:rounded-2xl
          sm:p-5
        "
        style={{
          borderColor:
            "color-mix(in srgb, var(--user-danger) 30%, transparent)",
          background:
            "color-mix(in srgb, var(--user-danger) 6%, transparent)",
        }}
      >
        <div className="min-w-0">
          <h2
            id="danger-zone-title"
            className="
              text-xs
              font-semibold
              text-[var(--user-title)]
              sm:text-sm
            "
          >
            Delete account
          </h2>

          <p
            className="
              mt-0.5
              text-[11px]
              leading-4
              text-[var(--user-text-muted)]
              sm:text-[13px]
              sm:leading-5
            "
          >
            Permanently remove your account
            and its data. This can&apos;t be
            undone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            inline-flex
            w-full
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-[var(--user-danger)]
            px-3
            py-2
            text-xs
            font-medium
            text-[var(--user-danger)]
            transition-colors
            duration-300
            hover:bg-[var(--user-danger)]
            hover:text-white
            sm:w-auto
            sm:gap-2
            sm:rounded-[var(--user-radius-md)]
            sm:px-5
            sm:py-2.5
            sm:text-sm
          "
        >
          <Trash2
            size={13}
            className="sm:h-4 sm:w-4"
          />

          Delete Account
        </button>
      </section>

      <DeleteAccountDialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
}
