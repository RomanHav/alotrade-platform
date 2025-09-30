import { prisma } from '@/lib/prisma';
import BrandForm from '../_components/BrandForm';
import { BrandStatus } from '@prisma/client';

export default async function NewBrandPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });

  return <BrandForm products={products} brand={{ status: 'DRAFT' as BrandStatus }} />;
}
