import type {
  Prisma,
} from "../../../generated/prisma/client";

export const productInclude = {
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
} satisfies Prisma.ProductInclude;

export const productDetailsInclude = {
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
      createdAt:
        "desc" as const,
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations =
  Prisma.ProductGetPayload<{
    include:
      typeof productInclude;
  }>;

export type ProductDetailsWithRelations =
  Prisma.ProductGetPayload<{
    include:
      typeof productDetailsInclude;
  }>;