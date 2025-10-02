// app/(protected)/products/new/page.tsx
import { prisma } from '@/lib/prisma';
import ProductForm from '../_components/ProductForm';

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } });
  return <ProductForm brands={brands} />;
}
