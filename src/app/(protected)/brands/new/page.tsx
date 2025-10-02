import { prisma } from '@/lib/prisma';
import BrandForm from '../_components/BrandForm';

export default async function NewBrandPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });

  // Можно не передавать вовсе — форма возьмёт initialState из Redux
  const serverBrand = {
    status: 'DRAFT' as const,
    description: '',
    seoTitle: null,
    seoDescription: null,
    coverId: null,
    coverUrl: null,
  };

  return <BrandForm products={products} serverBrand={serverBrand} />;
}
