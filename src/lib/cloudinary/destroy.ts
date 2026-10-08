import cloudinary from "./client";

export async function destroyImage(
  publicId: string
) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}