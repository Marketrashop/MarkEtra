
"use client";

import { motion } from "framer-motion";

import {
  ArrowRight,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import PricingPlanFeature from "./PricingPlanFeature";

import {
  PRICING_CARD_HOVER_SHADOW,
  PRICING_CARD_REST_SHADOW,
  PRICING_CARD_RADIUS,
  PRICING_CARD_TRANSITION,
  PRICING_CARD_HOVER_Y,
} from "./pricingPlans.constants";

import { PricingPlan } from "./pricingPlans.types";

type PricingPlanCardProps = {
  plan: PricingPlan;
  current?: boolean;
};

export default function PricingPlanCard({
  plan,
  current = false,
}: PricingPlanCardProps) {
  const router = useRouter();

  function handlePlanClick() {
    if (current) {
      return;
    }

    router.push(
      "/Auth?redirect=/plans",
    );
  }

  const buttonLabel =
    current
      ? "Current"
      : "Subscribe";

  return (
    <motion.article
      whileHover={{
        y: PRICING_CARD_HOVER_Y,
        boxShadow:
          PRICING_CARD_HOVER_SHADOW,
      }}
      transition={{
        duration:
          PRICING_CARD_TRANSITION,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        relative
        overflow-hidden
        border
        bg-[var(--surface-card)]
        px-4
        pt-5
        pb-6

        sm:px-7
        sm:pt-8
        sm:pb-9
      "
      style={{
        borderRadius:
          PRICING_CARD_RADIUS,

        borderColor:
          current
            ? "var(--primary)"
            : "#282E7E",

        boxShadow:
          PRICING_CARD_REST_SHADOW,
      }}
    >
      {/* Top right glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-40
          w-40
          rounded-full
          blur-3xl
        "
        style={{
          background:
            "radial-gradient(circle, rgba(86,88,236,.78) 0%, rgba(86, 88, 236, 0.99) 34%, transparent 65%)",
        }}
      />

      <div
        className="
          relative
          z-10
        "
      >
        {/* Plan Name */}
        <div
          className="
            flex
            items-center
            justify-center
            gap-1.5
            sm:gap-2
          "
        >
          <h3
            className="
              text-center
              text-[28px]
              font-extrabold
              text-[var(--foreground)]

              sm:text-[40px]
            "
          >
            {plan.name}
          </h3>

          {current && (
            <span
              className="
                rounded-full
                px-2
                py-1
                text-[9px]
                font-bold
                uppercase

                sm:px-2.5
                sm:text-[10px]
              "
              style={{
                background:
                  "var(--user-badge-success-bg)",

                color:
                  "var(--user-badge-success-text)",
              }}
            >
              Current
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className="
            mt-3
            mb-3
            h-px
            w-full
            bg-[#282E7E]
            opacity-50

            sm:mt-5
            sm:mb-5
          "
        />

        {/* Price */}
        <div className="text-center">
          <span
            className="
              mr-1
              text-[22px]
              font-semibold
              text-[var(--foreground)]

              sm:mr-1.5
              sm:text-[28px]
            "
          >
            $
          </span>

          <span
            className="
              text-[29px]
              font-semibold
              tracking-[-0.02em]
              text-[var(--foreground)]

              sm:text-[35px]
            "
          >
            {plan.price.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </span>

          <span
            className="
              ml-1
              text-[14px]
              font-semibold
              text-[var(--foreground-muted)]

              sm:text-[18px]
            "
          >
            /m
          </span>
        </div>

        {/* Features */}
        <ul
          className="
            mt-5
            space-y-3

            sm:mt-8
            sm:space-y-4
          "
        >
          {plan.features.map(
            (feature) => (
              <PricingPlanFeature
                key={feature}
                text={feature}
              />
            ),
          )}
        </ul>

        {/* Button */}
        <button
          type="button"
          disabled={current}
          onClick={handlePlanClick}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            px-4
            py-3
            text-sm
            font-bold
            transition-all
            duration-300
            disabled:cursor-not-allowed
            disabled:opacity-70

            sm:mt-10
            sm:px-9
            sm:py-4
            sm:text-base
          "
          style={{
            background:
              current
                ? "var(--surface)"
                : "#5658EC",

            color:
              current
                ? "var(--foreground-muted)"
                : "#ffffff",

            border:
              current
                ? "1px solid var(--border)"
                : "none",
          }}
        >
          {buttonLabel}

          {!current && (
            <ArrowRight size={20} />
          )}
        </button>
      </div>
    </motion.article>
  );
}
