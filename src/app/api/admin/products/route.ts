import { NextResponse } from "next/server";

import { Prisma } from "../../../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createProductSchema,
} from "@/validation/product.validation";

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

export async function GET() {
  try {
    await requireAdmin();

    const products =
      await prisma.product.findMany({
        include,

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json({
      success: true,

      data:
        products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch products.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const parsed =
      createProductSchema.safeParse(
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

    const initialRating =
      data.initialRating;

    const hasInitialRating =
      initialRating > 0;

    const product =
      await prisma.product.create({
        data: {
          name:
            data.name,

          slug:
            data.slug,

          description:
            data.description,

          sku:
            data.sku ||
            null,

          price:
            data.price,

          compareAtPrice:
            data.compareAtPrice ??
            null,

          averageRating:
            initialRating,

          totalRatings:
            hasInitialRating
              ? 1
              : 0,

          featured:
            data.featured,

          status:
            data.status,

          metaTitle:
            data.metaTitle ||
            null,

          metaDescription:
            data.metaDescription ||
            null,

categories: {
  create: data.categoryIds.map(
    (categoryId) => ({
      category: {
        connect: {
          id: categoryId,
        },
      },
    }),
  ),
},

          images: {
            create:
              data.images.map(
                (image) => ({
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

          variants: {
            create:
              data.variants.map(
                (variant) => ({
                  type:
                    variant.type,

                  label:
                    variant.label ||
                    null,

                  images: {
                    create:
                      variant.images.map(
                        (
                          image,
                        ) => ({
                          imageKey:
                            image.imageKey,

                          altText:
                            image.altText ||
                            null,

                          sortOrder:
                            image.sortOrder,

                          isPrimary:
                            image.isPrimary,
                        }),
                      ),
                  },

                  sizes: {
                    create:
                      variant.sizes.map(
                        (size) => ({
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
                        }),
                      ),
                  },
                }),
              ),
          },

          specifications: {
            create:
              data.specifications.map(
                (
                  specification,
                ) => ({
                  name:
                    specification.name,

                  value:
                    specification.value,

                  sortOrder:
                    specification.sortOrder,
                }),
              ),
          },

          reviews: {
            create:
              data.reviews.map(
                (
                  review,
                  index,
                ) => ({
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
        },

        include,
      });

    return NextResponse.json(
      {
        success: true,

        data:
          product,
      },
      {
        status: 201,
      },
    );
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
              "A product with this slug or SKU already exists.",
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
  "One or more selected categories no longer exist.",
          },
          {
            status: 404,
          },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to create product.",
      },
      {
        status: 500,
      },
    );
  }
}