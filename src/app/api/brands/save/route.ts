import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BrandStatus } from '@prisma/client';
import { slug } from '@/lib/slug';

type SaveBrand = {
  id?: string;
  name: string;
  status: BrandStatus; // 'ACTIVE' | 'DRAFT' | 'ARCHIVE'
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverId?: string | null;
};

export async function POST(req: Request) {
  const data: SaveBrand = await req.json();

  if (data.id) {
    const { id, ...rest } = data;
    await prisma.brand.update({ where: { id }, data: rest });
  } else {
    await prisma.brand.create({
      data: { ...data, slug: await slug(data.name) },
    });
  }
  return NextResponse.json({ ok: true });
}
