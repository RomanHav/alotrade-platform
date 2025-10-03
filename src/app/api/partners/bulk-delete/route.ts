import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { extractCloudinaryPublicId } from '@/lib/cloudinary-publicid';

cloudinary.config({ secure: true });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
    if (!ids.length) return NextResponse.json({ error: 'ids is required' }, { status: 400 });

    const partners = await prisma.partner.findMany({
      where: { id: { in: ids } },
      include: { logo: true },
    });

    await prisma.partner.deleteMany({ where: { id: { in: ids } } });

    await Promise.all(
      partners.map(async (p) => {
        const publicId = extractCloudinaryPublicId(p.logo?.url ?? null);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
          } catch (e) {
            console.warn('Cloudinary destroy failed:', e);
          }
        }
        if (p.logoId) {
          await prisma.mediaAsset.delete({ where: { id: p.logoId } }).catch(() => {});
        }
      }),
    );

    return NextResponse.json({ ok: true, count: ids.length });
  } catch (e) {
    console.error('Bulk delete failed:', e);
    return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 });
  }
}
