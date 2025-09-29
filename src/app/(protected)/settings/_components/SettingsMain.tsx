'use client';

import { Button } from '@/components/ui/button';
import ThemeSettings from './ThemeSettings';
import ProfileSettings from './ProfileSettings';
import SearchEnginesSettings from './SearchEnginesSettings';
import UserAndRolesTable from './UsersTable/UsersAndRolesTable';
import { useEffect, useState } from 'react';

export default function SettingsMain() {

  const [add, setAdd] = useState(false);

  useEffect(() => {
    if (add) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [add]);

  return (
    <div className={`px-4 pt-16`}>
      <div className="mb-9 flex items-center justify-between">
        <h1 className="text-4xl">Налаштування</h1>
        <Button className="cursor-pointer">Зберегти</Button>
      </div>
      <div className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm">
        <ThemeSettings />
        <ProfileSettings />
        <SearchEnginesSettings />
        <UserAndRolesTable add={add} setAdd={setAdd} />
      </div>
    </div>
  );
}
