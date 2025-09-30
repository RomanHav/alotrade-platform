// app/(protected)/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/ProductForm';
import { ProductStatus } from '@prisma/client';

// Типы формы (совпадают с твоими в компоненте)
type VariantForm = {
  id?: string;
  label?: string;
  volumeMl?: number;
  sku?: string;
  priceCents?: number;
  position: number;
};

type ProductFormData = {
  id?: string;
  name?: string;
  status: ProductStatus;
  brandId?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: VariantForm[];
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { position: 'asc' } },
      cover: true,
      brand: true,
    },
  });

  if (!product) notFound();

  // Prisma → ProductFormData (null → undefined; только нужные поля)
  const formProduct: ProductFormData = {
    id: product.id,
    name: product.name,
    status: product.status,
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
