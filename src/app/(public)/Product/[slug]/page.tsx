import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPage } from "@/components/Product";
import { getProductBySlug } from "@/lib/products/product.service";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SITE_URL = "https://marketra.shop";
const DEFAULT_IMAGE = "/assets/images/og-image.png";

function getAbsoluteImageUrl(
  image: string | null | undefined,
): string {
  if (!image) {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }

  try {
    return new URL(image, SITE_URL).toString();
  } catch {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | MarkEtra",
    };
  }

const primaryImage =
  product.images.find((image) => image.isPrimary) ??
  product.images[0];

const productImage = getAbsoluteImageUrl(
  primaryImage?.imageUrl,
);

  const description =
    product.description?.trim() ||
    `Discover ${product.name} on MarkEtra.`;

  return {
    title: `${product.name} | MarkEtra`,
    description,

    openGraph: {
      type: "website",
      url: `${SITE_URL}/Product/${encodeURIComponent(slug)}`,
      siteName: "MarkEtra",
      title: product.name,
      description,
      images: [
        {
          url: productImage,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [
        {
          url: productImage,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function Product({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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