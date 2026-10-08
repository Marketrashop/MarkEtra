import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { ProductPage } from "@/components/Product";

import {
  getProductBySlug,
} from "@/lib/products/product.service";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product =
    await getProductBySlug(slug);

  if (!product) {
    return {
      title:
        "Product Not Found | MarkEtra",
    };
  }

  return {
    title: `${product.name} | MarkEtra`,

    description:
      product.description,
  };
}

export default async function Product({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product =
    await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductPage
      product={product}
      environment="public"
    />
  );
}