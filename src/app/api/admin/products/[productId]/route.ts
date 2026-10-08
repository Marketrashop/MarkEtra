import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  Prisma,
} from "../../../../../../generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  updateProductSchema,
} from "@/validation/product.validation";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

const include = {
  categories: {
    include: {
      category: true,
    },
  },

  images: {
    orderBy: {
      sortOrder:
        "asc" as const,
    },
  },

  variants: {
    orderBy: {
      createdAt:
        "asc" as const,
    },

    include: {
      images: {
        orderBy: {
          sortOrder:
            "asc" as const,
        },
      },

      sizes: {
        orderBy: {
          createdAt:
            "asc" as const,
        },
      },
    },
  },

  specifications: {
    orderBy: {
      sortOrder:
        "asc" as const,
    },
  },

  reviews: {
    orderBy: {
      sortOrder:
        "asc" as const,
    },
  },
} satisfies Prisma.ProductInclude;

export async function GET(
  _request: NextRequest,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      productId,
    } = await params;

    const product =
      await prisma.product.findUnique(
        {
          where: {
            id:
              productId,
          },

          include,
        },
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      data:
        product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch product.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      productId,
    } = await params;

    const existing =
      await prisma.product.findUnique(
        {
          where: {
            id:
              productId,
          },

include: {
  categories: {
    include: {
      category: true,
    },
  },

  variants: {
              include: {
                images: true,

                sizes: true,
              },
            },

            reviews: true,
          },
        },
      );

    if (!existing) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body =
      await request.json();

    const parsed =
      updateProductSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Validation failed.",

          issues:
            parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const data =
      parsed.data;

    await prisma.$transaction(
      async (tx) => {
        const productUpdateData: Prisma.ProductUpdateInput =
          {
            ...(data.name !==
            undefined
              ? {
                  name:
                    data.name,
                }
              : {}),

            ...(data.slug !==
            undefined
              ? {
                  slug:
                    data.slug,
                }
              : {}),

            ...(data.description !==
            undefined
              ? {
                  description:
                    data.description,
                }
              : {}),

            ...(data.sku !==
            undefined
              ? {
                  sku:
                    data.sku ||
                    null,
                }
              : {}),

            ...(data.price !==
            undefined
              ? {
                  price:
                    data.price,
                }
              : {}),

            ...(data.compareAtPrice !==
            undefined
              ? {
                  compareAtPrice:
                    data.compareAtPrice ??
                    null,
                }
              : {}),

            ...(data.featured !==
            undefined
              ? {
                  featured:
                    data.featured,
                }
              : {}),

            ...(data.status !==
            undefined
              ? {
                  status:
                    data.status,
                }
              : {}),

            ...(data.metaTitle !==
            undefined
              ? {
                  metaTitle:
                    data.metaTitle ||
                    null,
                }
              : {}),

            ...(data.metaDescription !==
            undefined
              ? {
                  metaDescription:
                    data.metaDescription ||
                    null,
                }
              : {}),

...(data.categoryIds !==
undefined
  ? {
      categories: {
        deleteMany: {},

        create:
          data.categoryIds.map(
            (categoryId) => ({
              category: {
                connect: {
                  id:
                    categoryId,
                },
              },
            }),
          ),
      },
    }
  : {}),
          };
if (
  data.initialRating !==
  undefined
) {
  productUpdateData.averageRating =
    data.initialRating;

  productUpdateData.totalRatings =
    data.initialRating >
    0
      ? 1
      : 0;
}

        await tx.product.update({
          where: {
            id:
              productId,
          },

          data:
            productUpdateData,
        });

        if (
          data.images !==
          undefined
        ) {
          await tx.productImage.deleteMany(
            {
              where: {
                productId,
              },
            },
          );

          if (
            data.images.length >
            0
          ) {
            await tx.productImage.createMany(
              {
                data:
                  data.images.map(
                    (
                      image,
                    ) => ({
                      productId,

                      imageKey:
                        image.imageKey,

                      altText:
                        image.altText ||
                        null,

                      isPrimary:
                        image.isPrimary,

                      sortOrder:
                        image.sortOrder,
                    }),
                  ),
              },
            );
          }
        }

        if (
          data.specifications !==
          undefined
        ) {
          await tx.productSpecification.deleteMany(
            {
              where: {
                productId,
              },
            },
          );

          if (
            data.specifications
              .length >
            0
          ) {
            await tx.productSpecification.createMany(
              {
                data:
                  data.specifications.map(
                    (
                      specification,
                    ) => ({
                      productId,

                      name:
                        specification.name,

                      value:
                        specification.value,

                      sortOrder:
                        specification.sortOrder,
                    }),
                  ),
              },
            );
          }
        }

        if (
          data.reviews !==
          undefined
        ) {
          await tx.productReview.deleteMany(
            {
              where: {
                productId,
              },
            },
          );

          if (
            data.reviews.length >
            0
          ) {
            await tx.productReview.createMany(
              {
                data:
                  data.reviews.map(
                    (
                      review,
                      index,
                    ) => ({
                      productId,

                      customerName:
                        review.customerName,

                      rating:
                        review.rating,

                      title:
                        review.title ||
                        null,

                      comment:
                        review.comment,

                      verifiedPurchase:
                        review.verifiedPurchase,

                      sortOrder:
                        review.sortOrder ??
                        index,
                    }),
                  ),
              },
            );
          }
        }

        if (
          data.variants !==
          undefined
        ) {
          const incomingVariantIds =
            data.variants
              .map(
                (
                  variant,
                ) =>
                  variant.id,
              )
              .filter(
                (
                  id,
                ): id is string =>
                  Boolean(id),
              );

          await tx.productVariant.deleteMany(
            {
              where: {
                productId,

                ...(incomingVariantIds.length >
                0
                  ? {
                      id: {
                        notIn:
                          incomingVariantIds,
                      },
                    }
                  : {}),
              },
            },
          );

          for (
            const variant of
            data.variants
          ) {
            let variantId =
              variant.id;

            if (variantId) {
              const existingVariant =
                existing.variants.find(
                  (
                    item,
                  ) =>
                    item.id ===
                    variantId,
                );

              if (
                !existingVariant
              ) {
                throw new Error(
                  "One or more inventory variants do not belong to this product.",
                );
              }

              await tx.productVariant.update(
                {
                  where: {
                    id:
                      variantId,
                  },

                  data: {
                    type:
                      variant.type,

                    label:
                      variant.label ||
                      null,
                  },
                },
              );
            } else {
              const createdVariant =
                await tx.productVariant.create(
                  {
                    data: {
                      productId,

                      type:
                        variant.type,

                      label:
                        variant.label ||
                        null,
                    },
                  },
                );

              variantId =
                createdVariant.id;
            }

            const existingVariant =
              existing.variants.find(
                (
                  item,
                ) =>
                  item.id ===
                  variantId,
              );

            const incomingImageIds =
              variant.images
                .map(
                  (
                    image,
                  ) =>
                    image.id,
                )
                .filter(
                  (
                    id,
                  ): id is string =>
                    Boolean(id),
                );

            await tx.productVariantImage.deleteMany(
              {
                where: {
                  variantId,

                  ...(incomingImageIds.length >
                  0
                    ? {
                        id: {
                          notIn:
                            incomingImageIds,
                        },
                      }
                    : {}),
                },
              },
            );

            for (
              const image of
              variant.images
            ) {
              if (
                image.id
              ) {
                const existingImage =
                  existingVariant?.images.find(
                    (
                      item,
                    ) =>
                      item.id ===
                      image.id,
                  );

                if (
                  !existingImage ||
                  existingImage.variantId !==
                    variantId
                ) {
                  throw new Error(
                    "One or more variant images do not belong to the selected variant.",
                  );
                }

                await tx.productVariantImage.update(
                  {
                    where: {
                      id:
                        image.id,
                    },

                    data: {
                      imageKey:
                        image.imageKey,

                      altText:
                        image.altText ||
                        null,

                      sortOrder:
                        image.sortOrder,

                      isPrimary:
                        image.isPrimary,
                    },
                  },
                );
              } else {
                await tx.productVariantImage.create(
                  {
                    data: {
                      variantId,

                      imageKey:
                        image.imageKey,

                      altText:
                        image.altText ||
                        null,

                      sortOrder:
                        image.sortOrder,

                      isPrimary:
                        image.isPrimary,
                    },
                  },
                );
              }
            }

            const incomingSizeIds =
              variant.sizes
                .map(
                  (
                    size,
                  ) =>
                    size.id,
                )
                .filter(
                  (
                    id,
                  ): id is string =>
                    Boolean(id),
                );

            await tx.productVariantSize.deleteMany(
              {
                where: {
                  variantId,

                  ...(incomingSizeIds.length >
                  0
                    ? {
                        id: {
                          notIn:
                            incomingSizeIds,
                        },
                      }
                    : {}),
                },
              },
            );

            for (
              const size of
              variant.sizes
            ) {
              if (
                size.id
              ) {
                const existingSize =
                  existingVariant?.sizes.find(
                    (
                      item,
                    ) =>
                      item.id ===
                      size.id,
                  );

                if (
                  !existingSize ||
                  existingSize.variantId !==
                    variantId
                ) {
                  throw new Error(
                    "One or more inventory options do not belong to the selected variant.",
                  );
                }

                await tx.productVariantSize.update(
                  {
                    where: {
                      id:
                        size.id,
                    },

                    data: {
                      size:
                        size.size ||
                        null,

                      sku:
                        size.sku ||
                        null,

                      price:
                        size.price ??
                        null,

                      stock:
                        size.stock,

                      reservedStock:
                        size.reservedStock,

                      incomingStock:
                        size.incomingStock,

                      allowPreorder:
                        size.allowPreorder,
                    },
                  },
                );
              } else {
                await tx.productVariantSize.create(
                  {
                    data: {
                      variantId,

                      size:
                        size.size ||
                        null,

                      sku:
                        size.sku ||
                        null,

                      price:
                        size.price ??
                        null,

                      stock:
                        size.stock,

                      reservedStock:
                        size.reservedStock,

                      incomingStock:
                        size.incomingStock,

                      allowPreorder:
                        size.allowPreorder,
                    },
                  },
                );
              }
            }
          }
        }
      },

      {
        maxWait:
          10000,

        timeout:
          15000,
      },
    );

    const product =
      await prisma.product.findUnique(
        {
          where: {
            id:
              productId,
          },

          include,
        },
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Product could not be loaded after update.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,

      data:
        product,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (
        error.code ===
        "P2002"
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              "A product or inventory SKU already exists.",
          },
          {
            status: 409,
          },
        );
      }

      if (
        error.code ===
        "P2025"
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              "The requested product or related record no longer exists.",
          },
          {
            status: 404,
          },
        );
      }
    }

    if (
      error instanceof Error
    ) {
      if (
        error.message.includes(
          "do not belong to this product",
        ) ||
        error.message.includes(
          "do not belong to the selected variant",
        )
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              error.message,
          },
          {
            status: 400,
          },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to update product.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      productId,
    } = await params;

    const existing =
      await prisma.product.findUnique(
        {
          where: {
            id: productId,
          },
        },
      );

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to delete product.",
      },
      {
        status: 500,
      },
    );
  }
}