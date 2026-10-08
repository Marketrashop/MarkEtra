"use client";

import Image from "next/image";

import { Container } from "@/components/layout";

import {
  BLOG_ARTICLE_MAX_WIDTH,
  BLOG_ARTICLE_SECTION_PADDING,
  BLOG_CONTENT_MAX_WIDTH,
  BLOG_CONTENT_SPACING,
  BLOG_FEATURED_IMAGE_ASPECT_RATIO,
  BLOG_FEATURED_IMAGE_RADIUS,
} from "./blog.constants";

import BlogHero from "./BlogHero";
import BlogShare from "./BlogShare";
import RelatedArticles from "./RelatedArticles";

import { BlogArticleLayoutProps } from "./blog.types";

export default function BlogArticleLayout({
  currentSlug,
  category,
  title,
  author,
  publishedAt,
  readingTime,
  image,
  children,
}: BlogArticleLayoutProps) {
  return (
    <section
      className={BLOG_ARTICLE_SECTION_PADDING}
      style={{
        background:
          "var(--blog-article-bg)",
      }}
    >
      <Container
        className={BLOG_ARTICLE_MAX_WIDTH}
      >
        {/* Hero */}

        <BlogHero
          category={category}
          title={title}
          author={author}
          publishedAt={publishedAt}
          readingTime={readingTime}
        />

        {/* Featured Image */}

        <div
          className={`
            relative

            mx-auto

            mt-8

            max-w-[980px]

            overflow-hidden

            ${BLOG_FEATURED_IMAGE_ASPECT_RATIO}
          `}
          style={{
            borderRadius:
              BLOG_FEATURED_IMAGE_RADIUS,

            boxShadow:
              "0 22px 55px rgba(0, 0, 0, 0.14)",
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="
              object-cover

              transition-transform
              duration-500
            "
          />
        </div>

        {/* Article */}

        <article
          className={`
            ${BLOG_CONTENT_MAX_WIDTH}

            ${BLOG_CONTENT_SPACING}

            mx-auto
          `}
        >
          {children}
        </article>

        {/* Share */}

        <BlogShare
          title={title}
          url={`/blog/${currentSlug}`}
        />

        {/* Continue Reading */}

        <section
          className="
            mt-16
          "
        >
          <RelatedArticles
            currentSlug={currentSlug}
          />
        </section>
      </Container>
    </section>
  );
}