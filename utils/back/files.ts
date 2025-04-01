import * as Minio from "minio";
import type internal from "stream";

export type FileInDBProp = {
  filenameInBucket: string;
  originalfilename: string;
  fileSize: number;
};

export const MAX_FILE_SIZE_NEXTJS_ROUTE = 4;
export const MAX_FILE_SIZE_S3_ENDPOINT = 100;
export const FILE_NUMBER_LIMIT = 10;

/**
 *
 * @param files array of files
 * @returns FormData object
 */
export function createFormData(files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

export const s3Client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT as string,
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  useSSL: process.env.S3_USE_SSL === "true",
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3Client.bucketExists(bucketName);
  if (!bucketExists) {
    await s3Client.makeBucket(bucketName);
  }
}

export async function saveFileInBucket({
  bucketName,
  filename,
  file,
}: {
  bucketName: string;
  filename: string;
  file: Buffer | internal.Readable;
}) {
  // Create bucket if it doesn't exist
  await createBucketIfNotExists(bucketName);

  // check if file exists
  const fileExists = await checkFileExistsInBucket({
    bucketName,
    filename,
  });

  if (fileExists) {
    throw new Error("File already exists");
  }

  // Upload image to S3 bucket
  await s3Client.putObject(bucketName, filename, file);
}

export async function checkFileExistsInBucket({
  bucketName,
  filename,
}: {
  bucketName: string;
  filename: string;
}) {
  try {
    await s3Client.statObject(bucketName, filename);
  } catch (error) {
    return false;
  }
  return true;
}

export async function getFileFromBucket({
  bucketName,
  filename,
}: {
  bucketName: string;
  filename: string;
}) {
  try {
    await s3Client.statObject(bucketName, filename);
  } catch (error) {
    console.error(error);
    return null;
  }
  return await s3Client.getObject(bucketName, filename);
}
