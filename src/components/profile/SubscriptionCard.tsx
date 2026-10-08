"use client";

import Link from "next/link";

import {
  ArrowRight,
  Calendar,
  Coins,
  Package,
  BadgePlus,
} from "lucide-react";

import { motion } from "framer-motion";

import { useCurrentSubscription } from "@/hooks/useCurrentSubscription";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

type SubscriptionCardProps = {
  onNavigate?: () => void;
};

export default function SubscriptionCard({
  onNavigate,
}: SubscriptionCardProps) {
  const {
    subscription,
    loading,
    hasActiveSubscription,
  } = useCurrentSubscription();

  if (loading) {
    return (
      <div
        className="
          h-16
          w-full
          animate-pulse
          rounded-lg
          border
          border-[var(--profile-menu-divider)]
          bg-[var(--profile-menu-hover)]
          sm:h-[72px]
        "
      />
    );
  }

  if (!hasActiveSubscription || !subscription) {
    return (
      <motion.div
        whileHover={{ y: -1.5 }}
        transition={{ duration: 0.18 }}
        className="
          w-full
          overflow-hidden
          rounded-lg
          border
          border-white/10
          bg-gradient-to-br
          from-[#1b2256]
          via-[#232d72]
          to-[#2b3688]
          p-2
          text-white
          shadow-[0_16px_40px_rgba(26,38,100,.28)]
          sm:p-3
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <BadgePlus
              size={12}
              className="shrink-0 text-yellow-300"
            />

            <span
              className="
                truncate
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-white/75
                sm:text-[8px]
                sm:tracking-[0.12em]
              "
            >
              Marketplace Access
            </span>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              border
              border-white/15
              bg-white/10
              px-1.5
              py-0.5
              text-[7px]
              font-semibold
            "
          >
            Upgrade
          </span>
        </div>

        <h3
          className="
            mt-1.5
            text-[12px]
            font-bold
            sm:mt-2
            sm:text-[15px]
          "
        >
          Unlock Premium Access
        </h3>

        <p
          className="
            mt-0.5
            text-[8px]
            leading-3.5
            text-white/80
            sm:mt-1
            sm:text-[10px]
            sm:leading-4
          "
        >
          Unlock exclusive affiliate benefits,
          premium marketplace tools, and the
          ability to publish and earn from your
          own products.
        </p>

        <div
          className="
            mt-1.5
            space-y-0.5
            sm:mt-2
            sm:space-y-1
          "
        >
          {[
            "Access Affiliate Tools",
            "Earn Affiliate Commissions",
            "Publish and Earn From Your Own Products",
          ].map((feature) => (
            <div
              key={feature}
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <div
                className="
                  flex
                  h-3
                  w-3
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/15
                  text-[7px]
                  font-bold
                "
              >
                ✓
              </div>

              <span
                className="
                  truncate
                  text-[8px]
                  text-white/90
                  sm:text-[10px]
                "
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/plans"
          onClick={onNavigate}
          className="
            group
            mt-2
            flex
            h-7
            items-center
            justify-center
            gap-1.5
            rounded-md
            bg-[#5b5cf0]
            px-2
            text-[9px]
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-[#6d6ef7]
            sm:mt-2.5
            sm:h-auto
            sm:py-1.5
            sm:text-[10px]
          "
        >
          Explore Plans

          <ArrowRight
            size={11}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5
            "
          />
        </Link>
      </motion.div>
    );
  }

  const { plan } = subscription;

  const startedAt =
    new Date(subscription.createdAt).getTime();

  const expiresAt =
    new Date(
      subscription.expiresAt,
    ).getTime();

  const now = Date.now();

  const totalDuration =
    expiresAt - startedAt;

  const remainingDuration =
    Math.max(
      expiresAt - now,
      0,
    );

  const remainingPercentage =
    totalDuration > 0
      ? (remainingDuration /
          totalDuration) *
        100
      : 0;

  return (
    <motion.div
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.18 }}
      style={{
        background: `
          linear-gradient(
            135deg,
            rgba(255,255,255,.04),
            rgba(255,255,255,.015)
          ),
          linear-gradient(
            135deg,
            ${plan.badgeColor}20,
            transparent 75%
          )
        `,
        boxShadow: `
          0 8px 22px rgba(0,0,0,.18),
          0 0 16px ${plan.badgeColor}22
        `,
      }}
      className="
        relative
        w-full
        overflow-hidden
        rounded-lg
        border
        border-[var(--profile-menu-divider)]
        p-2
        sm:p-2
      "
    >
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
        "
        style={{
          background: `radial-gradient(circle at top right, ${plan.badgeColor}, transparent 74%)`,
        }}
      />

      <motion.div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          className="
            absolute
            -left-24
            top-0
            h-full
            w-20
            rotate-12
            bg-white/6
            blur-md
          "
          animate={{
            x: ["-120%", "220%"],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </motion.div>

      <div className="relative">
        <div
          className="
            flex
            items-start
            justify-between
            gap-1.5
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--profile-menu-muted)]
              "
            >
              Active Plan
            </p>

            <h3
              className="
                mt-0.5
                truncate
                text-[11px]
                font-bold
                text-[var(--profile-menu-title)]
              "
            >
              {plan.name}
            </h3>
          </div>

          <div
            className="
              shrink-0
              rounded-full
              px-1.5
              py-[2px]
              text-[7px]
              font-semibold
              text-white
            "
            style={{
              background: plan.badgeColor,
            }}
          >
            {plan.badgeName}
          </div>
        </div>

        <div
          className="
            mt-1.5
            flex
            items-center
            justify-between
            gap-2
          "
        >
          <div className="min-w-0">
            <div className="text-[14px] font-bold leading-none">
              {formatPrice(plan.price)}
            </div>

            <div
              className="
                mt-0.5
                text-[8px]
                text-[var(--profile-menu-muted)]
              "
            >
              {plan.durationInDays} Days
            </div>
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
            "
          >
            <ProgressRing
              progress={remainingPercentage}
              color={plan.badgeColor}
            />

            <div className="text-right leading-tight">
              <div
                className="
                  text-[7px]
                  text-[var(--profile-menu-muted)]
                "
              >
                Expires
              </div>

              <div
                className="
                  whitespace-nowrap
                  text-[8px]
                  font-semibold
                "
              >
                {formatDate(
                  subscription.expiresAt,
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-1.5
            grid
            grid-cols-3
            gap-1
          "
        >
          <Stat
            icon={Coins}
            value={`${subscription.commissionRate}%`}
            label="Comm."
          />

          <Stat
            icon={Package}
            value={`${subscription.maxPublishedProducts}`}
            label="Products"
          />

          <Stat
            icon={Calendar}
            value={`${plan.durationInDays}D`}
            label="Length"
          />
        </div>

        <Link
          href="/plans"
          onClick={onNavigate}
          className="
            mt-1.5
            flex
            h-6
            items-center
            justify-center
            gap-1.5
            rounded-md
            border
            border-[var(--profile-menu-divider)]
            bg-[var(--background)]
            px-2
            text-[8px]
            font-semibold
            transition-colors
            hover:border-[#5b5cf0]
            hover:text-[#5b5cf0]
            sm:mt-2
            sm:h-auto
            sm:py-1
            sm:text-[8px]
          "
        >
          Manage Plan

          <ArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

type StatProps = {
  icon: React.ElementType;
  value: string;
  label: string;
};

function Stat({
  icon: Icon,
  value,
  label,
}: StatProps) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
        justify-center
        rounded-md
        border
        border-[var(--profile-menu-divider)]
        bg-[var(--background)]
        px-1
        py-1
        sm:py-1.5
      "
    >
      <Icon
        size={10}
        className="text-[#5b5cf0]"
      />

      <span
        className="
          mt-0.5
          max-w-full
          truncate
          text-[8px]
          font-bold
          leading-none
          text-[var(--profile-menu-title)]
        "
      >
        {value}
      </span>

      <span
        className="
          mt-0.5
          text-[6px]
          uppercase
          tracking-wide
          text-[var(--profile-menu-muted)]
        "
      >
        {label}
      </span>
    </div>
  );
}

function ProgressRing({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const radius = 14;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div
      className="
        relative
        flex
        h-8
        w-8
        items-center
        justify-center
        sm:h-9
        sm:w-9
      "
    >
      <svg
        width="32"
        height="32"
        className="-rotate-90 sm:h-9 sm:w-9"
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke="rgba(255,255,255,.08)"
          strokeWidth="3"
          fill="none"
        />

        <motion.circle
          cx="18"
          cy="18"
          r={radius}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset:
              circumference,
          }}
          animate={{
            strokeDashoffset:
              offset,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      </svg>

      <span
        className="
          absolute
          text-[6px]
          font-bold
          sm:text-[7px]
        "
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
}