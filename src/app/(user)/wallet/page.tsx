
import type { Metadata } from "next";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Wallet as WalletIcon,
} from "lucide-react";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import { WithdrawalStatus } from "../../../../generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Wallet",
  description: "Manage your MarkEtra wallet, deposits, and withdrawals.",
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const cardClassName = `
  group relative isolate overflow-hidden rounded-xl border
  border-[var(--dashboard-card-border)]
  bg-[var(--dashboard-card)]
  shadow-[0_10px_30px_rgba(0,0,0,.08)]
  transition-all duration-300
  hover:border-[color-mix(in_srgb,var(--dashboard-card-border)_70%,var(--primary)_30%)]
  hover:shadow-[0_18px_45px_rgba(91,92,240,.16)]
  sm:rounded-2xl
`;

function DashboardCardGlow() {
  return (
    <span
      aria-hidden="true"
      className="
        pointer-events-none absolute -right-5 top-1/2 -z-10
        h-20 w-20 -translate-y-1/2 rounded-full
        bg-[var(--dashboard-card-glow)] opacity-70 blur-[45px]
        transition-opacity duration-300 group-hover:opacity-100
        sm:-right-6 sm:h-28 sm:w-28 sm:blur-[65px]
      "
    />
  );
}

export default async function WalletPage() {
  const session = await getCurrentSession();

  if (!session) return null;

  const [wallet, user, withdrawals] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: {
        availableBalance: true,
        lockedBalance: true,
      },
    }),

    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        profit: true,
        affiliateBalance: true,
        totalDeposit: true,
      },
    }),

    prisma.withdrawal.aggregate({
      where: {
        userId: session.user.id,
        status: WithdrawalStatus.COMPLETED,
      },
      _sum: { amount: true },
    }),
  ]);

  const availableBalance = Number(wallet?.availableBalance ?? 0);
  const lockedBalance = Number(wallet?.lockedBalance ?? 0);
  const totalProfit = Number(user?.profit ?? 0);
  const affiliateBalance = Number(user?.affiliateBalance ?? 0);
  const totalDeposits = Number(user?.totalDeposit ?? 0);
  const totalWithdrawals = Number(withdrawals._sum.amount ?? 0);

  const stats = [
    {
      label: "Deposits",
      value: formatCurrency(totalDeposits),
      description: "Total deposited",
      icon: ArrowDownLeft,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      label: "Withdrawals",
      value: formatCurrency(totalWithdrawals),
      description: "Completed withdrawals",
      icon: ArrowUpRight,
      color: "text-orange-400",
      background: "bg-orange-500/10",
    },
    {
      label: "Profits",
      value: formatCurrency(totalProfit),
      description: "Current profit balance",
      icon: ChartNoAxesCombined,
      color: "text-sky-400",
      background: "bg-sky-500/10",
    },
    {
      label: "Affiliate Commission",
      value: formatCurrency(affiliateBalance),
      description: "Affiliate balance",
      icon: CircleDollarSign,
      color: "text-violet-400",
      background: "bg-violet-500/10",
    },
  ];

  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[{ label: "Wallet" }]}
    >
