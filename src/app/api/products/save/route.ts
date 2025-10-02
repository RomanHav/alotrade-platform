import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ProductStatus } from '@prisma/client';
import { slug as makeSlug } from '@/lib/slug';

type VariantInput = {
  id?: string;
  label?: string | null;
  volumeMl?: number | null;
  position: number;
};
type SaveInput = {
  id?: string;
  name: string;
  status: ProductStatus; // 'ACTIVE' | 'DRAFT' | 'ARCHIVE'
  brandId: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants?: VariantInput[];
  coverId?: string | null; // MediaAsset.id
  imageIds?: string[]; // масив MediaAsset.id (у потрібному порядку)
};

export async function POST(req: Request) {
  const data: SaveInput = await req.json();

  if (data.id) {
    const { id, variants = [], imageIds = [], ...rest } = data;

    await prisma.$transaction(async (tx) => {
      // 1) тільки наявні media
      const existing = await tx.mediaAsset.findMany({
        where: { id: { in: imageIds } },
        select: { id: true },
      });
      const valid = existing.map((m) => m.id);

      // 2) безпечний coverId
      let safeCoverId: string | null = rest.coverId ?? null;
      if (!safeCoverId || !valid.includes(safeCoverId)) safeCoverId = valid[0] ?? null;

      // 3) оновлюємо продукт (+ coverId)
      await tx.product.update({ where: { id }, data: { ...rest, coverId: safeCoverId } });

      // 4) варіанти
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length) {
        await tx.productVariant.createMany({
          data: variants.map((v, i) => ({
            productId: id,
            label: v.label ?? null,
            volumeMl: v.volumeMl ?? null,
            position: v.position ?? i,
          })),
        });
      }

      // 5) галерея
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (valid.length) {
        await tx.productImage.createMany({
          data: valid.map((mediaId, i) => ({ productId: id, mediaId, position: i })),
        });
      }
    });
  } else {
    const { variants = [], imageIds = [], ...rest } = data;

    await prisma.$transaction(async (tx) => {
      const existing = await tx.mediaAsset.findMany({
        where: { id: { in: imageIds } },
        select: { id: true },
      });
      const valid = existing.map((m) => m.id);
      let safeCoverId: string | null = rest.coverId ?? null;
      if (!safeCoverId || !valid.includes(safeCoverId)) safeCoverId = valid[0] ?? null;

      const created = await tx.product.create({
        data: { ...rest, slug: makeSlug(data.name), coverId: safeCoverId },
      });

      if (variants.length) {
        await tx.productVariant.createMany({
          data: variants.map((v, i) => ({
            productId: created.id,
            label: v.label ?? null,
            volumeMl: v.volumeMl ?? null,
            position: v.position ?? i,
          })),
        });
      }

      if (valid.length) {
        await tx.productImage.createMany({
          data: valid.map((mediaId, i) => ({ productId: created.id, mediaId, position: i })),
        });
      }
    });
  }

  return NextResponse.json({ ok: true });
}
