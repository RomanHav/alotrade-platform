import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.partner.findMany({
    include: { logo: true },
    orderBy: { createdAt: 'desc' },
  });

  const data = rows.map((p) => ({
    id: p.id,
    name: p.name,
    link: p.link,
    image: (p as any).logo?.url ?? null,
  }));

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, link, image } = body as {
      name: string;
      link?: string | null;
      image?: string | null;
    };

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    let logoId: string | null = null;
    if (image) {
      const asset = await prisma.mediaAsset.create({
        data: { url: image },
      });
      logoId = asset.id;
    }

    const created = await prisma.partner.create({
      data: {
        name,
        link: link ?? null,
        logoId,
      },
      include: { logo: true },
    });

    const dto = {
      id: created.id,
      name: created.name,
      link: created.link,
      image: (created as any).logo?.url ?? null,
    };

    return NextResponse.json(dto, { status: 201 });
  } catch (e: any) {
    console.error('Create partner error:', e);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
