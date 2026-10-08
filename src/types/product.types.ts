import type {
  ProductStatus,
} from "../../generated/prisma/client";

import type {
  ProductCategory,
} from "./category.types";

export type ProductImage = {
  id: string;

  imageKey: string;

  altText: string | null;

  sortOrder: number;

  isPrimary: boolean;
};

export type ProductVariantImage = {
  id: string;

  imageKey: string;

  altText: string | null;

  sortOrder: number;

  isPrimary: boolean;
};

export type ProductVariantSize = {
  id: string;

  size: string | null;

  sku: string | null;

  price: number | null;

  stock: number;

  reservedStock: number;

  incomingStock: number;

  allowPreorder: boolean;
};

export type ProductVariant = {
  id: string;

  type:
    | "DEFAULT"
    | "COLOR"
    | "STORAGE"
    | "MATERIAL"
    | "PACK_SIZE"
    | "STYLE"
    | "OTHER";

  label: string | null;

  images: ProductVariantImage[];

  sizes: ProductVariantSize[];
};

export type ProductSpecification = {
  id: string;

  name: string;

  value: string;

  sortOrder: number;
};

export type ProductReview = {
  id: string;

  customerName: string;

  rating: number;

  title: string | null;

  comment: string;

  verifiedPurchase: boolean;

  sortOrder: number;

  createdAt: Date;
};

export type Product = {
  id: string;

  name: string;

  slug: string;

  description: string;

  sku: string | null;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  totalRatings: number;

  totalSales: number;

  featured: boolean;

  status: ProductStatus;

  metaTitle: string |null;

  metaDescription: string | null;

  publishedAt: Date | null;

  categories: {
    category: ProductCategory;
  }[];

  images: ProductImage[];

  variants: ProductVariant[];

  specifications: ProductSpecification[];

  reviews: ProductReview[];

  createdAt: Date;

  updatedAt: Date;
};

export type ProductCard = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "compareAtPrice"
  | "averageRating"
  | "totalRatings"
  | "featured"
> & {
  primaryImage: string | null;
};

export type ProductFilters = {
  search?: string;

  categoryId?: string;

  featured?: boolean;

  status?: ProductStatus;

  minPrice?: number;

  maxPrice?: number;

  sortBy?: ProductSortField;

  sortOrder?: ProductSortDirection;
};

export type ProductSortField =
  | "name"
  | "price"
  | "createdAt"
  | "publishedAt"
  | "totalSales";

export type ProductSortDirection =
  | "asc"
  | "desc";

export type ProductQuery = {
  filters?: ProductFilters;

  sortField?: ProductSortField;

  sortDirection?: ProductSortDirection;

  page?: number;

  pageSize?: number;
};

export type ProductSummary = {
  total: number;

  active: number;

  draft: number;

  archived: number;

  featured: number;
};