import type { Metadata } from "next";

import { BlogPage } from "@/components/home/Blog/BlogPage";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Discover practical guides, affiliate marketing strategies, SEO tips, ecommerce insights, and proven techniques to grow your online business with MarkEtra.",
};

export default function Blog() {
  return <BlogPage />;
}