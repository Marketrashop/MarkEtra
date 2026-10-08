export type AdminAffiliatePublicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export type AdminAffiliateListingStatus =
  | "ACTIVE"
  | "PAUSED";

export type AdminAffiliateInterestStatus =
  | "PENDING"
  | "NEGOTIATING"
  | "ACCEPTED"
  | "REJECTED";

export type AdminAffiliateTransactionStatus =
  | "AWAITING_PAYMENT"
  | "IN_ESCROW"
  | "COMPLETED"
  | "CANCELLED";

export type AdminAffiliateUser = {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  avatarKey: string | null;
};

export type AdminAffiliatePlan = {
  id: string;

  name: string;

  commissionRate: number;

  badgeName: string;
};

export type AdminAffiliateSubscription = {
  id: string;

  commissionRate: number;

  status: string;

  startsAt: string;

  expiresAt: string;

  plan: AdminAffiliatePlan;
};

export type AdminAffiliateProductImage = {
  id: string;

  imageKey: string;

  altText: string | null;

  isPrimary: boolean;

  sortOrder: number;
};

export type AdminAffiliateProductCategory = {
  id: string;

  name: string;

  slug: string;
};

export type AdminAffiliateProduct = {
  id: string;

  name: string;

  slug: string;

  description: string;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  totalRatings: number;

  totalSales: number;

  status: string;

  featured: boolean;

  publishedAt: string | null;

  category: AdminAffiliateProductCategory;

  images: AdminAffiliateProductImage[];
};

export type AdminAffiliateTestBuyer = {
  id: string;

  name: string;

  imageKey: string | null;

  phone: string;

  email: string | null;

  createdAt: string;

  updatedAt: string;
};

export type AdminAffiliateMessageSender = {
  id: string;

  firstName: string;

  lastName: string;

  role: "USER" | "ADMIN";
};

export type AdminAffiliateNegotiationMessage = {
  id: string;

  interestId: string;

  senderUserId: string;

  message: string;

  offeredPrice: number | null;

  createdAt: string;

  sender: AdminAffiliateMessageSender;
};

export type AdminAffiliateTransaction = {
  id: string;

  interestId: string;

  agreedPrice: number;

  commissionRate: number;

  commissionAmount: number;

  status: AdminAffiliateTransactionStatus;

  paidAt: string | null;

  escrowedAt: string | null;

  completedAt: string | null;

  cancelledAt: string | null;

  createdAt: string;

  updatedAt: string;
};

export type AdminAffiliateInterest = {
  id: string;

  affiliateListingId: string;

  testBuyerId: string;

  status: AdminAffiliateInterestStatus;

  offeredPrice: number;

  createdAt: string;

  updatedAt: string;

  testBuyer: AdminAffiliateTestBuyer;

  messages: AdminAffiliateNegotiationMessage[];

  transaction:
    | AdminAffiliateTransaction
    | null;
};

export type AdminAffiliateListing = {
  id: string;

  userId: string;

  subscriptionId: string;

  productId: string;

  status: AdminAffiliateListingStatus;

  publicationStatus:
    AdminAffiliatePublicationStatus;

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

  user: AdminAffiliateUser;

  subscription: AdminAffiliateSubscription;

  product: AdminAffiliateProduct;

  interests: AdminAffiliateInterest[];
};