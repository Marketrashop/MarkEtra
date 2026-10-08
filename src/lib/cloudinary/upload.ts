import { UploadApiOptions } from "cloudinary";

import cloudinary from "./client";

export async function uploadImage(
  file: File,
  options: UploadApiOptions,
) {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  return new Promise<{
    publicId: string;
    secureUrl: string;
  }>((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        },
      );

    stream.end(buffer);
  });
}