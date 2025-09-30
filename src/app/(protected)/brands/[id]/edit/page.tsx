import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BrandForm from '../../_components/BrandForm';

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
    include: {
      cover: true,
      products: { select: { id: true, name: true, status: true }, orderBy: { name: 'asc' } },
    },
  });
  if (!brand) notFound();

  return (
    <BrandForm
      brand={{
        id: brand.id,
        name: brand.name,
        status: brand.status,
        description: brand.description ?? undefined,
        seoTitle: brand.seoTitle ?? undefined,
        seoDescription: brand.seoDescription ?? undefined,
        coverId: brand.coverId ?? undefined,
      }}
      products={brand.products}
    />
  );
}
