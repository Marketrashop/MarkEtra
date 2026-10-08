import type {
  Product,
} from "@/types/product.types";

import type {
  CreateProductInput,
} from "@/validation/product.validation";

export function getProductInitialValues(
  product: Product,
): Partial<CreateProductInput> {
  const averageRating =
    Number(
      product.averageRating ??
        0,
    );

  return {
    name:
      product.name,

    slug:
      product.slug,

    description:
      product.description,

    sku:
      product.sku ??
      "",

    price:
      product.price,

    compareAtPrice:
      product.compareAtPrice,

    initialRating:
      averageRating,

    featured:
      product.featured,

    status:
      product.status,

    metaTitle:
      product.metaTitle ??
      "",

    metaDescription:
      product.metaDescription ??
      "",

    categoryIds:
      (
        product.categories ??
        []
      ).map(
        (item) =>
          item.category.id,
      ),

    images:
      (
        product.images ??
        []
      ).map(
        (
          image,
          index,
        ) => ({
          imageKey:
            image.imageKey,

          altText:
            image.altText ??
            undefined,

          isPrimary:
            image.isPrimary ??
            index === 0,

          sortOrder:
            image.sortOrder ??
            index,
        }),
      ),

    variants:
      (
        product.variants ??
        []
      ).map(
        (
          variant,
        ) => ({
          id:
            variant.id,

          type:
            variant.type,

          label:
            variant.label ??
            undefined,

          images:
            (
              variant.images ??
              []
            ).map(
              (
                image,
                index,
              ) => ({
                id:
                  image.id,

                imageKey:
                  image.imageKey,

                altText:
                  image.altText ??
                  undefined,

                sortOrder:
                  image.sortOrder ??
                  index,

                isPrimary:
                  image.isPrimary ??
                  index === 0,
              }),
            ),

          sizes:
            (
              variant.sizes ??
              []
            ).map(
              (
                size,
              ) => ({
                id:
                  size.id,

                size:
                  size.size ??
                  undefined,

                sku:
                  size.sku ??
                  undefined,

                price:
                  size.price ??
                  undefined,

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
      (
        product.specifications ??
        []
      ).map(
        (
          specification,
          index,
        ) => ({
          name:
            specification.name,

          value:
            specification.value,

          sortOrder:
            specification.sortOrder ??
            index,
        }),
      ),

    reviews:
      (
        product.reviews ??
        []
      ).map(
        (
          review,
          index,
        ) => ({
          customerName:
            review.customerName,

          rating:
            review.rating,

          title:
            review.title ??
            undefined,

          comment:
            review.comment,

          verifiedPurchase:
            review.verifiedPurchase,

          sortOrder:
            review.sortOrder ??
            index,
        }),
      ),
  };
}