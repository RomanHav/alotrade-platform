// PartnersMain.tsx
'use client';
import { Button } from '@/components/ui/button';
import PartnersTable from './table/PartnersTable';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function PartnersMain() {
  const [search, setSearch] = useState('');
  const [addTrigger, setAddTrigger] = useState<number | undefined>(undefined);

  return (
    <div className="px-8 pt-16">
      <h1 className="mb-9 text-4xl">Партнери</h1>
      <div className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Всі партнери</h2>
          <div className="flex items-center gap-7">
            <Input
              type="text"
              placeholder="Назва партнеру..."
              className="w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="cursor-pointer" onClick={() => setAddTrigger(Date.now())}>
              Додати новий
            </Button>
          </div>
        </div>

        
        <PartnersTable search={search} addTrigger={addTrigger} />
      </div>
    </div>
  );
}
