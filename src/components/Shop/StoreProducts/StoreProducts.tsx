import { Container } from "@/components/layout";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import type {
  AppEnvironment,
} from "@/types/environment";

import StoreProductCard from "./StoreProductCard";

type StoreProductsProps = {
  products: ProductCard[];

  environment?: AppEnvironment;

  variant?: "default" | "compact";

  showHeading?: boolean;

  useContainer?: boolean;

  gridClassName?: string;

  eyebrow?: string;

  title?: string;

  subtitle?: string;

  sectionClassName?: string;
};

export default function StoreProducts({
  products,
  environment = "public",
  variant = "default",
  showHeading = true,
  useContainer = true,
  gridClassName,
  sectionClassName,
  eyebrow = "Store Products",
  title = "Our Store Products",
  subtitle =
    "Discover our most popular products, carefully selected for their quality, performance, and exceptional value.",
}: StoreProductsProps) {
const sectionClasses =
  environment === "user"
    ? `
        pt-10
        pb-6
        md:pt-12
        lg:pt-14
        lg:pb-8
      `
    : `
        py-10
        md:py-12
        lg:py-14
      `;

  const content = (
    <>
      {showHeading && (
        <div
          className="
            mx-auto
            mb-7
            max-w-[560px]
            px-4
            text-center
            md:mb-8
          "
        >
          <span
            className="
              text-[13px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#5658EC]
              sm:text-[14px]
            "
          >
            {eyebrow}
          </span>

          <h2
            className="
              mt-2
              text-[20px]
              font-extrabold
              leading-tight
              text-[var(--foreground)]
              sm:text-[24px]
              lg:text-[28px]
            "
          >
            {title}
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[500px]
              text-[12px]
              leading-6
              text-[var(--foreground-muted)]
              sm:text-[13px]
              lg:text-[14px]
            "
          >
            {subtitle}
          </p>
        </div>
      )}

      <div
        className={
          gridClassName ??
          `
            grid
            grid-cols-2
            content-start
            gap-3
            sm:gap-4
            lg:grid-cols-3
            2xl:grid-cols-4
          `
        }
      >
        {products.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            variant={variant}
            environment={environment}
          />
        ))}
      </div>
    </>
  );

  if (!showHeading) {
    return useContainer ? (
      <Container>{content}</Container>
    ) : (
      content
    );
  }

  const wrappedContent = useContainer ? (
    <Container>{content}</Container>
  ) : (
    content
  );

  return (
    <section
      className={
        sectionClassName ??
        sectionClasses
      }
      style={{
        background:
          "var(--store-products-bg)",
      }}
    >
      {wrappedContent}
    </section>
  );
}