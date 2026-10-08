import { HighConvertingProducts } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Choose High Converting Products to Promote",
  description:
    "Learn how to identify high converting affiliate products that maximize clicks, conversions, and long term commissions.",
};

export default function HighConvertingProductsPage() {
  return (
    <>
      <BlogArticleLayout
        currentSlug="high-converting-products"
        title="How to Choose High Converting Products to Promote"
        author="MarkEtra Team"
        publishedAt="May 21, 2026"
        readingTime="9 min read"
        image={{
          src: "/assets/images/blog/blog-2.png",
          alt: "How to Choose High Converting Products to Promote",
        }}
      >
        <HighConvertingProducts />
      </BlogArticleLayout>
    </>
  );
}