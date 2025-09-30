import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ProductStatus } from '@prisma/client';
import { slug } from '@/lib/slug';
type VariantInput = {
  id?: string;
  label?: string | null;
  volumeMl?: number | null;
  sku?: string | null;
  priceCents?: number | null;
  position: number;
};

type SaveInput = {
  id?: string;
  name: string;
  status: ProductStatus; // ✅ замість union зі строк
  brandId: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants?: VariantInput[];
};

export async function POST(req: Request) {
  const data: SaveInput = await req.json();

  if (data.id) {
    const { id, variants = [], ...rest } = data;

    // rest тепер сумісний з ProductUpdateInput
    await prisma.$transaction([
      prisma.product.update({ where: { id }, data: rest }),
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.productVariant.createMany({
        data: variants.map((v, i) => ({
          productId: id,
          label: v.label ?? null,
          volumeMl: v.volumeMl ?? null,
          sku: v.sku ?? null,
          priceCents: v.priceCents ?? null,
          position: v.position ?? i,
        })),
      }),
    ]);
  } else {
    const { variants = [], ...rest } = data;
    await prisma.product.create({
      data: {
        ...rest,
        slug: await slug(data.name),
        variants: {
          createMany: {
            data: variants.map((v, i) => ({
              label: v.label ?? null,
              volumeMl: v.volumeMl ?? null,
              sku: v.sku ?? null,
              priceCents: v.priceCents ?? null,
              position: v.position ?? i,
            })),
          },
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
