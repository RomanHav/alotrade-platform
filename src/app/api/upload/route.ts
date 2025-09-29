import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ secure: true });

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: 'Файл не передано' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'Alcotrade',
          resource_type: 'image',
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            secure_url: result.secure_url!,
            public_id: result.public_id!,
            width: result.width!,
            height: result.height!,
          });
        },
      );
      stream.end(buffer);
    });

    return NextResponse.json({ ok: true, ...uploaded }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Помилка завантаження';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get('public_id');
    if (!public_id) {
      return NextResponse.json({ ok: false, error: 'public_id обовʼязковий' }, { status: 400 });
    }
    const res = await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
    return NextResponse.json({ ok: true, result: res }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Помилка видалення';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
