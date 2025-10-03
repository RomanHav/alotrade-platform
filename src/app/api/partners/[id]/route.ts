import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { extractCloudinaryPublicId } from '@/lib/cloudinary-publicid';

cloudinary.config({ secure: true });

type Body = { name?: string; link?: string | null; image?: string | null };

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = (await req.json()) as Body;

    const updates: any = {};
    if (typeof body.name === 'string') updates.name = body.name;
    if (typeof body.link !== 'undefined') updates.link = body.link;

    if (typeof body.image !== 'undefined') {
      if (body.image) {
        const asset = await prisma.mediaAsset.create({
          data: { url: body.image },
        });
        updates.logoId = asset.id;
      } else {
        updates.logoId = null;
      }
    }

    const updated = await prisma.partner.update({
      where: { id },
      data: updates,
      include: { logo: true },
    });

    const dto = {
      id: updated.id,
      name: updated.name,
      link: updated.link,
      image: (updated as any).logo?.url ?? null,
    };

    return NextResponse.json(dto);
  } catch (e: any) {
    console.error('Update partner error:', e);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: { logo: true },
    });

    await prisma.partner.delete({ where: { id } });

    const publicId = extractCloudinaryPublicId(partner?.logo?.url ?? null);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      } catch (e) {
        console.warn('Cloudinary destroy failed:', e);
      }
    }

    if (partner?.logoId) {
      await prisma.mediaAsset.delete({ where: { id: partner.logoId } }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Delete partner error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
