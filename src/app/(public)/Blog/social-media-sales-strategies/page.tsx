import type { Metadata } from "next";

import { SocialMediaSalesStrategies } from "@/components/home/Blog/Articles";
import { BlogArticleLayout } from "@/components/home/Blog/layout";

export const metadata: Metadata = {
  title: "7 Social Media Strategies That Drive Real Sales",
  description:
    "Learn practical social media strategies that help attract qualified customers, build trust, and generate consistent sales.",
};

export default function SocialMediaSalesStrategiesPage() {
  return (
    <BlogArticleLayout
      currentSlug="social-media-sales-strategies"
      title="7 Social Media Strategies That Drive Real Sales"
      author="MarkEtra Team"
      publishedAt="Jun 25, 2026"
      readingTime="8 min read"
      image={{
        src: "/assets/images/blog/blog-6.png",
        alt: "7 Social Media Strategies That Drive Real Sales",
      }}
    >
      <SocialMediaSalesStrategies />
    </BlogArticleLayout>
  );
}