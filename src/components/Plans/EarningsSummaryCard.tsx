"use client";

import type {
  AffiliateOverview,
} from "@/types/affiliate.types";

type EarningsSummaryCardProps = {
  overview: AffiliateOverview;
};

export default function EarningsSummaryCard({
  overview,
}: EarningsSummaryCardProps) {
  return (
    <section
      className="
        rounded-lg
        border
        p-3
        sm:rounded-[var(--user-radius-md)]
        sm:p-4
      "
      style={{
        background:
          "var(--user-card-bg)",
        borderColor:
          "var(--user-card-border)",
        boxShadow:
          "var(--user-card-shadow)",
      }}
    >
      <div
        className="
          mb-2.5
          sm:mb-4
        "
      >
        <h2
          className="
            text-sm
            font-semibold
            sm:text-base
          "
          style={{
            color:
              "var(--user-title)",
          }}
        >
          Earnings Overview
        </h2>

        <p
          className="
            mt-0.5
            text-[10px]
            leading-4
            sm:mt-1
            sm:text-xs
            sm:leading-normal
          "
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          Your affiliate performance at a glance.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-1.5
          lg:grid-cols-4
          lg:gap-3
        "
      >
        <Metric
          label="Published"
          value={overview.totalPublishedProducts.toLocaleString()}
        />

        <Metric
          label="Sales"
          value={overview.totalSales.toLocaleString()}
        />

        <Metric
          label="Revenue"
          value={`$${overview.totalRevenue.toLocaleString()}`}
        />

        <Metric
          label="Commission"
          value={`$${overview.totalCommission.toLocaleString()}`}
        />
      </div>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div
      className="
        rounded-lg
        border
        px-2
        py-2
        sm:rounded-[var(--user-radius-sm)]
        sm:px-3
        sm:py-3
      "
      style={{
        background:
          "var(--user-surface)",
        borderColor:
          "var(--user-divider)",
      }}
    >
      <p
        className="
          text-[9px]
          sm:text-[11px]
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          truncate
          text-[11px]
          font-semibold
          sm:mt-1
          sm:text-sm
        "
        style={{
          color:
            "var(--user-title)",
        }}
      >
        {value}
      </p>
    </div>
  );
}