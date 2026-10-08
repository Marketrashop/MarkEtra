"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  AlertTriangle,
  ArrowRight,
  LockKeyhole,
  CircleCheck,
  Mail,
  X,
} from "lucide-react";

import {
  useForm,
  type FieldErrors,
} from "react-hook-form";

import {
  toast,
} from "sonner";

import PasswordField from "@/components/auth/PasswordField";

import {
  ChangePasswordError,
  changePassword,
} from "./security.service";

import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "./security.validation";

export default function ChangePasswordForm() {
  const router =
    useRouter();

  const [
    remainingAttempts,
    setRemainingAttempts,
  ] = useState<
    number | null
  >(null);

  const [
    attemptsExceeded,
    setAttemptsExceeded,
  ] = useState(false);

  const [
    showResetDialog,
    setShowResetDialog,
  ] = useState(false);

  const [
    resetEmail,
    setResetEmail,
  ] = useState("");

  const [
    resetLoading,
    setResetLoading,
  ] = useState(false);

  const [
    resetSent,
    setResetSent,
  ] = useState(false);

  const currentPasswordRef =
    useRef<HTMLDivElement>(null);

  const newPasswordRef =
    useRef<HTMLDivElement>(null);

  const confirmPasswordRef =
    useRef<HTMLDivElement>(null);

  function shakeField(
    field: keyof ChangePasswordValues,
  ) {
    const refs = {
      currentPassword:
        currentPasswordRef,
      newPassword:
        newPasswordRef,
      confirmPassword:
        confirmPasswordRef,
    };

    const element =
      refs[field].current;

    if (!element) {
      return;
    }

    element.animate(
      [
        {
          transform:
            "translateX(0)",
        },
        {
          transform:
            "translateX(-5px)",
        },
        {
          transform:
            "translateX(5px)",
        },
        {
          transform:
            "translateX(-4px)",
        },
        {
          transform:
            "translateX(4px)",
        },
        {
          transform:
            "translateX(-2px)",
        },
        {
          transform:
            "translateX(2px)",
        },
        {
          transform:
            "translateX(0)",
        },
      ],
      {
        duration: 360,
        easing:
          "ease-in-out",
      },
    );
  }

  function shakeFailedFields(
    fieldErrors: FieldErrors<ChangePasswordValues>,
  ) {
    const failedFields =
      Object.keys(
        fieldErrors,
      ) as Array<
        keyof ChangePasswordValues
      >;

    failedFields.forEach(
      (field) => {
        shakeField(field);
      },
    );
  }

  function onInvalid(
    fieldErrors: FieldErrors<ChangePasswordValues>,
  ) {
    shakeFailedFields(
      fieldErrors,
    );
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<ChangePasswordValues>({
      resolver:
        zodResolver(
          changePasswordSchema,
        ),
    });

function openResetDialog() {
  setResetEmail("");
  setResetSent(false);
  setShowResetDialog(true);
}

function closeResetDialog() {
  if (resetLoading) {
    return;
  }

  setShowResetDialog(false);
  setResetEmail("");
  setResetSent(false);
}

  useEffect(() => {
    if (!showResetDialog) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        closeResetDialog();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [showResetDialog, resetLoading]);

async function handlePasswordResetRequest(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  if (resetLoading) {
    return;
  }

  const email = resetEmail.trim().toLowerCase();

  if (!email) {
    toast.error("Please enter your email address.");
    return;
  }

  setResetLoading(true);

  try {
    const response = await fetch(
      "/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Unable to process password reset request.",
      );
    }

    setResetSent(true);
    setResetEmail("");

    toast.success(
      "If an account with that email exists, a reset email has been sent.",
    );
  } catch (error) {
    setResetEmail("");

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to process password reset request.",
    );
  } finally {
    setResetLoading(false);
  }
}

  async function onSubmit(
    values: ChangePasswordValues,
  ) {
    if (attemptsExceeded) {
      return;
    }

    try {
      const response =
        await changePassword(values);

      toast.success(
        response.message,
      );

      setRemainingAttempts(null);
      setAttemptsExceeded(false);

      reset();

      setTimeout(() => {
        router.replace("/Auth");
        router.refresh();
      }, 1000);
    } catch (error) {
      if (
        error instanceof
        ChangePasswordError
      ) {
        if (
          error.code ===
          "CURRENT_PASSWORD_INCORRECT"
        ) {
          setRemainingAttempts(
            error.remainingAttempts ??
              null,
          );

          shakeField(
            "currentPassword",
          );

          toast.error(
            "Your current password is incorrect.",
          );

          return;
        }

        if (
          error.code ===
          "PASSWORD_CHANGE_ATTEMPTS_EXCEEDED"
        ) {
          setRemainingAttempts(0);
          setAttemptsExceeded(true);

          shakeField(
            "currentPassword",
          );

          toast.error(
            "Password change is temporarily locked. Please reset your password to continue.",
          );

          return;
        }
      }

      console.error(
        "Unexpected password change error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to change password.",
      );
    }
  }

  const showRecoveryPrompt =
    remainingAttempts !== null ||
    attemptsExceeded;

  const isLastAttempt =
    remainingAttempts === 1;

  return (
    <>
      <form
        onSubmit={handleSubmit(
          onSubmit,
          onInvalid,
        )}
        className="
          space-y-3
          sm:space-y-4
        "
      >
        <div
          ref={currentPasswordRef}
        >
          <PasswordField
            {...register(
              "currentPassword",
            )}
            id="currentPassword"
            label="Current Password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            error={
              errors.currentPassword
                ?.message
            }
            required
            disabled={
              isSubmitting ||
              attemptsExceeded
            }
          />
        </div>

        <div
          ref={newPasswordRef}
        >
          <PasswordField
            {...register(
              "newPassword",
            )}
            id="newPassword"
            label="New Password"
            placeholder="Create a new password"
            autoComplete="new-password"
            error={
              errors.newPassword
                ?.message
            }
            required
            disabled={
              isSubmitting ||
              attemptsExceeded
            }
            showStrength
          />
        </div>

        <div
          ref={confirmPasswordRef}
        >
          <PasswordField
            {...register(
              "confirmPassword",
            )}
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            error={
              errors.confirmPassword
                ?.message
            }
            required
            disabled={
              isSubmitting ||
              attemptsExceeded
            }
          />
        </div>

        {showRecoveryPrompt && (
          <div
            className="
              flex
              items-start
              gap-2.5
              rounded-lg
              border
              border-red-500/35
              bg-red-500/[0.09]
              px-3
              py-2.5
              sm:gap-3
              sm:px-3.5
              sm:py-3
            "
          >
            <div
              className="
                mt-0.5
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-500/15
                text-red-400
              "
            >
              {attemptsExceeded ? (
                <LockKeyhole
                  size={13}
                  strokeWidth={2.2}
                />
              ) : (
                <AlertTriangle
                  size={13}
                  strokeWidth={2.2}
                />
              )}
            </div>

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
className="
  text-[10px]
  font-medium
  leading-4
  text-red-700
  dark:text-red-300
  sm:text-[11px]
  sm:leading-5
"
              >
                {attemptsExceeded
                  ? "Password change temporarily locked."
                  : "Your current password is incorrect."}
              </p>

              <p
className="
  mt-0.5
  text-[9px]
  leading-4
  text-red-600
  dark:text-red-200/80
  sm:text-[10px]
  sm:leading-4
"
              >
                {attemptsExceeded
                  ? "You have used all 3 attempts. Reset your password to continue."
                  : isLastAttempt
                    ? "You have 1 attempt left. If you do not remember your current password, we recommend resetting it now."
                    : `You have ${remainingAttempts} attempts left. If you have forgotten your current password, you can reset it instead.`}
              </p>

              <button
                type="button"
                onClick={
                  openResetDialog
                }
className="
  mt-1.5
  inline-flex
  items-center
  gap-1
  text-[9px]
  font-semibold
  text-orange-600
  transition-colors
  hover:text-orange-700
  sm:text-[10px]
"
              >
                Reset password
                <ArrowRight
                  size={11}
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            attemptsExceeded
          }
          className="
            h-9
            w-full
            rounded-lg
            bg-[var(--user-button-bg)]
            px-3
            text-[11px]
            font-semibold
            text-[var(--user-button-text)]
            transition-colors
            duration-[var(--user-transition)]
            hover:bg-[var(--user-button-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:h-10
            sm:px-4
            sm:text-sm
          "
        >
          {attemptsExceeded
            ? "Password Change Locked"
            : isSubmitting
              ? "Updating..."
              : "Update Password"}
        </button>
      </form>

      {showResetDialog && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/55
            px-3
            py-4
            backdrop-blur-[2px]
            sm:px-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-password-dialog-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeResetDialog();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[360px]
              overflow-hidden
              rounded-xl
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              shadow-[0_20px_60px_rgba(0,0,0,0.3)]
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
                border-b
                border-[var(--user-card-border)]
                px-4
                py-3
                sm:px-4.5
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-2.5
                "
              >
<div
  className="
    flex
    h-7
    w-7
    shrink-0
    items-center
    justify-center
    rounded-lg
    bg-green-500/10
    text-[var(--user-title)]
  "
>
  <Mail
    size={14}
    strokeWidth={2}
  />
</div>

                <div className="min-w-0">
                  <h3
                    id="reset-password-dialog-title"
                    className="
                      text-[11px]
                      font-semibold
                      text-[var(--user-title)]
                      sm:text-xs
                    "
                  >
                    PASSWORD RESET REQUEST
                  </h3>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      leading-4
                      text-[var(--user-text-muted)]
                      sm:text-[10px]
                    "
                  >
                    You'll receive an email with instructions to reset your password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeResetDialog
                }
                disabled={
                  resetLoading
                }
                aria-label="Close"
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[var(--user-text-muted)]
                  transition-colors
                  hover:bg-[var(--user-button-bg)]/10
                  hover:text-[var(--user-title)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X
                  size={14}
                  strokeWidth={2}
                />
              </button>
            </div>

            {resetSent ? (
              <div
                className="
                  px-4
                  py-4
                  sm:px-4.5
                  sm:py-5
                "
              >
<div
  className="
    flex
    flex-col
    items-center
  "
>
  {/* Success checkmark */}
  <div
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-full
      border-2
      border-green-500/45
      bg-green-500/[0.09]
      text-green-300
      shadow-sm
    "
  >
    <CircleCheck
      size={18}
      strokeWidth={2.4}
    />
  </div>

  {/* Success message */}
  <div
    className="
      mt-3
      w-full
      rounded-lg
      border
      border-green-500/30
      bg-green-500/[0.08]
      px-3
      py-2.5
    "
  >
    <p
      className="
        text-[10px]
        font-medium
        leading-4
        text-green-300
        sm:text-[11px]
      "
    >
      Please Check Your Mailbox or Spam/Junk Folder.
    </p>

    <p
      className="
        mt-0.5
        text-[9px]
        leading-4
        text-[var(--user-text-muted)]
        sm:text-[10px]
      "
    >
      If an account with that email exists, a password
      reset link has been sent.
    </p>
  </div>
</div>

<button
  type="button"
  onClick={
    closeResetDialog
  }
  className="
    mt-3
    h-8
    w-full
    rounded-lg
    bg-[var(--user-button-bg)]
    px-3
    text-[10px]
    font-semibold
    text-[var(--user-button-text)]
    transition-colors
    hover:bg-[var(--user-button-hover)]
    sm:h-9
    sm:text-[11px]
  "
>
  Done
</button>
</div>
) : (
  <form
    onSubmit={
      handlePasswordResetRequest
    }
    className="
      px-4
      py-4
      sm:px-4.5
      sm:py-4.5
    "
  >
    <label
      htmlFor="security-reset-email"
      className="
        block
        text-[9px]
        font-medium
        text-[var(--user-title)]
        sm:text-[10px]
      "
    >
      Email address
    </label>

    <input
      id="security-reset-email"
      type="email"
      value={resetEmail}
      onChange={(event) =>
        setResetEmail(
          event.target.value,
        )
      }
      placeholder="Enter your email"
      autoComplete="email"
      autoFocus
      disabled={
        resetLoading
      }
      className="
        mt-1.5
        h-9
        w-full
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        px-3
        text-[10px]
        text-[var(--user-title)]
        outline-none
        transition-colors
        placeholder:text-[var(--user-text-muted)]
        focus:border-green-500/45
        focus:ring-2
        focus:ring-green-500/10
        disabled:cursor-not-allowed
        disabled:opacity-60
        sm:h-10
        sm:text-[11px]
      "
    />

    <div
      className="
        mt-3
        flex
        gap-2
      "
    >
                  <button
                    type="button"
                    onClick={
                      closeResetDialog
                    }
                    disabled={
                      resetLoading
                    }
                    className="
                      h-8
                      flex-1
                      rounded-lg
                      border
                      border-[var(--user-card-border)]
                      px-3
                      text-[10px]
                      font-medium
                      text-[var(--user-title)]
                      transition-colors
                      hover:bg-[var(--user-button-bg)]/5
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:h-9
                      sm:text-[11px]
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      resetLoading ||
                      !resetEmail.trim()
                    }
                    className="
                      h-8
                      flex-[1.25]
                      rounded-lg
                      bg-[var(--user-button-bg)]
                      px-3
                      text-[10px]
                      font-semibold
                      text-[var(--user-button-text)]
                      transition-colors
                      hover:bg-[var(--user-button-hover)]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:h-9
                      sm:text-[11px]
                    "
                  >
                    {resetLoading
                      ? "Sending..."
                      : "Send reset link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}