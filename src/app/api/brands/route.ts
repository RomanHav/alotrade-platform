import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  const { ids } = (await req.json().catch(() => ({}))) as { ids?: string[] };
  if (!ids?.length) return NextResponse.json({ ok: true });
  await prisma.brand.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ ok: true });
}
