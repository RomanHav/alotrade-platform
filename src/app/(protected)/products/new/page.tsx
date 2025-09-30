import { prisma } from '@/lib/prisma';
import ProductForm from '../_components/ProductForm';
import { ProductStatus } from '@prisma/client';

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } });

  // Стартовые значения формы (опционально)
  const product = {
    status: 'DRAFT' as ProductStatus, // или опусти — форма у тебя и так даёт DRAFT по умолчанию
    variants: [{ position: 0 }, { position: 1 }, { position: 2 }],
  };

  return <ProductForm brands={brands} product={product} />;
}
