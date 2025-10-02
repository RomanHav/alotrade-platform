import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';

  const [brands, product] = await Promise.all([
    prisma.brand.findMany({ select: { id: true, name: true } }),
    isNew
      ? null
      : prisma.product.findUnique({
          where: { id },
          include: {
            variants: { orderBy: { position: 'asc' } },
            cover: true,
            images: {
              orderBy: { position: 'asc' },
              include: { media: { select: { id: true, url: true, alt: true } } },
            },
          },
        }),
  ]);

  if (!isNew && !product) notFound();

  const gallery =
    product?.images
      .filter((pi) => !!pi.media?.url)
      .map((pi) => ({ id: pi.media.id, url: pi.media.url, alt: pi.media.alt ?? null })) ?? [];

  const images =
    product?.cover && !gallery.some((g) => g.id === product.cover!.id)
      ? [
          { id: product.cover.id, url: product.cover.url, alt: product.cover.alt ?? null },
          ...gallery,
        ]
      : gallery;

  const form = isNew
    ? undefined
    : {
        id: product!.id,
        name: product!.name,
        status: product!.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVE',
        brandId: product!.brandId,
        description: product!.description ?? undefined,
        seoTitle: product!.seoTitle ?? null,
        seoDescription: product!.seoDescription ?? null,
        coverId: product!.coverId ?? null,
        coverFallbackUrl: product!.cover?.url ?? null,
        images,
        variants: product!.variants.map((v) => ({
          id: v.id,
          label: v.label ?? undefined,
          volumeMl: v.volumeMl ?? undefined,
          position: v.position,
        })),
      };

  return <ProductForm brands={brands} serverProduct={form} />;
}