<div className="space-y-5 pb-8 sm:space-y-6 sm:pb-10">

        {/* Wallet balance */}
        <section className={`${cardClassName} p-4 sm:p-5`}>
          <DashboardCardGlow />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5b5cf0] text-white">
                  <WalletIcon size={18} strokeWidth={2.2} />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5a9ff]">
                    Wallet Overview
                  </p>
                  <h2 className="mt-0.5 text-xs font-medium text-[var(--foreground-muted)] sm:text-sm">
                    Available Balance
                  </h2>
                </div>
              </div>

              <p className="break-words text-2xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
                {formatCurrency(availableBalance)}
              </p>

              {lockedBalance > 0 && (
                <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                  Locked:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatCurrency(lockedBalance)}
                  </span>
                </p>
              )}
            </div>

            <div className="relative grid grid-cols-2 gap-2 sm:flex">
              <NavigationLink
                href="/Deposit"
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#5b5cf0] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#4b4edb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7779ff] sm:min-h-10 sm:px-4 sm:text-sm"
              >
                <ArrowDownLeft size={15} />
                Deposit
              </NavigationLink>

              <NavigationLink
                href="/Withdraw"
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--dashboard-card-border)] bg-[var(--dashboard-card)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[color-mix(in_srgb,var(--dashboard-card-border)_70%,var(--primary)_30%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7779ff] sm:min-h-10 sm:px-4 sm:text-sm"
              >
                <ArrowUpRight size={15} />
                Withdraw
              </NavigationLink>
            </div>
          </div>
        </section>

        {/* Financial overview */}
        <section aria-labelledby="wallet-overview-heading">
          <div className="mb-3">
            <h2
              id="wallet-overview-heading"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg"
            >
              <span className="h-5 w-1 rounded-full bg-[#5b5cf0]" />
              Financial Overview
            </h2>

            <p className="mt-1 pl-3 text-xs text-[var(--foreground-muted)] sm:text-sm">
              Your deposits, withdrawals, and earnings.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className={`${cardClassName} min-w-0 p-3 sm:p-4`}
                >
                  <DashboardCardGlow />

                  <div className="relative mb-3 flex items-center justify-between gap-2">
                    <h3 className="min-w-0 text-xs font-semibold leading-4 text-[var(--foreground)] sm:text-sm">
                      {stat.label}
                    </h3>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${stat.background} ${stat.color} sm:h-9 sm:w-9`}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                  </div>

                  <p className="relative break-words text-base font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-xl">
                    {stat.value}
                  </p>

                  <p className="relative mt-1.5 text-[10px] leading-4 text-[var(--foreground-muted)] sm:text-xs">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>


{/* Wallet Summary */}
<section aria-labelledby="wallet-summary-heading">
  <div className="mb-3">
    <h2
      id="wallet-summary-heading"
      className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg"
    >
      <span className="h-5 w-1 rounded-full bg-[#5b5cf0]" />
      Wallet Summary
    </h2>

    <p className="mt-1 pl-3 text-xs text-[var(--foreground-muted)] sm:text-sm">
      A quick look at your current wallet position.
    </p>
  </div>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    <article className={`${cardClassName} min-w-0 p-3 sm:p-4`}>
      <DashboardCardGlow />

      <p className="relative text-[11px] font-medium text-[var(--foreground-muted)] sm:text-xs">
        Available Balance
      </p>

      <p className="relative mt-2 break-words text-base font-bold tracking-tight text-[var(--foreground)] sm:text-xl">
        {formatCurrency(availableBalance)}
      </p>

      <p className="relative mt-1 text-[10px] text-emerald-400 sm:text-xs">
        Ready to use
      </p>
    </article>

    <article className={`${cardClassName} min-w-0 p-3 sm:p-4`}>
      <DashboardCardGlow />

      <p className="relative text-[11px] font-medium text-[var(--foreground-muted)] sm:text-xs">
        Locked Funds
      </p>

      <p className="relative mt-2 break-words text-base font-bold tracking-tight text-[var(--foreground)] sm:text-xl">
        {formatCurrency(lockedBalance)}
      </p>

      <p className="relative mt-1 text-[10px] text-amber-400 sm:text-xs">
        {lockedBalance > 0 ? "Currently locked" : "No locked funds"}
      </p>
    </article>

    <article className={`${cardClassName} col-span-2 min-w-0 p-3 sm:col-span-1 sm:p-4`}>
      <DashboardCardGlow />

      <p className="relative text-[11px] font-medium text-[var(--foreground-muted)] sm:text-xs">
        Total Wallet Funds
      </p>

      <p className="relative mt-2 break-words text-base font-bold tracking-tight text-[var(--foreground)] sm:text-xl">
        {formatCurrency(availableBalance + lockedBalance)}
      </p>

      <p className="relative mt-1 text-[10px] text-[#a5a9ff] sm:text-xs">
        Available + locked
      </p>
    </article>
  </div>
</section>

      </div>
    </DashboardPageLayout>
  );
}
