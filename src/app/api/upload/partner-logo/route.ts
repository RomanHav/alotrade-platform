import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ secure: true });

function splitPublicId(input: string | null): { folder: string; name: string } {
  const DEFAULT_FOLDER = 'Alcotrade/partners';
  if (!input) return { folder: DEFAULT_FOLDER, name: `unnamed_${Date.now()}` };

  const cleaned = input.replace(/^\/+|\/+$/g, '').trim();
  if (!cleaned) return { folder: DEFAULT_FOLDER, name: `unnamed_${Date.now()}` };

  const lastSlash = cleaned.lastIndexOf('/');
  if (lastSlash === -1) {
    return { folder: DEFAULT_FOLDER, name: cleaned };
  }
  const folder = cleaned.slice(0, lastSlash) || DEFAULT_FOLDER;
  const name = cleaned.slice(lastSlash + 1) || `unnamed_${Date.now()}`;
  return { folder, name };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const publicIdRaw = (form.get('publicId') as string | null) ?? null;

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const { folder, name } = splitPublicId(publicIdRaw);
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: name,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
        },
        (err, result) => (err ? reject(err) : resolve(result)),
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploaded.secure_url as string,
      publicId: uploaded.public_id as string,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
      version: uploaded.version,
    });
  } catch (e) {
    console.error('Cloudinary upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
