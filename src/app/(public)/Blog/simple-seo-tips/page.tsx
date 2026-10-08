import { SimpleSEOTips } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple SEO Tips Every Online Seller Should Know",
  description:
    "Improve your search visibility with practical SEO tips that help online sellers attract more organic traffic and customers.",
};

export default function SimpleSEOTipsPage() {
  return (
    <>
      <BlogArticleLayout
        currentSlug="simple-seo-tips"
        title="Simple SEO Tips Every Online Seller Should Know"
        author="MarkEtra Team"
        publishedAt="May 24, 2026"
        readingTime="9 min read"
        image={{
          src: "/assets/images/blog/blog-3.png",
          alt: "Simple SEO Tips Every Online Seller Should Know",
        }}
      >
        <SimpleSEOTips />
      </BlogArticleLayout>
    </>
  );
}