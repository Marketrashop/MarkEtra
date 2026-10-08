"use client";

import { useEffect, useState } from "react";
import { X, UserPen } from "lucide-react";

import { EditProfileForm } from "./EditProfileForm";
import type { ProfileFormValues } from "./profile.types";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues: ProfileFormValues;
  onSuccess: (
    values: ProfileFormValues,
  ) => void;
};

export function EditProfileDialog({
  open,
  onClose,
  initialValues,
  onSuccess,
}: Props) {
  const [values, setValues] =
    useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow =
        "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-2
        backdrop-blur-sm
        sm:p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          max-h-[calc(100vh-1.5rem)]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-lg
          border
          bg-[var(--user-card-bg)]
          shadow-2xl
          sm:max-h-[calc(100vh-3rem)]
          sm:rounded-[var(--user-radius-lg)]
        "
        style={{
          borderColor:
            "var(--user-card-border)",
        }}
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            border-b
            px-3
            py-2.5
            sm:gap-3
            sm:px-6
            sm:py-5
          "
          style={{
            borderColor:
              "var(--user-card-border)",
          }}
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
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
                rounded-full
                bg-[var(--user-button-bg)]
                text-[var(--user-button-text)]
                sm:h-10
                sm:w-10
              "
            >
              <UserPen
                size={15}
                className="sm:hidden"
              />

              <UserPen
                size={18}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-[var(--user-text)]
                  sm:text-lg
                "
              >
                Edit Profile
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  leading-4
                  text-[var(--user-text-muted)]
                  sm:mt-0
                  sm:text-sm
                  sm:leading-normal
                "
              >
                Update your personal information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              transition
              hover:bg-[var(--user-card-hover)]
              sm:h-auto
              sm:w-auto
              sm:p-2
            "
          >
            <X
              size={15}
              className="
                text-[var(--user-text)]
                sm:hidden
              "
            />

            <X
              size={20}
              className="
                hidden
                text-[var(--user-text)]
                sm:block
              "
            />
          </button>
        </div>

        <div
          className="
            p-3
            sm:p-6
          "
        >
          <EditProfileForm
            initialValues={values}
            onSuccess={(updatedValues) => {
              setValues(updatedValues);
              onSuccess(updatedValues);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}