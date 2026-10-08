import { prisma } from "@/lib/prisma";

import {
  ProductStatus,
  type Prisma,
} from "../../generated/prisma/client";

import type {
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category.types";

export async function createCategory(
  data: CreateCategoryInput,
) {
  return prisma.productCategory.create({
    data,
  });
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
) {
  return prisma.productCategory.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteCategory(
  id: string,
) {
  return prisma.productCategory.delete({
    where: {
      id,
    },
  });
}

export async function getCategoryById(
  id: string,
) {
  return prisma.productCategory.findUnique({
    where: {
      id,
    },
  });
}

export async function getCategoryBySlug(
  slug: string,
) {
  return prisma.productCategory.findUnique({
    where: {
      slug,
    },
  });
}

export async function listCategories(
  filters?: CategoryFilters,
) {
  const where: Prisma.ProductCategoryWhereInput =
    {};

  if (filters?.search) {
    where.OR = [
      {
        name: {
          contains:
            filters.search,
          mode: "insensitive",
        },
      },

      {
        slug: {
          contains:
            filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (
    typeof filters?.isActive ===
    "boolean"
  ) {
    where.isActive =
      filters.isActive;
  }

  return prisma.productCategory.findMany({
    where,

    orderBy: [
      {
        sortOrder: "asc",
      },

      {
        name: "asc",
      },
    ],

    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function listCategoryOptions() {
  return prisma.productCategory.findMany({
    where: {
      isActive: true,
    },

    select: {
      id: true,

      name: true,

      slug: true,
    },

    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function getCategoryStats() {
  const [
    total,
    active,
    inactive,
  ] = await Promise.all([
    prisma.productCategory.count(),

    prisma.productCategory.count({
      where: {
        isActive: true,
      },
    }),

    prisma.productCategory.count({
      where: {
        isActive: false,
      },
    }),
  ]);

  return {
    total,

    active,

    inactive,
  };
}

export async function getCategoryWithProducts(
  id: string,
) {
  return prisma.productCategory.findUnique({
    where: {
      id,
    },

    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,

              name: true,

              slug: true,

              status: true,

              featured: true,
            },
          },
        },

        orderBy: {
          product: {
            createdAt: "desc",
          },
        },
      },
    },
  });
}

export async function getCategoryProductCounts(
  categoryId: string,
) {
  const [
    total,
    draft,
    active,
    archived,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },
      },
    }),

    prisma.product.count({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },

        status:
          ProductStatus.DRAFT,
      },
    }),

    prisma.product.count({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },

        status:
          ProductStatus.ACTIVE,
      },
    }),

    prisma.product.count({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },

        status:
          ProductStatus.ARCHIVED,
      },
    }),
  ]);

  return {
    total,

    draft,

    active,

    archived,
  };
}

export async function getStorefrontCategories() {
  return prisma.productCategory.findMany({
    where: {
      isActive: true,

      products: {
        some: {
          product: {
            status:
              ProductStatus.ACTIVE,
          },
        },
      },
    },

    select: {
      id: true,

      name: true,

      slug: true,

      _count: {
        select: {
          products: {
            where: {
              product: {
                status:
                  ProductStatus.ACTIVE,
              },
            },
          },
        },
      },
    },

    orderBy: {
      products: {
        _count: "desc",
      },
    },

    take: 4,
  });
}