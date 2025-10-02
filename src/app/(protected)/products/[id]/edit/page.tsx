// app/(protected)/products/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/ProductForm';

type VariantForm = { id?: string; label?: string; volumeMl?: number; position: number };
type ProductFormData = {
  id?: string;
  name?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  brandId?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: VariantForm[];
  coverId?: string | null;
  coverFallbackUrl?: string | null;
  images?: { id: string; url: string; alt?: string | null }[];
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { position: 'asc' } },
      cover: true, // ← нужно, чтобы взять url cover
      images: {
        orderBy: { position: 'asc' },
        include: { media: { select: { id: true, url: true, alt: true } } },
      },
      brand: true,
    },
  });

  if (!product) notFound();

  // 1) обычная галерея из ProductImage
  const gallery = product.images
    .filter((pi) => !!pi.media?.url)
    .map((pi) => ({
      id: pi.media.id, // MediaAsset.id
      url: pi.media.url,
      alt: pi.media.alt ?? null,
    }));

  // 2) если cover существует и его нет в галерее — добавить его первым
  const imagesWithCover =
    product.cover && gallery.every((g) => g.id !== product.cover!.id)
      ? [
          { id: product.cover.id, url: product.cover.url, alt: product.cover.alt ?? null },
          ...gallery,
        ]
      : gallery;

  const formProduct: ProductFormData = {
    id: product.id,
    name: product.name,
    status: product.status as ProductFormData['status'],
    brandId: product.brandId,
    description: product.description ?? undefined,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription ?? undefined,

    coverId: product.coverId ?? null,
    coverFallbackUrl: product.cover?.url ?? null, // <- ДОБАВИЛИ

    images: imagesWithCover, // пусть остаётся как есть

    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label ?? undefined,
      volumeMl: v.volumeMl ?? undefined,
      position: v.position,
    })),
  };

  const brands = await prisma.brand.findMany({ select: { id: true, name: true } });

  return <ProductForm brands={brands} product={formProduct} />;
}
