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
  status: ProductStatus;
  brandId: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants?: VariantInput[];
  coverId?: string | null;
  imageIds?: string[];
};

export async function POST(req: Request) {
  const data: SaveInput = await req.json();

  if (data.id) {
    const { id, variants = [], imageIds = [], ...rest } = data;

    await prisma.$transaction(async (tx) => {
      // 1) Проверяем, какие media реально существуют
      const exists = await tx.mediaAsset.findMany({
        where: { id: { in: imageIds } },
        select: { id: true },
      });
      const validIds = exists.map((m) => m.id);

      // 2) Делаем coverId безопасным
      let safeCoverId: string | null = rest.coverId ?? null;
      if (!safeCoverId || !validIds.includes(safeCoverId)) {
        safeCoverId = validIds[0] ?? null; // если есть картинки — выберем первую, иначе null
      }

      // 3) Обновляем сам продукт (+ coverId)
      await tx.product.update({
        where: { id },
        data: { ...rest, coverId: safeCoverId },
      });

      // 4) Пересобираем варианты
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

      // 5) Пересобираем галерею по валидным media
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (validIds.length) {
        await tx.productImage.createMany({
          data: validIds.map((mediaId, i) => ({ productId: id, mediaId, position: i })),
        });
      }
    });
  } else {
    const { variants = [], imageIds = [], ...rest } = data;

    await prisma.$transaction(async (tx) => {
      // 1) Отфильтруем несуществующие media
      const exists = await tx.mediaAsset.findMany({
        where: { id: { in: imageIds } },
        select: { id: true },
      });
      const validIds = exists.map((m) => m.id);

      // 2) Подготовим coverId
      let safeCoverId: string | null = rest.coverId ?? null;
      if (!safeCoverId || !validIds.includes(safeCoverId)) {
        safeCoverId = validIds[0] ?? null;
      }

      // 3) Создаём продукт
      const created = await tx.product.create({
        data: { ...rest, slug: await makeSlug(data.name), coverId: safeCoverId },
      });

      // 4) Варианты
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

      // 5) Галерея
      if (validIds.length) {
        await tx.productImage.createMany({
          data: validIds.map((mediaId, i) => ({ productId: created.id, mediaId, position: i })),
        });
      }
    });
  }

  return NextResponse.json({ ok: true });
}
