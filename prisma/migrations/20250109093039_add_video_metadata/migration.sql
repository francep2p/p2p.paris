/*
  Warnings:

  - Added the required column `video_thumbnail_image_id` to the `Talk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `Talk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Talk" ADD COLUMN     "video_thumbnail_image_id" TEXT NOT NULL,
ADD COLUMN     "video_url" TEXT NOT NULL;
