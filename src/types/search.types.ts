import type {
  ProductStatus,
} from "@/constants/product-status";

export type SearchCategoryResult = {
  id: string;

  name: string;

  slug: string;

  imageKey: string | null;
};

export type SearchProductResult = {
  id: string;

  name: string;

  slug: string;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  featured: boolean;

  status: ProductStatus;

  categoryId: string;

  categoryName: string;

  primaryImageUrl: string | null;

  
};

export type ProductSearchResponse = {
  query: string;

  categories: SearchCategoryResult[];

  products: SearchProductResult[];
};