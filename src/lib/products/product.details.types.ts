import type {
  ProductCategory,
  ProductImage,
} from "./product.types";

export type ProductVariant = {
  id: string;

  color: string | null;

  size: string | null;

  sku: string | null;

  price: number | null;

  stock: number | null;

  isDefault: boolean;

  imageUrl: string | null;

  sortOrder: number;
};

export type ProductSpecificationData = {
  id: string;

  name: string;

  value: string;

  sortOrder: number;
};

export type ProductReviewData = {
  id: string;

  customerName: string;

  rating: number;

  title: string | null;

  comment: string;

  verifiedPurchase: boolean;

  createdAt: Date;
};

export type ProductDetailsData = {
  id: string;

  slug: string;

  name: string;

  description: string;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  totalRatings: number;

  totalSales: number;

  stock: number;

  featured: boolean;

  status: string;

  sku: string | null;

  metaTitle: string | null;

  metaDescription: string | null;

  publishedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  category: ProductCategory;

  images: ProductImage[];

  variants: ProductVariant[];

  specifications: ProductSpecificationData[];

  reviews: ProductReviewData[];
};