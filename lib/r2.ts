
import "server-only";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const bucketName = process.env.R2_BUCKET_NAME?.trim();

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Missing Cloudflare R2 environment variables");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },

  // Avoid optional SDK checksum headers when they aren't required.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, };
export { bucketName };

export function getPublicImageUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("Missing R2_PUBLIC_BASE_URL");
  }

  return `${baseUrl}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
