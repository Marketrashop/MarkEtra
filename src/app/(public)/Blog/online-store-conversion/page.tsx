import type { Metadata } from "next";

import { OnlineStoreConversion } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";

export const metadata: Metadata = {
  title: "Why Most Online Stores Fail to Convert Visitors",
  description:
    "Discover the common conversion mistakes that prevent online stores from turning visitors into customers and learn how to fix them.",
};

export default function OnlineStoreConversionPage() {
  return (
    <BlogArticleLayout
      currentSlug="online-store-conversion"
      title="Why Most Online Stores Fail to Convert Visitors"
      author="MarkEtra Team"
      publishedAt="Jul 03, 2026"
      readingTime="9 min read"
      image={{
        src: "/assets/images/blog/blog-5.png",
        alt: "Why Most Online Stores Fail to Convert Visitors",
      }}
    >
      <OnlineStoreConversion />
    </BlogArticleLayout>
  );
}