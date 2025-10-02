import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ProductStatus } from '@prisma/client';
import { slug } from '@/lib/slug';

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
      await tx.product.update({ where: { id }, data: rest });

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

      await tx.productImage.deleteMany({ where: { productId: id } });
      if (imageIds.length) {
        await tx.productImage.createMany({
          data: imageIds.map((mediaId, i) => ({ productId: id, mediaId, position: i })),
        });
      }
    });
  } else {
    const { variants = [], imageIds = [], ...rest } = data;

    await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: { ...rest, slug: await slug(data.name) },
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

      if (imageIds.length) {
        await tx.productImage.createMany({
          data: imageIds.map((mediaId, i) => ({ productId: created.id, mediaId, position: i })),
        });
      }
    });
  }

  return NextResponse.json({ ok: true });
}
