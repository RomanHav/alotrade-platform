'use client';

import { Button } from '@/components/ui/button';
import ThemeSettings from './ThemeSettings';
import ProfileSettings from './ProfileSettings';
import SearchEnginesSettings from './SearchEnginesSettings';
import UserAndRolesTable from './UsersTable/UsersAndRolesTable';
import { AddUserModalProvider } from './UsersTable/context';
import { useState } from 'react';

export default function SettingsMain() {

  const [active, setActive] = useState(false);

  const handleActive = () => { 
    setActive(true);
  }


  return (
    <AddUserModalProvider>
      <div className="px-4 pt-16">
        <div className="mb-9 flex items-center justify-between">
          <h1 className="text-4xl">Налаштування</h1>
          <Button disabled={!active} onClick={handleActive} className={`${active ? 'opacity-100' : 'opacity-10'} cursor-pointer`}>Зберегти</Button>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl border shadow-sm border-neutral-200 dark:border-neutral-800 bg-neutral-50 p-5 dark:bg-neutral-900">
          <ThemeSettings />
          <ProfileSettings />
          <SearchEnginesSettings />
          <UserAndRolesTable />
        </div>
      </div>
    </AddUserModalProvider>
  );
}
