import type { ProductStatus } from "../../generated/prisma/client";

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageKey: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
  products: number;
};
};

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageKey?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryWithStats = ProductCategory & {
  productCount: number;
  activeProductCount: number;
  draftProductCount: number;
};

export type CategoryFilters = {
  search?: string;
  isActive?: boolean;
};

export type CategorySortField =
  | "name"
  | "sortOrder"
  | "createdAt";

export type CategorySortDirection = "asc" | "desc";

export type CategoryQuery = {
  filters?: CategoryFilters;
  sortField?: CategorySortField;
  sortDirection?: CategorySortDirection;
  page?: number;
  pageSize?: number;
};

export type CategorySummary = {
  total: number;
  active: number;
  inactive: number;
};

export type CategoryProductCount = {
  total: number;
  draft: number;
  active: number;
  archived: number;
};

export type CategoryWithProducts = ProductCategory & {
  products: {
    id: string;
    name: string;
    slug: string;
    status: ProductStatus;
    featured: boolean;
    stock: number;
  }[];
};