import { NextRequest, NextResponse } from "next/server";

import {
  Prisma,
} from "../../../../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import { z } from "zod";

const duplicateSchema = z.object({
  productId: z.string().min(1),
});

const include = {
  categories: {
    include: {
      category: true,
    },
  },

  images: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },

  variants: {
    orderBy: {
      createdAt: "asc" as const,
    },

    include: {
      sizes: {
        orderBy: {
          createdAt: "asc" as const,
        },
      },
    },
  },

  specifications: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },

  reviews: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
} satisfies Prisma.ProductInclude;

export async function POST(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const parsed =
      duplicateSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request.",
          issues:
            parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const {
      productId,
    } = parsed.data;

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

include: {
  categories: {
    include: {
      category: true,
    },
  },

  images: true,

  variants: {
            include: {
              sizes: true,
            },
          },

          specifications: true,

          reviews: true,
        },
      });

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

    const duplicate =
      await prisma.product.create({
        data: {
          name:
            `${product.name} Copy`,

          slug:
            `${product.slug}-copy-${Date.now()}`,

          description:
            product.description,

          sku:
            product.sku
              ? `${product.sku}-COPY`
              : null,

          price:
            product.price,

          compareAtPrice:
            product.compareAtPrice,

          featured:
            product.featured,

          status:
            product.status,

          metaTitle:
            product.metaTitle,

          metaDescription:
            product.metaDescription,

categories: {
  create: product.categories.map(
    ({ category }) => ({
      category: {
        connect: {
          id: category.id,
        },
      },
    }),
  ),
},

          images: {
            create:
              product.images.map(
                (image) => ({
                  imageKey:
                    image.imageKey,

                  altText:
                    image.altText,

                  isPrimary:
                    image.isPrimary,

                  sortOrder:
                    image.sortOrder,
                }),
              ),
          },

          variants: {
            create:
              product.variants.map(
                (variant) => ({
                  type:
                    variant.type,

                  label:
                    variant.label,

                  imageKey:
                    variant.imageKey,

                  sizes: {
                    create:
                      variant.sizes.map(
                        (size) => ({
                          size:
                            size.size,

                          sku:
                            size.sku
                              ? `${size.sku}-COPY`
                              : null,

                          price:
                            size.price,

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
              product.specifications.map(
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
              product.reviews.map(
                (review) => ({
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

                  sortOrder:
                    review.sortOrder,
                }),
              ),
          },
        },

        include,
      });

    return NextResponse.json(
      {
        success: true,
        data: duplicate,
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
        error.code === "P2002"
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
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to duplicate product.",
      },
      {
        status: 500,
      },
    );
  }
}