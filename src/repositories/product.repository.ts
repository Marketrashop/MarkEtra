import { prisma } from "@/lib/prisma";

import {
  Prisma,
  ProductStatus,
} from "../../generated/prisma/client";

import type {
  ProductFilters,
} from "@/types/product.types";

const productDetailsInclude = {
  categories: {
    include: {
      category: true,
    },
  },

  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },

  variants: {
    orderBy: {
      createdAt: "asc",
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      sizes: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  },

  specifications: {
    orderBy: {
      sortOrder: "asc",
    },
  },

  reviews: {
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.ProductInclude;

const productCardInclude = {
  categories: {
    include: {
      category: true,
    },
  },

  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ProductInclude;

export async function createProduct(
  data: Prisma.ProductCreateInput,
) {
  return prisma.product.create({
    data,

    include:
      productDetailsInclude,
  });
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  return prisma.product.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteProduct(
  id: string,
) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}

export async function getProductById(
  id: string,
) {
  return prisma.product.findUnique({
    where: {
      id,
    },

    include:
      productDetailsInclude,
  });
}

export async function getProductBySlug(
  slug: string,
) {
  return prisma.product.findUnique({
    where: {
      slug,
    },

    include:
      productDetailsInclude,
  });
}

export async function listProducts(
  filters?: ProductFilters,
) {
  const where:
    Prisma.ProductWhereInput = {};

  if (filters?.search) {
    where.OR = [
      {
        name: {
          contains:
            filters.search,

          mode:
            "insensitive",
        },
      },

      {
        description: {
          contains:
            filters.search,

          mode:
            "insensitive",
        },
      },

      {
        slug: {
          contains:
            filters.search,

          mode:
            "insensitive",
        },
      },
    ];
  }

  if (filters?.categoryId) {
    where.categories = {
      some: {
        categoryId:
          filters.categoryId,
      },
    };
  }

  if (
    typeof filters?.featured ===
    "boolean"
  ) {
    where.featured =
      filters.featured;
  }

  if (filters?.status) {
    where.status =
      filters.status;
  }

  return prisma.product.findMany({
    where,

    include:
      productCardInclude,

    orderBy: {
      createdAt:
        "desc",
    },
  });
}

export async function listFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      featured:
        true,

      status:
        ProductStatus.ACTIVE,
    },

    include: {
      categories: {
        include: {
          category: true,
        },
      },

      images: {
        orderBy: {
          sortOrder:
            "asc",
        },
      },
    },

    orderBy: {
      publishedAt:
        "desc",
    },
  });
}

export async function listRelatedProducts(
  categoryId: string,
  productId: string,
) {
  return prisma.product.findMany({
    where: {
      categories: {
        some: {
          categoryId,
        },
      },

      status:
        ProductStatus.ACTIVE,

      NOT: {
        id:
          productId,
      },
    },

    include: {
      categories: {
        include: {
          category: true,
        },
      },

      images: {
        orderBy: {
          sortOrder:
            "asc",
        },
      },
    },

    orderBy: {
      publishedAt:
        "desc",
    },

    take: 4,
  });
}

export async function getProductStats() {
  const [
    total,
    active,
    draft,
    archived,
    featured,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.count({
      where: {
        status:
          ProductStatus.ACTIVE,
      },
    }),

    prisma.product.count({
      where: {
        status:
          ProductStatus.DRAFT,
      },
    }),

    prisma.product.count({
      where: {
        status:
          ProductStatus.ARCHIVED,
      },
    }),

    prisma.product.count({
      where: {
        featured:
          true,
      },
    }),
  ]);

  return {
    total,
    active,
    draft,
    archived,
    featured,
  };
}