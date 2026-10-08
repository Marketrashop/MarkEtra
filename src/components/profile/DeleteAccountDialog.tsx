"use client";

import { useRouter } from "next/navigation";

import {
  useState,
  useEffect,
} from "react";

import {
  AlertTriangle,
  X,
} from "lucide-react";

import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DeleteAccountDialog({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [confirmation, setConfirmation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmation("");
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

  const canDelete =
    confirmation.trim() === "DELETE";

  async function handleDelete() {
    if (!canDelete) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch("/api/profile/delete", {
          method: "DELETE",
        });

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.error ??
            "Unable to delete account.",
        );

        return;
      }

      toast.success(
        "Your account has been deleted.",
      );

      router.replace("/Auth");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to delete account.",
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
          w-full
          max-w-lg
          rounded-lg
          border
          bg-[var(--user-card-bg)]
          shadow-2xl
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
            <AlertTriangle
              className="
                h-4
                w-4
                shrink-0
                text-[var(--user-danger)]
                sm:h-[22px]
                sm:w-[22px]
              "
            />

            <h2
              className="
                truncate
                text-sm
                font-semibold
                text-[var(--user-text)]
                sm:text-lg
              "
            >
              Delete Account
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              transition-opacity
              hover:opacity-70
              sm:h-auto
              sm:w-auto
            "
            aria-label="Close dialog"
          >
            <X
              size={16}
              className="sm:hidden text-[var(--user-text)]"
            />

            <X
              size={20}
              className="hidden sm:block text-[var(--user-text)]"
            />
          </button>
        </div>

        <div
          className="
            space-y-3.5
            p-3
            sm:space-y-5
            sm:p-6
          "
        >
          <p
            className="
              text-[11px]
              leading-5
              text-[var(--user-text-muted)]
              sm:text-sm
              sm:leading-7
            "
          >
            This action will immediately remove
            your access to your account. You
            will no longer be able to sign in
            with your current credentials.
          </p>

          <p
            className="
              text-[11px]
              leading-5
              text-[var(--user-text-muted)]
              sm:text-sm
              sm:leading-7
            "
          >
            Type <strong>DELETE</strong> below
            to continue.
          </p>

          <input
            value={confirmation}
            onChange={(event) =>
              setConfirmation(
                event.target.value,
              )
            }
            placeholder="Type DELETE"
            className="
              h-9
              w-full
              rounded-lg
              border
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              outline-none
              sm:h-12
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:text-sm
            "
            style={{
              borderColor:
                "var(--user-input-border)",
            }}
          />

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              sm:flex-row
              sm:justify-end
              sm:gap-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                h-9
                rounded-lg
                border
                px-4
                text-[10px]
                sm:h-auto
                sm:rounded-[var(--user-radius-md)]
                sm:px-5
                sm:py-3
                sm:text-sm
              "
              style={{
                borderColor:
                  "var(--user-input-border)",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                !canDelete || loading
              }
              onClick={handleDelete}
              className="
                h-9
                rounded-lg
                bg-[var(--user-danger)]
                px-4
                text-[10px]
                font-medium
                text-white
                transition
                disabled:opacity-50
                sm:h-auto
                sm:rounded-[var(--user-radius-md)]
                sm:px-5
                sm:py-3
                sm:text-sm
              "
            >
              {loading
                ? "Deleting..."
                : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}