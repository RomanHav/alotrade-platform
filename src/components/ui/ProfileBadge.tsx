'use client';

import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Role } from '@prisma/client';
import { logout } from '@/app/(protected)/actions';

type ProfileBadgeProps = {
  user: {
    name: string | null;
    role: Role;
  };
};

const roleLabel: Record<Role, string> = {
  ADMIN: 'Адмін',
  MANAGER: 'Менеджер',
};

export default function ProfileBadge({ user }: ProfileBadgeProps) {
  return (
    <div className="px-2">
      <div className="flex justify-between rounded-lg shadow-sm bg-neutral-50 dark:bg-neutral-900 p-2.5">
        <div className="flex items-center gap-4">
          <Image src={'/avatar.jpg'} alt="Avatar" width={50} height={50} className="rounded-sm" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-light">{user.name ?? 'Guest'}</span>
            <span className="text-base font-thin">{roleLabel[user.role] ?? 'User'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/settings" className={'cursor-pointer'} aria-label="Settings">
            <Settings className="h-5 w-5 stroke-neutral-900 dark:stroke-neutral-50" />
          </Link>
          <form className={'h-5'} action={logout}>
            <button
              type="submit"
              aria-label="Log out"
              title="Вийти"
              className="cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-5 w-5 stroke-neutral-900 dark:stroke-neutral-50" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
