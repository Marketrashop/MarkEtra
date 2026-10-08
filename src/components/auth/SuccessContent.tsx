"use client";

import Link from "next/link";

import {
  ArrowRight,
  CircleCheckBig,
} from "lucide-react";

import AuthButton from "./AuthButton";
import AuthCard from "./AuthCard";

type SuccessContentProps = {
  title: string;

  description: string;

  buttonLabel?: string;

  buttonHref?: string;
};

export default function SuccessContent({
  title,

  description,

  buttonLabel = "Continue",

  buttonHref = "/Auth",
}: SuccessContentProps) {
  return (
    <AuthCard>
      <div
        className="
          text-center
        "
      >
        <div
          className="
            mx-auto

            flex

            h-14
            w-14

            sm:h-16
            sm:w-16

            items-center

            justify-center

            rounded-full

            bg-emerald-500/10

            text-emerald-500
          "
        >
          <CircleCheckBig
            size={28}
            className="
              sm:h-8
              sm:w-8
            "
          />
        </div>

        <h1
          className="
            mt-5

            text-[22px]
            sm:text-[26px]

            font-extrabold

            leading-tight

            text-[var(--foreground)]
          "
        >
          {title}
        </h1>

        <p
          className="
            mx-auto

            mt-2.5

            max-w-[320px]
            sm:max-w-[340px]

            text-[13px]
            sm:text-[14px]

            leading-6
            sm:leading-7

            text-[var(--foreground-muted)]
          "
        >
          {description}
        </p>

        <div
          className="
            mt-6
            sm:mt-8
          "
        >
          <Link
            href={buttonHref}
          >
            <AuthButton
              rightIcon={
                <ArrowRight
                  size={16}
                />
              }
            >
              {buttonLabel}
            </AuthButton>
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}