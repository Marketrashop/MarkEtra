export type AffiliateListingStatus =
  | "ACTIVE"
  | "PAUSED";

export type AffiliatePublicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export type AffiliateInterestStatus =
  | "PENDING"
  | "NEGOTIATING"
  | "ACCEPTED"
  | "REJECTED";

export type AffiliateTransactionStatus =
  | "AWAITING_PAYMENT"
  | "IN_ESCROW"
  | "COMPLETED"
  | "CANCELLED";

export type AffiliateListingProductImage = {
  id: string;

  imageKey: string;

  imageUrl: string;

  altText: string | null;

  isPrimary: boolean;

  sortOrder: number;
};

export type AffiliateListingProduct = {
  id: string;

  name: string;

  slug: string;

  description: string;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  totalRatings: number;

  images: AffiliateListingProductImage[];
};

export type AffiliateTestBuyer = {
  id: string;

  name: string;

  imageKey: string | null;

  phone: string;

  email: string | null;

  active: boolean;

  lastActiveAt: string | null;

  createdAt: string;

  updatedAt: string;
};

export type AffiliateNegotiationMessage = {
  id: string;

  interestId: string;

  senderUserId: string;

  message: string;

  offeredPrice: number | null;

  createdAt: string;
};

export type AffiliateTransaction = {
  id: string;

  interestId: string;

  agreedPrice: number;

  commissionRate: number;

  commissionAmount: number;

  status: AffiliateTransactionStatus;

  paidAt: string | null;

  escrowedAt: string | null;

  completedAt: string | null;

  cancelledAt: string | null;

  createdAt: string;

  updatedAt: string;
};

export type AffiliateInterest = {
  id: string;

  affiliateListingId: string;

  testBuyerId: string;

  status: AffiliateInterestStatus;

  offeredPrice: number;

  createdAt: string;

  updatedAt: string;

  testBuyer: AffiliateTestBuyer;

  messages: AffiliateNegotiationMessage[];

  transaction: AffiliateTransaction | null;
};

export type AffiliateListing = {
  id: string;

  userId: string;

  subscriptionId: string;

  productId: string;

  status: AffiliateListingStatus;

  publicationStatus: AffiliatePublicationStatus;

  totalSales: number;

  totalRevenue: number;

  totalCommission: number;

  lastSaleAt: string | null;

  publishedAt: string | null;

  submittedAt: string | null;

  reviewedAt: string | null;

  rejectionReason: string | null;

  removedAt: string | null;

  createdAt: string;

  updatedAt: string;

  product: AffiliateListingProduct;

  interests: AffiliateInterest[];
};

export type SubmitAffiliateProductInput = {
  productId: string;
};

export type SubmitAffiliateProductResponse = {
  message: string;

  listing: AffiliateListing;
};

export type AffiliateOverview = {
  totalPublishedProducts: number;

  totalSales: number;

  totalRevenue: number;

  totalCommission: number;
};

export type AffiliateEarningsResponse = {
  overview: AffiliateOverview;

  listings: AffiliateListing[];
};