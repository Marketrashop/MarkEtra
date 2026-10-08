type SearchIntent =
  | "category"
  | "brand";

type SearchConcept = {
  intent: SearchIntent;

  triggers: string[];

  expansions: string[];
};

export const searchConcepts: SearchConcept[] = [
  {
    intent: "category",

    triggers: [
      "phone",
      "phones",
      "smartphone",
      "smartphones",
      "mobile",
      "mobiles",
      "cellphone",
      "cellphones",
      "cell phone",
    ],

    expansions: [
      "phone",
      "phones",
      "iphone",
      "galaxy",
      "pixel",
      "oneplus",
      "xiaomi",
      "redmi",
      "oppo",
      "vivo",
      "tecno",
      "infinix",
      "nothing phone",
    ],
  },

  {
    intent: "category",

    triggers: [
      "watch",
      "watches",
      "smartwatch",
      "smartwatches",
      "wearable",
      "wearables",
    ],

    expansions: [
      "watch",
      "apple watch",
      "galaxy watch",
      "pixel watch",
    ],
  },

  {
    intent: "category",

    triggers: [
      "earbud",
      "earbuds",
      "buds",
      "earphones",
      "headphones",
      "headset",
    ],

    expansions: [
      "airpods",
      "galaxy buds",
      "pixel buds",
      "earbuds",
    ],
  },

  {
    intent: "category",

    triggers: [
      "laptop",
      "laptops",
      "computer",
      "computers",
      "notebook",
      "ultrabook",
      "pc",
    ],

    expansions: [
      "macbook",
      "laptop",
      "notebook",
      "computer",
    ],
  },

  {
    intent: "category",

    triggers: [
      "tablet",
      "tablets",
    ],

    expansions: [
      "ipad",
      "tablet",
      "galaxy tab",
    ],
  },

  {
    intent: "brand",

    triggers: [
      "apple",
    ],

    expansions: [
      "apple",
      "iphone",
      "macbook",
      "ipad",
      "airpods",
      "apple watch",
    ],
  },

  {
    intent: "brand",

    triggers: [
      "samsung",
    ],

    expansions: [
      "samsung",
      "galaxy",
      "galaxy watch",
      "galaxy tab",
      "galaxy buds",
    ],
  },

  {
    intent: "brand",

    triggers: [
      "google",
    ],

    expansions: [
      "google",
      "pixel",
      "pixel watch",
      "pixel buds",
    ],
  },
];

function singularize(
  word: string,
) {
  if (
    word.endsWith("ies")
  ) {
    return (
      word.slice(0, -3) + "y"
    );
  }

  if (
    word.endsWith("es") &&
    word.length > 4
  ) {
    return word.slice(0, -2);
  }

  if (
    word.endsWith("s") &&
    word.length > 3
  ) {
    return word.slice(0, -1);
  }

  return word;
}

function normalize(
  text: string,
) {
  return text
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s]/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchTerms(
  query: string,
) {
  const normalized =
    normalize(query);

  if (!normalized) {
    return [];
  }

  const terms =
    new Set<string>();

  terms.add(normalized);

  const words =
    normalized
      .split(" ")
      .map(singularize);

  words.forEach((word) => {
    terms.add(word);
  });

  for (const concept of searchConcepts) {
    const matched =
      concept.triggers.some(
        (trigger) =>
          normalized === trigger ||
          words.includes(trigger),
      );

    if (matched) {
      concept.expansions.forEach(
        (term) =>
          terms.add(term),
      );
    }
  }

  return [...terms];
}

export function buildProductSearchWhere(
  terms: string[],
) {
  return terms.flatMap(
    (term) => [
      {
        name: {
          contains: term,
          mode:
            "insensitive" as const,
        },
      },

      {
        slug: {
          contains: term,
          mode:
            "insensitive" as const,
        },
      },

      {
        description: {
          contains: term,
          mode:
            "insensitive" as const,
        },
      },

      {
        categories: {
          some: {
            category: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode:
                      "insensitive" as const,
                  },
                },

                {
                  slug: {
                    contains: term,
                    mode:
                      "insensitive" as const,
                  },
                },
              ],
            },
          },
        },
      },
    ],
  );
}

export function calculateSearchScore(
  product: {
    name: string;
    slug: string;
    description: string | null;
    featured?: boolean;
    categories: {
      category: {
        name: string;
        slug: string;
      };
    }[];
  },
  terms: string[],
) {
  let score = 0;

  const name =
    normalize(
      product.name,
    );

  const slug =
    normalize(
      product.slug,
    );

  const description =
    normalize(
      product.description ??
        "",
    );

  const categoryNames =
    normalize(
      product.categories
        .map(
          (c) =>
            c.category.name,
        )
        .join(" "),
    );

  const categorySlugs =
    normalize(
      product.categories
        .map(
          (c) =>
            c.category.slug,
        )
        .join(" "),
    );

  terms.forEach((term) => {
    if (
      name === term
    ) {
      score += 150;
    }

    if (
      name.startsWith(term)
    ) {
      score += 130;
    }

    if (
      name.includes(term)
    ) {
      score += 110;
    }

    if (
      slug === term
    ) {
      score += 100;
    }

    if (
      slug.includes(term)
    ) {
      score += 85;
    }

    if (
      categoryNames.includes(
        term,
      )
    ) {
      score += 80;
    }

    if (
      categorySlugs.includes(
        term,
      )
    ) {
      score += 75;
    }

    if (
      description.includes(
        term,
      )
    ) {
      score += 40;
    }
  });

  if (
    product.featured
  ) {
    score += 10;
  }

  return score;
}