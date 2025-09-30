// app/(protected)/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/ProductForm';

// Типы формы (при необходимости импортируй из компонента)
type VariantForm = {
  id?: string;
  label?: string;
  volumeMl?: number;
  position: number;
};
type ProductFormData = {
  id?: string;
  name?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  brandId?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: VariantForm[];
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { position: 'asc' } },
      cover: true,
      brand: true,
    },
  });

  if (!product) notFound();

  // Маппим Prisma → ProductFormData
  const formProduct: ProductFormData = {
    id: product.id,
    name: product.name,
    status: product.status as ProductFormData['status'], // у тебя enum с 'ARCHIVE'
    brandId: product.brandId,
    description: product.description ?? undefined,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription ?? undefined,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label ?? undefined,
      volumeMl: v.volumeMl ?? undefined,
      position: v.position,
    })),
  };

  return (
    <ProductForm
      brands={await prisma.brand.findMany({ select: { id: true, name: true } })}
      product={formProduct}
    />
  );
}
