export type ProductImage = {
  id: string;

  imageKey: string;

  imageUrl: string | null;

  altText: string | null;

  isPrimary: boolean;

  sortOrder: number;
};

export type ProductVariantImage = {
  id: string;

  imageKey: string;

  imageUrl: string | null;

  altText: string | null;

  isPrimary: boolean;

  sortOrder: number;
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

export type ProductCategory = {
  id: string;

  name: string;

  slug: string;
};

export type ProductCategoryAssignment = {
  category: ProductCategory;
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

  createdAt: Date;
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

  status: string;

  createdAt: Date;

  publishedAt: Date | null;

  categories: ProductCategoryAssignment[];

  images: ProductImage[];
};

export type ProductDetails =
  ProductCard & {
    totalSales: number;

    sku: string | null;

    metaTitle: string | null;

    metaDescription: string | null;

    updatedAt: Date;

    variants: ProductVariant[];

    specifications: ProductSpecification[];

    reviews: ProductReview[];
  };