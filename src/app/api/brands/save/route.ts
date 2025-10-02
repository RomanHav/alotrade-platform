import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { BrandStatus } from '@prisma/client';
import { slug as makeSlug } from '@/lib/slug';

type SaveBrandInput = {
  id?: string;
  name: string;
  status: BrandStatus; // 'ACTIVE' | 'DRAFT' | 'ARCHIVE'
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverId?: string | null; // MediaAsset.id
};

export async function POST(req: Request) {
  const data: SaveBrandInput = await req.json();

  if (data.id) {
    const { id, ...rest } = data;

    await prisma.brand.update({
      where: { id },
      data: {
        name: rest.name,
        status: rest.status,
        description: rest.description ?? null,
        seoTitle: rest.seoTitle ?? null,
        seoDescription: rest.seoDescription ?? null,
        coverId: rest.coverId ?? null,
      },
    });
  } else {
    const created = await prisma.brand.create({
      data: {
        name: data.name,
        slug: await makeSlug(data.name),
        status: data.status,
        description: data.description ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        coverId: data.coverId ?? null,
      },
    });

    // optionally: можно вернуть created
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  }

  return NextResponse.json({ ok: true });
}
