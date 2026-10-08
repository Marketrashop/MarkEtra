import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import HomeStoreProducts from "@/components/home/HomeStoreProducts";
import HomeProductGallery from "@/components/home/HomeProductGallery";
import SectionDivider from "@/components/home/SectionDivider";
import HomeCategoryProductExplorer from "@/components/home/HomeCategoryProductExplorer";
import Experience from "@/components/home/Experience";
import PricingPlans from "@/components/home/PricingPlans";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import Testimonials from "@/components/home/Testimonials";
import Blog from "@/components/home/Blog";

import NewsletterGate from "@/components/newsletter/NewsletterGate";

import {
  getPublishedProducts,
} from "@/lib/products/product.service";

import {
  listCategoryOptionsService,
} from "@/services/category.service";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const [
    products,
    categories,
  ] = await Promise.all([
    getPublishedProducts(),
    listCategoryOptionsService(),
  ]);

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured &&
        product.status === "ACTIVE",
    );

  return (
    <>
      <NewsletterGate />

      <Hero />

      <HomeCategoryProductExplorer
        products={products}
        categories={categories}
      />

<FeaturedProduct
  products={featuredProducts}
/>

      <HomeStoreProducts
        products={
          featuredProducts
        }
      />

      <SectionDivider />

      <HomeProductGallery
        products={products}
      />

      <Experience />

      <PricingPlans />

      <Newsletter />

      <FAQ />

      <Testimonials />

      <Blog />
    </>
  );
}