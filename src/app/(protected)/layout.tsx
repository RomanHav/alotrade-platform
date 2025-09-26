// src/app/(protected)/layout.tsx
import type { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { prisma } from '@/lib/prisma';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true },
  });
  if (!user) redirect('/sign-in');

  return (
    <div className="flex min-h-dvh">
      <Sidebar user={user} fixed />

      <div className="hidden w-72 shrink-0 md:block" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
