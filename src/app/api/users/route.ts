import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role, Prisma } from '@prisma/client';

const EXPLICIT_DEFAULT = process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE;

function deriveDefaultFromCloudinary(): string | undefined {
  const url = process.env.CLOUDINARY_URL;
  const match = url?.match(/@([^/]+)/);
  const cloudName = match?.[1];
  return cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/Alcotrade/default-user.jpg`
    : undefined;
}

const DEFAULT_USER_IMAGE = EXPLICIT_DEFAULT ?? deriveDefaultFromCloudinary();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const toUkRole = (r: Role) => (r === 'ADMIN' ? 'Адмін' : 'Менеджер');

    const formatted = users.map((u) => ({
      id: u.id,
      username: u.name ?? '',
      role: toUkRole(u.role),
      image: u.image ?? DEFAULT_USER_IMAGE ?? '/avatar.jpg',
      password: '',
    }));

    return NextResponse.json({ ok: true, users: formatted }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: 'Не вдалося отримати користувачів' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role = 'MANAGER',
      image,
    } = body as {
      name?: string;
      email?: string;
      password: string;
      role?: 'ADMIN' | 'MANAGER';
      image?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email і пароль обовʼязкові' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as Role,
        image: image ?? DEFAULT_USER_IMAGE,
      },
      select: { id: true, email: true, role: true, image: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const meta = err.meta as { target?: string[] } | undefined;
      if (err.code === 'P2002' && Array.isArray(meta?.target) && meta.target.includes('email')) {
        return NextResponse.json({ ok: false, error: 'Email вже зайнятий' }, { status: 409 });
      }
      return NextResponse.json({ ok: false, error: `Prisma error ${err.code}` }, { status: 400 });
    }

    if (err instanceof Error) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'Невідома помилка' }, { status: 500 });
  }
}
