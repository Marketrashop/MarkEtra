"use client";

import Link from "next/link";
import {
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { toast } from "sonner";

import {
  ArrowRight,
  Mail,
  User,
  Users,
} from "lucide-react";

import { validateRegister } from "./AuthValidation";
import AuthButton from "./AuthButton";
import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthTabs from "./AuthTabs";
import PasswordField from "./PasswordField";

import { CountrySelect } from "@/components/ui/CountrySelect";
import type { Country } from "@/lib/countries";



export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  confirmPassword: string;
  heardFrom: string;
  referralCode: string;
  acceptedTerms: boolean;
};

type RegisterFormProps = {
  loading?: boolean;

  loadingText?: string;

  onSubmit?: (
    values: RegisterFormValues,
  ) => void;

  onSignIn?: () => void;
};

export default function RegisterForm({
  loading,
  loadingText,
  onSubmit,
  onSignIn,
}: RegisterFormProps) {

const [heardFrom, setHeardFrom] =
  useState("");

const [country, setCountry] =
  useState<Country | "">("");

const hasSubmitted =
  useRef(false);


function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  if (
    loading ||
    hasSubmitted.current
  ) {
    return;
  }

  const form =
    new FormData(event.currentTarget);

  const values: RegisterFormValues = {
    firstName: String(
      form.get("firstName") ?? "",
    ).trim(),

    lastName: String(
      form.get("lastName") ?? "",
    ).trim(),

    email: String(
      form.get("email") ?? "",
    ).trim(),

    phoneNumber: String(
      form.get("phoneNumber") ?? "",
    ).trim(),

    country,

    password: String(
      form.get("password") ?? "",
    ),

    confirmPassword: String(
      form.get("confirmPassword") ?? "",
    ),

    heardFrom: String(
      form.get("heardFrom") ?? "",
    ),

    referralCode: String(
      form.get("referralCode") ?? "",
    ),

    acceptedTerms:
      form.get("terms") === "on",
  };

  const validation =
    validateRegister(values);

  if (!validation.success) {
    toast.error(
      validation.message,
    );

    return;
  }

  hasSubmitted.current =
    true;

  onSubmit?.(values);
}

  return (
    <AuthForm
    
      title="Create Your Account"
      description="
        Join MarkEtra and start building your online business today.
      "
      footer={
<p
  className="
    text-center
    text-[12px]
    sm:text-[13px]
    text-[var(--foreground-muted)]
  "
>
          Already have an account?{" "}

          <button
            type="button"
            onClick={onSignIn}
disabled={
  loading ||
  hasSubmitted.current
}
            className="
              font-semibold
              text-[var(--primary)]
              transition-opacity
              duration-300
              hover:opacity-80
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Sign In
          </button>
        </p>
      }
    >
      <div
className="
  mb-3
"
>
<AuthTabs
  value="register"
  onChange={(value) => {
    if (
      hasSubmitted.current
    ) {
      return;
    }

    if (
      value ===
      "login"
    ) {
      onSignIn?.();
    }
  }}
/>
</div>

      <form
        onSubmit={handleSubmit}
        className="
          space-y-3
        "
      >
        <div
          className="
            grid
            gap-3
            sm:gap-4
            sm:grid-cols-2
          "
        >
          <AuthInput
            id="firstName"
            name="firstName"
            label="First Name"
            placeholder="First name"
            autoComplete="given-name"
            required
            disabled={loading}
            leftIcon={
              <User size={17} />
            }
          />

          <AuthInput
            id="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Last name (optional)"
            autoComplete="family-name"
            disabled={loading}
            leftIcon={
              <User size={17} />
            }
          />
        </div>

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={loading}
          leftIcon={
            <Mail size={17} />
          }
        />

        <AuthInput
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          label="Phone Number"
          placeholder="+1 (800) 000 0000"
          autoComplete="tel"
          inputMode="tel"
          required
          disabled={loading}
          leftIcon={
            <User size={17} />
          }
          onKeyDown={(event) => {
            const key =
              event.key;

            const input =
              event.currentTarget;

            const cursorPosition =
              input.selectionStart ?? 0;

            const allowedControlKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "Home",
              "End",
              "Tab",
            ];

            if (
              allowedControlKeys.includes(
                key,
              ) ||
              event.ctrlKey ||
              event.metaKey
            ) {
              return;
            }

            if (/^\d$/.test(key)) {
              return;
            }

            if (
              key === "+" &&
              cursorPosition === 0 &&
              !input.value.includes("+")
            ) {
              return;
            }

            if (
              key === "(" ||
              key === ")"
            ) {
              return;
            }

            if (
              key === " " &&
              cursorPosition > 0 &&
              input.value[
                cursorPosition - 1
              ] !== " "
            ) {
              return;
            }

            event.preventDefault();
          }}
          onInput={(event) => {
            const input =
              event.currentTarget;

            let value =
              input.value;

            value = value.replace(
              /[^0-9+() ]/g,
              "",
            );

            value = value.replace(
              /\s{2,}/g,
              " ",
            );

            value = value.replace(
              /^\s+/,
              "",
            );

            const plusIndex =
              value.indexOf("+");

            if (plusIndex > 0) {
              value =
                value.replace(/\+/g, "");

              value =
                "+" + value;
            } else if (
              plusIndex === 0
            ) {
              value =
                "+" +
                value
                  .slice(1)
                  .replace(/\+/g, "");
            }

            input.value =
              value;
          }}
          onPaste={(event) => {
            event.preventDefault();

            const input =
              event.currentTarget;

            const pasted =
              event.clipboardData.getData(
                "text",
              );

            let cleaned =
              pasted.replace(
                /[^0-9+() ]/g,
                "",
              );

            cleaned =
              cleaned.replace(
                /\s{2,}/g,
                " ",
              );

            cleaned =
              cleaned.replace(
                /^\s+/,
                "",
              );

            const existingValue =
              input.value;

            const start =
              input.selectionStart ??
              existingValue.length;

            const end =
              input.selectionEnd ??
              existingValue.length;

            let nextValue =
              existingValue.slice(
                0,
                start,
              ) +
              cleaned +
              existingValue.slice(
                end,
              );

            nextValue =
              nextValue.replace(
                /[^0-9+() ]/g,
                "",
              );

            nextValue =
              nextValue.replace(
                /\s{2,}/g,
                " ",
              );

            nextValue =
              nextValue.replace(
                /^\s+/,
                "",
              );

            const plusIndex =
              nextValue.indexOf("+");

            if (plusIndex > 0) {
              nextValue =
                nextValue.replace(
                  /\+/g,
                  "",
                );

              nextValue =
                "+" + nextValue;
            } else if (
              plusIndex === 0
            ) {
              nextValue =
                "+" +
                nextValue
                  .slice(1)
                  .replace(/\+/g, "");
            }

            input.value =
              nextValue;
          }}
        />

        <CountrySelect
          label="Country"
          value={country}
          onChange={(country: Country) => {
            setCountry(country);
          }}
        />

        <input
          type="hidden"
          name="country"
          value={country}
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          required
          disabled={loading}
          showStrength
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
          disabled={loading}
        />

        <div>
          <label
            htmlFor="heardFrom"
            className="
              mb-1.5
              block
              text-[12px]
              sm:text-[13px]
              font-semibold
              text-[var(--foreground)]
            "
          >
            How did you hear about MarkEtra?
          </label>

          <div
            className="
              flex
              h-10
              sm:h-11
              items-center
              gap-2.5
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-3
              sm:px-3.5
              transition-all
              duration-300
              focus-within:border-[var(--primary)]
              focus-within:ring-2
              focus-within:ring-[var(--primary)]/20
            "
          >
            <select
              id="heardFrom"
              name="heardFrom"
              value={heardFrom}
              disabled={loading}
              onChange={(event) => {
                const value =
                  event.target.value;

                setHeardFrom(value);

                if (
                  value !== "affiliate"
                ) {
                  const input =
                    document.getElementById(
                      "referralCode",
                    ) as
                      | HTMLInputElement
                      | null;

                  if (input) {
                    input.value = "";
                  }
                }
              }}
              className="
                h-full
                w-full
                border-0
                bg-transparent
                text-[13px]
                sm:text-[14px]
                text-[var(--foreground)]
                outline-none
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <option value="">
                Select an option (optional)
              </option>

              <option value="google">
                Google Search
              </option>

              <option value="youtube">
                YouTube
              </option>

              <option value="instagram">
                Instagram
              </option>

              <option value="facebook">
                Facebook
              </option>

              <option value="tiktok">
                TikTok
              </option>

              <option value="x">
                X (Twitter)
              </option>

              <option value="friend">
                Friend or Colleague
              </option>

              <option value="affiliate">
                Affiliate / Referral
              </option>

              <option value="blog">
                Blog or Article
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {heardFrom === "affiliate" && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -8,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                overflow-hidden
              "
            >
              <AuthInput
                id="referralCode"
                name="referralCode"
                label="Referral Code"
                placeholder="Enter your referral code"
                disabled={loading}
                leftIcon={
                  <Users size={17} />
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        <label
          className="
            flex
            cursor-pointer
            items-start
            gap-2.5
            sm:gap-3
            text-[12px]
            sm:text-[13px]
            leading-5
            sm:leading-6
            text-[var(--foreground-muted)]
          "
        >
          <input
            type="checkbox"
            name="terms"
            required
            disabled={loading}
            className="
              mt-0.5
              h-3.5
              w-3.5
              sm:mt-1
              sm:h-4
              sm:w-4
              rounded
              border-[var(--border)]
              accent-[var(--primary)]
            "
          />

          <span>
            I agree to{" "}

            <Link
              href="/Terms"
              className="
                font-medium
                text-[var(--primary)]
              "
            >
              Terms & Conditions
            </Link>

            {" "}and{" "}

            <Link
              href="/Privacy"
              className="
                font-medium
                text-[var(--primary)]
              "
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <AuthButton
          type="submit"
          loading={loading}
          disabled={
            hasSubmitted.current
          }
          loadingText={loadingText}
          rightIcon={
            <ArrowRight size={17} />
          }
        >
          Create Account
        </AuthButton>
      </form>
    </AuthForm>
  );
}