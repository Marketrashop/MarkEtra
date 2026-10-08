"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import EarningsSummaryCard from "@/components/Plans/EarningsSummaryCard";

import EarningsHistoryTable from "@/components/Plans/EarningsHistoryTable";

import type {
  AffiliateEarningsResponse,
  AffiliateListing,
  AffiliateOverview,
} from "@/types/affiliate.types";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { PageHeader } from "@/components/dashboard";

export default function EarningsPage() {
  const [
    overview,
    setOverview,
  ] =
    useState<AffiliateOverview>();

  const [
    listings,
    setListings,
  ] = useState<
    AffiliateListing[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            "/api/affiliate/earnings",
          );

        const data: AffiliateEarningsResponse & {
          success: boolean;
          error?: string;
        } =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ??
              "Unable to load earnings.",
          );
        }

        setOverview(
          data.overview,
        );

        setListings(
          data.listings,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load earnings.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (
    loading ||
    !overview
  ) {
    return null;
  }

return (
  <DashboardPageLayout
    environment="user"
    breadcrumb={[
      {
        label: "Earnings",
      },
    ]}
  >
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Affiliate Earnings"
        description="Track your affiliate performance, revenue and commissions."
      />

      <EarningsSummaryCard
        overview={overview}
      />

      <EarningsHistoryTable
        listings={listings}
      />
    </div>
  </DashboardPageLayout>
);
}