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
        className="
          mt-16
          mb-12
          sm:mt-60
          sm:mb-20
        "
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-[var(--user-danger)]
            px-2.5
            py-1.5
            text-[10px]
            font-medium
            text-[var(--user-danger)]
            transition-colors
            duration-300
            hover:bg-[var(--user-danger)]
            hover:text-white
            sm:gap-2
            sm:rounded-[var(--user-radius-md)]
            sm:px-5
            sm:py-3
            sm:text-base
          "
        >
          <Trash2
            size={13}
            className="sm:h-[18px] sm:w-[18px]"
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