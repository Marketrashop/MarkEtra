import { ReactNode } from "react";

export type BlogArticleLayoutProps = {
  currentSlug: string;

  category?: string;
  title: string;

  author: string;
  publishedAt: string;
  readingTime: string;

  image: {
    src: string;
    alt: string;
  };

  children: ReactNode;
};

export type BlogHeroProps = Pick<
  BlogArticleLayoutProps,
  | "category"
  | "title"
  | "author"
  | "publishedAt"
  | "readingTime"
>;

export type BlogShareProps = {
  title: string;
  url: string;
};

export type RelatedArticlesProps = {
  currentSlug: string;
};