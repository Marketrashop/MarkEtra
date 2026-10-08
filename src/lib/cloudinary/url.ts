const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const DEFAULT_TRANSFORMATION =
  "f_auto,q_auto";

export function getCloudinaryImageUrl(
  image: string | null | undefined,
  transformation = DEFAULT_TRANSFORMATION,
) {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("/") ||
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured."
    );
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${image}`;
}