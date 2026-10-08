"use client";

import { useEffect } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import type {
  ProductImage,
} from "@/lib/products/product.types";

type ProductImageModalProps = {
  open: boolean;

  images: ProductImage[];

  activeImage: ProductImage;

  onImageChange: (
    image: ProductImage,
  ) => void;

  onClose: () => void;

  productName: string;
};

export default function ProductImageModal({
  open,
  images,
  activeImage,
  onImageChange,
  onClose,
  productName,
}: ProductImageModalProps) {

const currentIndex =
  images.findIndex(
    (image) =>
      image.id === activeImage.id,
  );

  function previous() {
    const nextIndex =
      currentIndex <= 0
        ? images.length - 1
        : currentIndex - 1;

    onImageChange(images[nextIndex]);
  }

  function next() {
    const nextIndex =
      currentIndex >= images.length - 1
        ? 0
        : currentIndex + 1;

    onImageChange(images[nextIndex]);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      switch (event.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowLeft":
          previous();
          break;

        case "ArrowRight":
          next();
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    currentIndex,
    activeImage,
    onClose,
  ]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed

            inset-0

            z-[9999]

            flex

            items-center

            justify-center

            bg-black/35

            p-5

            backdrop-blur-2xl

            backdrop-saturate-150
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              scale: 0.92,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.92,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative

              flex

              w-full

              max-w-6xl

              flex-col

              items-center
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                absolute

                right-0

                top-0

                z-20

                flex

                h-12

                w-12

                items-center

                justify-center

                rounded-full

                border

                border-white/20

                bg-white/10

                text-white

                shadow-xl

                backdrop-blur-xl

                transition-all
                duration-300

                hover:scale-105

                hover:bg-white/20
              "
            >
              <X size={22} />
            </button>

            <div
              className="
                relative

                h-[70vh]

                w-full

                overflow-hidden

                rounded-[32px]

                border

                border-white/20

                bg-white/10

                backdrop-blur-2xl

                shadow-2xl
              "
            >
<Image
src={
  activeImage.imageUrl ??
  "/assets/images/placeholder-product.jpg"
}
  alt={
    activeImage.altText ??
    productName
  }
                fill
                priority
                sizes="100vw"
                className="
                  object-contain
                "
              />

              <button
                type="button"
                onClick={previous}
                className="
                  absolute

                  left-5

                  top-1/2

                  flex

                  h-12

                  w-12

                  -translate-y-1/2

                  items-center

                  justify-center

                  rounded-full

                  border

                  border-white/20

                  bg-white/10

                  text-white

                  shadow-lg

                  backdrop-blur-xl

                  transition-all
                  duration-300

                  hover:scale-105

                  hover:bg-white/20
                "
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                onClick={next}
                className="
                  absolute

                  right-5

                  top-1/2

                  flex

                  h-12

                  w-12

                  -translate-y-1/2

                  items-center

                  justify-center

                  rounded-full

                  border

                  border-white/20

                  bg-white/10

                  text-white

                  shadow-lg

                  backdrop-blur-xl

                  transition-all
                  duration-300

                  hover:scale-105

                  hover:bg-white/20
                "
              >
                <ChevronRight />
              </button>
            </div>

            <div
              className="
                mt-6

                flex

                flex-wrap

                justify-center

                gap-4
              "
            >
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    onImageChange(image)
                  }
                  className={`
                    relative

                    h-20

                    w-20

                    overflow-hidden

                    rounded-xl

                    border-2

                    transition-all

                    ${
                      activeImage.id === image.id
                        ? "border-[var(--primary)]"
                        : "border-transparent"
                    }
                  `}
                >
<Image
src={
  image.imageUrl ??
  "/assets/images/placeholder-product.jpg"
}
  alt={
    image.altText ??
    productName
  }
                    fill
                    sizes="80px"
                    className="
                      object-cover
                    "
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}