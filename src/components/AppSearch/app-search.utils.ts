import type {
  ProductCard,
} from "@/lib/products";

import {
  APP_SEARCH_RESULTS_LIMIT,
} from "./app-search.constants";

export function normalizeSearchQuery(
  query: string,
) {
  return query
    .trim()
    .toLowerCase();
}

export function filterSearchResults(
  products: ProductCard[],
  query: string,
) {
  const normalizedQuery =
    normalizeSearchQuery(
      query,
    );

  if (!normalizedQuery) {
    return [];
  }

  return products
    .filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(
            normalizedQuery,
          ) ||
        product.description
          .toLowerCase()
          .includes(
            normalizedQuery,
          ) ||
        (
          product.categories ??
          []
        ).some(
          ({
            category,
          }) =>
            category.name
              .toLowerCase()
              .includes(
                normalizedQuery,
              ),
        ),
    )
    .slice(
      0,
      APP_SEARCH_RESULTS_LIMIT,
    );
}

export function highlightMatch(
  text: string,
  query: string,
) {
  const normalizedQuery =
    normalizeSearchQuery(
      query,
    );

  if (!normalizedQuery) {
    return text;
  }

  const index =
    text
      .toLowerCase()
      .indexOf(
        normalizedQuery,
      );

  if (index === -1) {
    return text;
  }

  return {
    before:
      text.slice(
        0,
        index,
      ),

    match:
      text.slice(
        index,
        index +
          normalizedQuery.length,
      ),

    after:
      text.slice(
        index +
          normalizedQuery.length,
      ),
  };
}

export function truncateText(
  text: string,
  maxLength = 60,
) {
  if (
    text.length <=
    maxLength
  ) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength,
  )}...`;
}