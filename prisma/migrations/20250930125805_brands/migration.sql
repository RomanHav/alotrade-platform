-- CreateEnum
CREATE TYPE "public"."BrandStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVE');

-- DropIndex
DROP INDEX "public"."Brand_slug_idx";

-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "coverId" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "status" "public"."BrandStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Brand_status_idx" ON "public"."Brand"("status");

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "public"."MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
