"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
  type Transition,
} from "framer-motion";

import type {
  ProductCard,
} from "@/lib/products/product.types";

import {
  Col,
  Container,
  Row,
} from "@/components/layout";

import FeaturedProductBackground from "./FeaturedProductBackground";
import FeaturedProductContent from "./FeaturedProductContent";
import FeaturedProductImage from "./FeaturedProductImage";

type FeaturedProductProps = {
  products: ProductCard[];
};

const ROTATION_INTERVAL =
  15 * 1000;

const PRODUCT_TRANSITION_DURATION =
  2 * 1000;

const PRODUCT_TRANSITION_START =
  ROTATION_INTERVAL -
  PRODUCT_TRANSITION_DURATION;

const PRODUCT_TRANSITION: Transition = {
  duration: 2,
  ease: [
    0.22,
    1,
    0.36,
    1,
  ],
};

export default function FeaturedProduct({
  products,
}: FeaturedProductProps) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false);

  const activeProduct =
    products[activeIndex];

  const nextIndex =
    products.length > 1
      ? (activeIndex + 1) %
        products.length
      : activeIndex;

  const nextProduct =
    products[nextIndex];

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    let transitionTimeout:
      number | undefined;

    let rotationTimeout:
      number | undefined;

    transitionTimeout =
      window.setTimeout(() => {
        setIsTransitioning(true);

        rotationTimeout =
          window.setTimeout(() => {
            setActiveIndex(
              (currentIndex) =>
                (currentIndex + 1) %
                products.length,
            );

            setIsTransitioning(false);
          },
          PRODUCT_TRANSITION_DURATION);
      }, PRODUCT_TRANSITION_START);

    return () => {
      if (
        transitionTimeout !==
        undefined
      ) {
        window.clearTimeout(
          transitionTimeout,
        );
      }

      if (
        rotationTimeout !==
        undefined
      ) {
        window.clearTimeout(
          rotationTimeout,
        );
      }
    };
  }, [
    activeIndex,
    products.length,
  ]);

  useEffect(() => {
    if (
      activeIndex >=
      products.length
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    products.length,
  ]);

  useEffect(() => {
    setIsTransitioning(false);
  }, [products.length]);

  if (!activeProduct) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden

        pt-[60px]
        pb-[60px]

        md:pt-[80px]
        md:pb-[70px]

        lg:pt-[115px]
        lg:pb-[85px]

        xl:pt-[120px]
        xl:pb-[90px]
      "
      style={{
        background:
          "var(--featured-bg)",
      }}
    >
      <FeaturedProductBackground />

      <Container className="relative z-10">
        <Row className="items-center">
          <Col
            lg={6}
            className="
              order-2
              lg:order-1
              lg:pr-1
            "
          >
            <div className="relative">
              {/* Current image */}
              <div className="relative z-10">
                <FeaturedProductImage
                  product={
                    activeProduct
                  }
                />
              </div>

              {/* Incoming image */}
              {products.length > 1 &&
                isTransitioning && (
                  <motion.div
                    key={`incoming-image-${nextProduct.id}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={
                      PRODUCT_TRANSITION
                    }
                    className="
                      absolute
                      inset-0
                      z-20
                      pointer-events-none
                    "
                  >
                    <FeaturedProductImage
                      product={
                        nextProduct
                      }
                    />
                  </motion.div>
                )}
            </div>
          </Col>

          <Col
            lg={6}
            className="
              mb-12
              order-1
              lg:order-2
              lg:mb-0
              lg:pl-1
            "
          >
            <div className="relative">
              {/* Current content */}
              <motion.div
                animate={{
                  opacity:
                    isTransitioning
                      ? 0
                      : 1,
                  x:
                    isTransitioning
                      ? -10
                      : 0,
                  y:
                    isTransitioning
                      ? -2
                      : 0,
                }}
                transition={
                  PRODUCT_TRANSITION
                }
              >
                <FeaturedProductContent
                  product={
                    activeProduct
                  }
                />
              </motion.div>

              {/* Incoming content */}
              {products.length > 1 &&
                isTransitioning && (
                  <motion.div
                    key={`incoming-content-${nextProduct.id}`}
                    initial={{
                      opacity: 0,
                      x: 10,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }}
                    transition={
                      PRODUCT_TRANSITION
                    }
                    className="
                      absolute
                      inset-0
                    "
                  >
                    <FeaturedProductContent
                      product={
                        nextProduct
                      }
                    />
                  </motion.div>
                )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}