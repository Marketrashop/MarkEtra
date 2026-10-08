"use client";

import {
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import ChangePasswordForm from "./ChangePasswordForm";

export default function ChangePasswordCard() {
  const [
    isChangePasswordOpen,
    setIsChangePasswordOpen,
  ] = useState(false);

  return (
    <section
      className="
        overflow-hidden
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        sm:rounded-[var(--user-radius-lg)]
      "
    >
      {/* Change Password Header */}
      <button
        type="button"
        onClick={() =>
          setIsChangePasswordOpen(
            (prev) => !prev,
          )
        }
        aria-expanded={isChangePasswordOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-3
          p-3
          text-left
          transition-colors
          hover:bg-[var(--user-button-bg)]/[0.03]
          sm:p-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-2.5
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[var(--user-button-bg)]/10
              text-[var(--user-button-bg)]
              sm:h-9
              sm:w-9
            "
          >
            <ShieldCheck
              size={16}
              className="sm:hidden"
            />

            <ShieldCheck
              size={18}
              className="hidden sm:block"
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-[12px]
                font-semibold
                text-[var(--user-title)]
                sm:text-sm
              "
            >
              Change Password
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-[var(--user-text-muted)]
                sm:mt-1
                sm:text-xs
                sm:leading-5
              "
            >
              Update your password regularly to help
              keep your account secure.
            </p>
          </div>
        </div>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`
            shrink-0
            text-[var(--user-text-muted)]
            transition-transform
            duration-300
            ease-out
            ${
              isChangePasswordOpen
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* Expandable Password Form */}
      <div
        className={`
          grid
          transition-[grid-template-rows,opacity]
          duration-300
          ease-out
          ${
            isChangePasswordOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t
              border-[var(--user-card-border)]
              px-3
              pb-3
              pt-3
              sm:px-5
              sm:pb-5
              sm:pt-4
            "
          >
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}