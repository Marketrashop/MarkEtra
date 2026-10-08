import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import type {
  ProductCard,
  ProductDetails,
} from "./product.types";

import type {
  ProductDetailsWithRelations,
  ProductWithRelations,
} from "./product.select";

export function toProductCard(
  product: ProductWithRelations,
): ProductCard {
  return {
    id:
      product.id,

    slug:
      product.slug,

    name:
      product.name,

    description:
      product.description,

    price:
      Number(
        product.price,
      ),

    compareAtPrice:
      product.compareAtPrice ===
      null
        ? null
        : Number(
            product.compareAtPrice,
          ),

    averageRating:
      Number(
        product.averageRating,
      ),

    totalRatings:
      product.totalRatings,

    featured:
      product.featured,

    status:
      product.status,

    createdAt:
      product.createdAt,

    publishedAt:
      product.publishedAt,

    categories:
      product.categories.map(
        (assignment) => ({
          category: {
            id:
              assignment.category.id,

            name:
              assignment.category.name,

            slug:
              assignment.category.slug,
          },
        }),
      ),

    images:
      product.images.map(
        (image) => ({
          id:
            image.id,

          imageKey:
            image.imageKey,

          imageUrl:
            getCloudinaryImageUrl(
              image.imageKey,
            ),

          altText:
            image.altText,

          isPrimary:
            image.isPrimary,

          sortOrder:
            image.sortOrder,
        }),
      ),
  };
}

export function toProductDetails(
  product: ProductDetailsWithRelations,
): ProductDetails {
  return {
    ...toProductCard(
      product,
    ),

    totalSales:
      product.totalSales,

    sku:
      product.sku,

    metaTitle:
      product.metaTitle,

    metaDescription:
      product.metaDescription,

    updatedAt:
      product.updatedAt,

    variants:
      product.variants.map(
        (variant) => ({
          id:
            variant.id,

          type:
            variant.type,

          label:
            variant.label,

          images:
            variant.images.map(
              (image) => ({
                id:
                  image.id,

                imageKey:
                  image.imageKey,

                imageUrl:
                  getCloudinaryImageUrl(
                    image.imageKey,
                  ),

                altText:
                  image.altText,

                isPrimary:
                  image.isPrimary,

                sortOrder:
                  image.sortOrder,
              }),
            ),

          sizes:
            variant.sizes.map(
              (size) => ({
                id:
                  size.id,

                size:
                  size.size,

                sku:
                  size.sku,

                price:
                  size.price ===
                  null
                    ? null
                    : Number(
                        size.price,
                      ),

                stock:
                  size.stock,

                reservedStock:
                  size.reservedStock,

                incomingStock:
                  size.incomingStock,

                allowPreorder:
                  size.allowPreorder,
              }),
            ),
        }),
      ),

    specifications:
      product.specifications.map(
        (specification) => ({
          id:
            specification.id,

          name:
            specification.name,

          value:
            specification.value,

          sortOrder:
            specification.sortOrder,
        }),
      ),

    reviews:
      product.reviews.map(
        (review) => ({
          id:
            review.id,

          customerName:
            review.customerName,

          rating:
            review.rating,

          title:
            review.title,

          comment:
            review.comment,

          verifiedPurchase:
            review.verifiedPurchase,

          createdAt:
            review.createdAt,
        }),
      ),
  };
}