-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "logoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_link_key" ON "public"."Partner"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_logoId_key" ON "public"."Partner"("logoId");

-- CreateIndex
CREATE INDEX "Partner_name_idx" ON "public"."Partner"("name");

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Partner" ADD CONSTRAINT "Partner_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "public"."MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
