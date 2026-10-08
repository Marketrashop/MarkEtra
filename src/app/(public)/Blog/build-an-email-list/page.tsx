import type { Metadata } from "next";

import { BuildAnEmailList } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";

export const metadata: Metadata = {
  title: "Build an Email List That Actually Converts",
  description:
    "Learn practical email marketing strategies to build an engaged subscriber list that drives repeat sales and long term customer relationships.",
};

export default function BuildAnEmailListPage() {
  return (
    <BlogArticleLayout
      currentSlug="build-an-email-list"
      title="Build an Email List That Actually Converts"
      author="MarkEtra Team"
      publishedAt="Jul 10, 2026"
      readingTime="8 min read"
      image={{
        src: "/assets/images/blog/blog-4.png",
        alt: "Build an Email List That Actually Converts",
      }}
    >
      <BuildAnEmailList />
    </BlogArticleLayout>
  );
}