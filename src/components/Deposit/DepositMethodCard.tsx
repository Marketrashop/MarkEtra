"use client";

import {
  useState,
} from "react";

import Image from "next/image";

import {
  Check,
  Copy,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import type {
  DepositMethod,
} from "./deposit.types";

type DepositMethodCardProps = {
  method: DepositMethod;
};

export default function DepositMethodCard({
  method,
}: DepositMethodCardProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        try {
          await navigator.clipboard.writeText(
            method.address
          );

          setCopied(true);

          setTimeout(() => {
            setCopied(false);
          }, 2000);

          return;
        } catch {
          // Clipboard API unavailable or blocked.
          // Fall back to the legacy copy method.
        }
      }

      const textarea =
        document.createElement("textarea");

      textarea.value =
        method.address;

      textarea.style.position =
        "fixed";

      textarea.style.opacity =
        "0";

      textarea.style.pointerEvents =
        "none";

      document.body.appendChild(
        textarea
      );

      textarea.focus();

      textarea.select();

      const copied =
        document.execCommand("copy");

      document.body.removeChild(
        textarea
      );

      if (!copied) {
        throw new Error(
          "Copy command failed"
        );
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy wallet address:",
        error
      );
    }
  }

  return (
    <section
      className="
        mt-4
        overflow-hidden
        rounded-[var(--deposit-method-card-radius)]
        border
        border-[var(--deposit-method-card-border)]
        bg-[var(--deposit-method-card-bg)]
        shadow-[var(--deposit-method-card-shadow)]
        transition-all
        duration-[var(--deposit-method-card-transition)]
        sm:mt-6
      "
    >
      {/* Method Header */}

      <div
        className="
          flex
          flex-col
          gap-2.5
          p-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
          sm:p-[var(--deposit-method-card-padding)]
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
            sm:gap-4
          "
        >
          <div
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              bg-[var(--deposit-method-card-icon-bg)]
              sm:h-14
              sm:w-14
              sm:rounded-2xl
            "
          >
            <Image
              src={method.icon}
              alt={method.name}
              fill
              sizes="56px"
              className="
                object-contain
                p-1.5
                sm:p-2
              "
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-[13px]
                font-bold
                text-[var(--deposit-method-card-title)]
                sm:text-[18px]
              "
            >
              {method.name}
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[var(--deposit-method-card-subtitle)]
                sm:mt-1
                sm:text-[14px]
              "
            >
              {method.symbol}
            </p>
          </div>
        </div>

        <div
          className="
            self-start
            rounded-full
            border
            border-[var(--deposit-method-card-border)]
            px-2
            py-1
            text-[9px]
            font-medium
            text-[var(--deposit-method-card-subtitle)]
            sm:self-auto
            sm:px-3
            sm:py-1.5
            sm:text-xs
          "
        >
          {method.symbol} Network
        </div>
      </div>

      {/* Payment Details */}

      <div
        className="
          border-t
          border-[var(--deposit-method-card-border)]
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[minmax(280px,0.9fr)_1px_minmax(0,1.1fr)]
          "
        >
          {/* QR Code */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              p-4
              sm:p-8
            "
          >
            <div
              className="
                text-center
              "
            >
              <h3
                className="
                  text-[14px]
                  font-bold
                  text-[var(--deposit-qr-title)]
                  sm:text-lg
                "
              >
                Scan QR Code
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-4
                  text-[var(--deposit-qr-subtitle)]
                  sm:mt-2
                  sm:text-sm
                  sm:leading-normal
                "
              >
                Scan using your preferred
                wallet application.
              </p>
            </div>

            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                sm:mt-6
              "
            >
              <AnimatePresence
                mode="wait"
              >
                <motion.div
                  key={method.id}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="
                    overflow-hidden
                    rounded-xl
                    bg-[var(--deposit-qr-bg)]
                    p-1.5
                    sm:rounded-2xl
                    sm:p-2
                  "
                >
                  <Image
                    src={method.qrCode}
                    alt={`${method.name} QR Code`}
                    width={220}
                    height={220}
                    className="
                      h-[var(--deposit-qr-image-size-mobile)]
                      w-[var(--deposit-qr-image-size-mobile)]
                      rounded-lg
                      object-contain
                      sm:h-[var(--deposit-qr-image-size-desktop)]
                      sm:w-[var(--deposit-qr-image-size-desktop)]
                      sm:rounded-xl
                    "
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <p
              className="
                mt-2.5
                text-center
                text-[9px]
                text-[var(--deposit-qr-subtitle)]
                sm:mt-4
                sm:text-xs
              "
            >
              Scan to open your wallet
            </p>
          </div>

          {/* Divider */}

          <div
            className="
              relative
              hidden
              w-px
              bg-[var(--deposit-method-card-border)]
              lg:block
            "
          >
            <span
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-[var(--deposit-method-card-border)]
                bg-[var(--deposit-method-card-bg)]
                px-3
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[var(--deposit-method-card-subtitle)]
              "
            >
              OR
            </span>
          </div>

          {/* Wallet Address */}

          <div
            className="
              flex
              flex-col
              justify-center
              p-4
              sm:p-8
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[var(--deposit-address-title)]
                  sm:text-sm
                "
              >
                Wallet Address
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-4
                  text-[var(--deposit-address-muted)]
                  sm:mt-2
                  sm:text-sm
                  sm:leading-6
                "
              >
                Send only {method.symbol} to
                this address.
              </p>
            </div>

            {/* Address + Copy */}

            <div
              className="
                mt-3
                flex
                min-w-0
                items-stretch
                sm:mt-5
              "
            >
              <motion.div
                key={method.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  min-w-0
                  flex-1
                  break-all
                  rounded-l-lg
                  border
                  border-r-0
                  border-[var(--deposit-address-border)]
                  bg-[var(--deposit-address-bg)]
                  p-2.5
                  text-[10px]
                  leading-4
                  text-[var(--deposit-address-text)]
                  sm:rounded-l-2xl
                  sm:p-4
                  sm:text-sm
                  sm:leading-6
                "
              >
                {method.address}
              </motion.div>

              <button
                type="button"
                onClick={handleCopy}
                aria-label={
                  copied
                    ? "Address copied"
                    : "Copy wallet address"
                }
                title={
                  copied
                    ? "Copied"
                    : "Copy address"
                }
                className={`
                  flex
                  h-auto
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-r-lg
                  border
                  border-[var(--deposit-address-copy-border)]
                  transition-all
                  duration-[var(--deposit-address-transition)]
                  sm:w-12
                  sm:rounded-r-2xl
                  ${
                    copied
                      ? `
                          bg-[var(--deposit-address-copy-success-bg)]
                          text-[var(--deposit-address-copy-success-text)]
                        `
                      : `
                          bg-[var(--deposit-address-copy-bg)]
                          text-[var(--deposit-address-copy-text)]
                          hover:bg-[var(--deposit-address-copy-hover)]
                          hover:text-[var(--deposit-address-copy-hover-text)]
                        `
                  }
                `}
              >
                <AnimatePresence
                  mode="wait"
                >
                  <motion.span
                    key={
                      copied
                        ? "copied"
                        : "copy"
                    }
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {copied ? (
                      <Check
                        size={15}
                        className="
                          sm:h-[18px]
                          sm:w-[18px]
                        "
                      />
                    ) : (
                      <Copy
                        size={15}
                        className="
                          sm:h-[18px]
                          sm:w-[18px]
                        "
                      />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <p
              className="
                mt-2.5
                text-center
                text-[9px]
                leading-4
                text-[var(--deposit-address-muted)]
                sm:mt-4
                sm:text-xs
                sm:leading-5
              "
            >
              Only send {method.symbol} to this address. Sending any other cryptocurrency may result in permanent loss of funds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}