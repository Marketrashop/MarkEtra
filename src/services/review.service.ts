import {
  createReview,
  deleteReview,
  getReviewById,
  getReviews,
  getReviewSummary,
  updateReview,
} from "@/repositories/review.repository";

import type {
  CreateReviewInput,
  ReviewQuery,
  UpdateReviewInput,
} from "@/types/review.types";

export async function createProductReview(
  input: CreateReviewInput,
) {
  return createReview(input);
}

export async function updateProductReview(
  id: string,
  input: UpdateReviewInput,
) {
  return updateReview(id, input);
}

export async function deleteProductReview(
  id: string,
) {
  return deleteReview(id);
}

export async function getProductReview(
  id: string,
) {
  return getReviewById(id);
}

export async function listProductReviews(
  query: ReviewQuery = {},
) {
  return getReviews(query);
}

export async function getProductReviewSummary(
  productId: string,
) {
  return getReviewSummary(productId);
}