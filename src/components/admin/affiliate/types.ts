import type {
  AdminAffiliateListing,
  AdminAffiliatePublicationStatus,
} from "@/types/admin-affiliate.types";

export type AffiliateProductFilter =
  | "ALL"
  | AdminAffiliatePublicationStatus;

export type AffiliateProductAction =
  | "review"
  | "approve"
  | "reject"
  | "publish";

export type AffiliateProductActionLoading =
  | AffiliateProductAction
  | null;

export type AffiliateProductsPageProps = {
  listings: AdminAffiliateListing[];

  loading: boolean;

  actionLoading: {
    listingId: string;

    action: AffiliateProductAction;
  } | null;

  onReview: (
    listingId: string,
  ) => Promise<void>;

  onApprove: (
    listingId: string,
  ) => Promise<void>;

  onReject: (
    listingId: string,
    reason: string,
  ) => Promise<void>;

  onPublish: (
    listingId: string,
  ) => Promise<void>;
};