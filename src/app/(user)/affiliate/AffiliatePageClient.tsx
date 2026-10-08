"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import AffiliateListingCard from "@/components/Plans/AffiliateListingCard";

import AffiliateListingDetailsDialog from "@/components/Plans/AffiliateListingDetailsDialog";

import AffiliateInterestsSection from "@/components/Plans/AffiliateInterestsSection";

import {
  getAffiliateEarnings,
} from "@/services/affiliate-api.service";

import type {
  AffiliateListing,
  AffiliateOverview,
  AffiliateInterest,
} from "@/types/affiliate.types";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  PageHeader,
} from "@/components/dashboard";

export default function AffiliatePageClient() {
  const [
    listings,
    setListings,
  ] = useState<
    AffiliateListing[]
  >([]);

  const [
    overview,
    setOverview,
  ] =
    useState<AffiliateOverview>();

  const [
    selectedListing,
    setSelectedListing,
  ] =
    useState<AffiliateListing | null>(
      null,
    );

  const [
    selectedInterestsListing,
    setSelectedInterestsListing,
  ] =
    useState<AffiliateListing | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getAffiliateEarnings();

        setListings(
          data.listings,
        );

        setOverview(
          data.overview,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load affiliate products.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  function handleInterestUpdate(
    updatedInterest: AffiliateInterest,
  ) {
    setListings(
      (currentListings) =>
        currentListings.map(
          (listing) =>
            listing.id ===
            updatedInterest.affiliateListingId
              ? {
                  ...listing,

                  interests:
                    listing.interests.map(
                      (interest) =>
                        interest.id ===
                        updatedInterest.id
                          ? updatedInterest
                          : interest,
                    ),
                }
              : listing,
        ),
    );

    setSelectedInterestsListing(
      (currentListing) =>
        currentListing &&
        currentListing.id ===
          updatedInterest.affiliateListingId
          ? {
              ...currentListing,

              interests:
                currentListing.interests.map(
                  (interest) =>
                    interest.id ===
                    updatedInterest.id
                      ? updatedInterest
                      : interest,
                ),
            }
          : currentListing,
    );
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <DashboardPageLayout
        environment="user"
        breadcrumb={[
          {
            label:
              "Affiliate Products",
          },
        ]}
      >
        <div
          className="
            space-y-5
            pb-16
          "
        >
          <PageHeader
            title="Affiliate Products"
            description="Submit products for admin review and manage their affiliate publication status."
          />

          {listings.length ===
          0 ? (
            <div
              className="
                rounded-[var(--user-radius-md)]
                border
                p-8
                text-center
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
              <h3
                className="
                  text-base
                  font-semibold
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                No affiliate products yet
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Submit a product for
                admin review to begin
                your affiliate journey.
              </p>
            </div>
          ) : (
            <div
              className="
                space-y-5
              "
            >
              {listings.map(
                (listing) => (
                  <section
                    key={
                      listing.id
                    }
                    className="
                      space-y-3
                    "
                  >
                    <AffiliateListingCard
                      listing={
                        listing
                      }
                      onView={
                        setSelectedListing
                      }
                      onViewInterests={
                        listing.publicationStatus ===
                          "PUBLISHED" &&
                        listing.interests
                          .length >
                          0
                          ? setSelectedInterestsListing
                          : undefined
                      }
                    />
                  </section>
                ),
              )}
            </div>
          )}
        </div>
      </DashboardPageLayout>

      <AffiliateListingDetailsDialog
        listing={
          selectedListing
        }
        open={
          selectedListing !==
          null
        }
        onClose={() =>
          setSelectedListing(
            null,
          )
        }
      />

      <AffiliateInterestsSection
        listing={
          selectedInterestsListing
        }
        open={
          selectedInterestsListing !==
          null
        }
        onClose={() =>
          setSelectedInterestsListing(
            null,
          )
        }
        onAccept={
          handleInterestUpdate
        }
        onReject={
          handleInterestUpdate
        }
        onNegotiate={
          handleInterestUpdate
        }
      />
    </>
  );
}