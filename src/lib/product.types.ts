export type ProductImage = {
  id: string;
  imageKey: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductCategoryData = {
  id: string;
  name: string;
  slug: string;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;

  description: string;

  price: number;

  compareAtPrice: number | null;

  averageRating: number;

  totalRatings: number;

  featured: boolean;

  stock: number;

  status: string;

  createdAt: Date;

  publishedAt: Date | null;

  category: ProductCategoryData;

  images: ProductImage[];
};