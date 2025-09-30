import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function PATCH(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const match = pathname.match(/\/api\/users\/([^/]+)\/password$/);
    const userId = match?.[1];

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Не передано id користувача' }, { status: 400 });
    }

    const body = (await req.json()) as { password?: string };
    const password = body?.password?.trim();

    if (!password) {
      return NextResponse.json({ ok: false, error: 'Пароль обовʼязковий' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Пароль має містити щонайменше 8 символів' },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
      select: { id: true, email: true, updatedAt: true },
    });

    return NextResponse.json({ ok: true, user: updated }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Користувача не знайдено' }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
