import { AffiliateMarketingMistakes } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10 Affiliate Marketing Mistakes Beginners Should Avoid",
  description:
    "Avoid the most common affiliate marketing mistakes beginners make and build a stronger foundation for long term success.",
};

export default function AffiliateMarketingMistakesPage() {
  return (
    <>
      <BlogArticleLayout
        currentSlug="affiliate-marketing-mistakes"
        title="10 Affiliate Marketing Mistakes Beginners Should Avoid"
        author="MarkEtra Team"
        publishedAt="May 18, 2026"
        readingTime="8 min read"
        image={{
          src: "/assets/images/blog/blog-1.png",
          alt: "10 Affiliate Marketing Mistakes Beginners Should Avoid",
        }}
      >
        <AffiliateMarketingMistakes />
      </BlogArticleLayout>
    </>
  );
}