import PartnersMain from './_components/PartnersMain';
import { prisma } from '@/lib/prisma';

export default async function ParntersPage() {
  const rows = await prisma.partner.findMany({
    include: { logo: true },
    orderBy: { createdAt: 'desc' },
  });

  const initialPartners = rows.map((p) => ({
    id: p.id,
    name: p.name,
    link: p.link,
    image: (p as any).logo?.url ?? null,
  }));

  return <PartnersMain initialPartners={initialPartners} />;
}
