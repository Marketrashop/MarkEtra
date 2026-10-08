export type ProductReview = {
  id: string;

  productId: string;

  customerName: string;

  rating: number;

  title: string | null;

  comment: string;

  verifiedPurchase: boolean;

  sortOrder: number;

  createdAt: Date;
};

export type CreateReviewInput = {
  productId: string;

  customerName: string;

  rating: number;

  title?: string;

  comment: string;
};

export type UpdateReviewInput = Partial<
  Omit<CreateReviewInput, "productId">
>;

export type ReviewQuery = {
  productId?: string;

  verifiedPurchase?: boolean;

  rating?: number;

  page?: number;

  pageSize?: number;
};

export type ReviewSummary = {
  totalReviews: number;

  averageRating: number;

  fiveStars: number;

  fourStars: number;

  threeStars: number;

  twoStars: number;

  oneStar: number;
};