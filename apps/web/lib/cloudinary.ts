import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export function hasCloudinaryConfig() {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
  );
}

export async function uploadRawAsset(data: string, publicId: string) {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary env missing.");
  }

  return cloudinary.uploader.upload(`data:application/pdf;base64,${data}`, {
    resource_type: "raw",
    public_id: publicId,
    overwrite: true,
  });
}
