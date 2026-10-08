"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { Container } from "@/components/layout";

import { blogPosts } from "../blog.data";

import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";

import {
  BLOG_PAGE_ARTICLES_SPACING,
  BLOG_PAGE_DESCRIPTION_SPACING,
  BLOG_PAGE_FEATURED_SPACING,
  BLOG_PAGE_HEADING_SPACING,
  BLOG_PAGE_HERO_MAX_WIDTH,
  BLOG_PAGE_MAX_WIDTH,
  BLOG_PAGE_SECTION_PADDING,
} from "./blog-page.constants";

export default function BlogPage() {
  const featuredPost =
    blogPosts.find(
      (post) => post.featured
    ) ?? blogPosts[0];

  const otherPosts =
    blogPosts.filter(
      (post) => post.id !== featuredPost.id
    );

  return (
    <section
      className={BLOG_PAGE_SECTION_PADDING}
      style={{
        background:
          "var(--blog-article-bg)",
      }}
    >
      <Container
        className={BLOG_PAGE_MAX_WIDTH}
      >
        {/* Hero */}

        <header
          className={`
            ${BLOG_PAGE_HERO_MAX_WIDTH}

            mx-auto

            text-center
          `}
        >
          <PageBreadcrumb
            items={[
              {
                label: "Blog",
              },
            ]}
          />

          <h1
            className={`
              ${BLOG_PAGE_HEADING_SPACING}

              mt-3

              text-[26px]

              font-extrabold

              leading-tight

              text-[var(--foreground)]

              md:text-[36px]

              lg:text-[40px]
            `}
          >
            Insights That Help You Build, Market and Grow
          </h1>

          <p
            className={`
              ${BLOG_PAGE_DESCRIPTION_SPACING}

              mx-auto

              mt-3

              max-w-2xl

              text-[14px]

              leading-6

              text-[var(--foreground-muted)]

              lg:text-[15px]

              lg:leading-7
            `}
          >
            Practical guides, proven
            strategies, and actionable
            insights for affiliate
            marketers, entrepreneurs,
            and online sellers looking
            to grow faster.
          </p>
        </header>

        {/* Featured */}

        <div
          className={
            BLOG_PAGE_FEATURED_SPACING
          }
        >
          <BlogFeatured
            post={featuredPost}
          />
        </div>

        {/* Articles */}

        <div
          className={
            BLOG_PAGE_ARTICLES_SPACING
          }
        >
          <BlogGrid
            posts={otherPosts}
          />
        </div>
      </Container>
    </section>
  );
}