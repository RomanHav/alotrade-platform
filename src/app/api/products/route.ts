import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { ids } = await req.json().catch(() => ({ ids: [] as string[] }));
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ ok: true });
  await prisma.product.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ ok: true });
}
