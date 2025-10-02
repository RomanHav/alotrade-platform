/*
  Warnings:

  - You are about to alter the column `seoDescription` on the `Brand` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.
  - You are about to alter the column `seoTitle` on the `Brand` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `seoTitle` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `seoDescription` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.

*/
-- AlterTable
ALTER TABLE "public"."Brand" ALTER COLUMN "seoDescription" SET DATA TYPE VARCHAR(160),
ALTER COLUMN "seoTitle" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "seoTitle" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "seoDescription" SET DATA TYPE VARCHAR(160);

-- CreateTable
CREATE TABLE "public"."SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "defaultSeoTitle" VARCHAR(60),
    "defaultSeoDescription" VARCHAR(160),
    "titleSuffix" VARCHAR(30),
    "ogImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
