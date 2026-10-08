"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Image from "next/image";

import {
  Expand,
  Heart,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import ProductImageModal from "./ProductImageModal";

import type {
  ProductImage,
  ProductVariantImage,
} from "@/lib/products/product.types";

import { useAuth } from "@/context/AuthContext";

import { useWishlist } from "@/context/WishlistContext";

type ProductGalleryProps = {
  productId: string;

  images: ProductImage[];

  productName: string;

  selectedVariantSizeId?:
    | string
    | null;

  selectedVariantImages?:
    | ProductVariantImage[]
    | null;

  selectedImage?: ProductImage;

  onImageChange?: (
    image: ProductImage,
  ) => void;
};

export default function ProductGallery({
  productId,
  images,
  productName,
  selectedVariantSizeId,
  selectedVariantImages,
  selectedImage,
  onImageChange,
}: ProductGalleryProps) {
  const productImages =
    useMemo(
      () => images ?? [],
      [images],
    );

  const variantImages =
    useMemo(
      () =>
        (
          selectedVariantImages ??
          []
        ).map(
          (image) => ({
            id:
              image.id,

            imageKey:
              image.imageKey,

            imageUrl:
              image.imageUrl,

            altText:
              image.altText,

            isPrimary:
              image.isPrimary,

            sortOrder:
              image.sortOrder,
          }),
        ),
      [selectedVariantImages],
    );

  const galleryImages =
    variantImages.length > 0
      ? variantImages
      : productImages;

  const primaryGalleryImage =
    useMemo(() => {
      return (
        galleryImages.find(
          (image) =>
            image.isPrimary,
        ) ??
        galleryImages[0]
      );
    }, [galleryImages]);

  const [
    internalImage,
    setInternalImage,
  ] = useState<
    ProductImage | undefined
  >(primaryGalleryImage);

  const activeImage =
    selectedImage ??
    internalImage ??
    primaryGalleryImage;

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

const {
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
  loading: wishlistLoading,
} = useWishlist();

const inWishlist = isInWishlist(
  productId,
  selectedVariantSizeId ?? undefined,
);

  const {
    user,
    loading:
      authLoading,
  } = useAuth();

  const router =
    useRouter();

  useEffect(() => {
    if (!primaryGalleryImage) {
      setInternalImage(
        undefined,
      );

      return;
    }

    setInternalImage(
      primaryGalleryImage,
    );

    setIsModalOpen(
      false,
    );
  }, [
    primaryGalleryImage,
  ]);

  useEffect(() => {
    if (
      selectedImage &&
      galleryImages.some(
        (image) =>
          image.id ===
          selectedImage.id,
      )
    ) {
      return;
    }

    if (
      selectedImage &&
      galleryImages.length > 0
    ) {
      setInternalImage(
        primaryGalleryImage,
      );
    }
  }, [
    galleryImages,
    primaryGalleryImage,
    selectedImage,
  ]);

  if (!activeImage) {
    return null;
  }

  const handleImageChange = (
    image: ProductImage,
  ) => {
    onImageChange?.(
      image,
    );

    if (!onImageChange) {
      setInternalImage(
        image,
      );
    }
  };

async function handleWishlistToggle() {
  if (
    wishlistLoading ||
    authLoading
  ) {
    return;
  }

  if (!user) {
    toast.info(
      "Sign in to save this product to your wishlist.",
    );

    const params =
      new URLSearchParams({
        redirect:
          "/wishlist",

        wishlistProduct:
          productId,
      });

    if (
      selectedVariantSizeId
    ) {
      params.set(
        "wishlistVariantSize",
        selectedVariantSizeId,
      );
    }

    router.push(
      `/Auth?${params.toString()}`,
    );

    return;
  }

try {
  if (inWishlist) {
await removeFromWishlist(
  productId,
  selectedVariantSizeId ??
    undefined,
);

    toast.success(
      "Removed from wishlist.",
    );
  } else {
await addToWishlist(
  productId,
  selectedVariantSizeId ??
    undefined,
);

    toast.success(
      "Added to wishlist.",
    );
  }
} catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to update wishlist.",
    );
  }
}

  return (
    <>
      <div
        className="
          flex
          flex-col-reverse
          items-start
          gap-3
          lg:flex-row
        "
      >
        <div
          className="
            flex
            max-w-full
            gap-2
            overflow-x-auto
            pb-1
            lg:w-[70px]
            lg:flex-col
            lg:overflow-visible
          "
        >
          {galleryImages
            .slice(0, 4)
            .map(
              (
                image,
                index,
              ) => (
                <button
                  key={
                    image.id
                  }
                  type="button"
                  onClick={() =>
                    handleImageChange(
                      image,
                    )
                  }
                  className={`
                    relative
h-[58px]
w-[58px]
sm:h-[68px]
sm:w-[68px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border-2
                    transition-all
                    duration-300

                    ${
                      activeImage.id ===
                      image.id
                        ? `
                            border-[var(--primary)]
                            ring-2
                            ring-[var(--primary)]/20
                          `
                        : `
                            border-[var(--border)]
                            hover:border-[var(--primary)]
                          `
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
                      `${productName} ${index + 1}`
                    }
                    fill
                    sizes="68px"
                    className="
                      object-cover
                    "
                  />
                </button>
              ),
            )}
        </div>

        <div
className="
  group
  relative
  w-full
  max-w-[440px]
  aspect-[1/1]
  overflow-hidden
  rounded-2xl
  border
  border-[var(--border)]
  bg-[var(--surface)]
  shadow-sm
  sm:max-w-[480px]
  sm:aspect-[4/5]
  sm:rounded-3xl
  lg:max-w-[520px]
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
            sizes="
              (max-width:768px) 100vw,
              (max-width:1280px) 45vw,
              560px
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          <button
            type="button"
            aria-label={
              inWishlist
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            aria-pressed={
              inWishlist
            }
            disabled={
              wishlistLoading
            }
            onClick={
              handleWishlistToggle
            }
            className="
              absolute
              right-4
              top-4
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]/95
              text-[var(--foreground)]
              shadow-lg
              backdrop-blur-sm
              transition-all
              duration-300
              hover:scale-105
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {wishlistLoading ? (
              <Loader2
                size={
                  18
                }
                strokeWidth={
                  2.2
                }
                className="
                  animate-spin
                "
              />
            ) : (
              <Heart
                size={
                  18
                }
                strokeWidth={
                  2.2
                }
                fill={
                  inWishlist
                    ? "currentColor"
                    : "none"
                }
                className={
                  inWishlist
                    ? "text-[var(--primary)]"
                    : undefined
                }
              />
            )}
          </button>

          <button
            type="button"
            aria-label="Expand image"
            onClick={() =>
              setIsModalOpen(
                true,
              )
            }
            style={{
              backgroundColor:
                "var(--services-cta-primary-bg)",

              color:
                "var(--services-cta-primary-text)",
            }}
            className="
              absolute
              bottom-4
              right-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <Expand
              size={
                18
              }
              strokeWidth={
                2.2
              }
            />
          </button>
        </div>
      </div>

      <ProductImageModal
        open={
          isModalOpen
        }
        images={
          galleryImages
        }
        activeImage={
          activeImage
        }
        onImageChange={
          handleImageChange
        }
        onClose={() =>
          setIsModalOpen(
            false,
          )
        }
        productName={
          productName
        }
      />
    </>
  );
}