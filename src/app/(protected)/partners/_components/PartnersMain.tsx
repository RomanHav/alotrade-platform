'use client';

import { Button } from '@/components/ui/button';
import PartnersTable from './table/PartnersTable';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import type { Partner } from './core/types';

export default function PartnersMain({
  initialPartners = [] as Partner[],
}: {
  initialPartners?: Partner[];
}) {
  const [search, setSearch] = React.useState('');
  const [addTrigger, setAddTrigger] = React.useState<number | undefined>(undefined);

  const onSaveRow = React.useCallback(async (row: Partner): Promise<Partner> => {
    const payload = { name: row.name, link: row.link ?? null, image: row.image ?? null };

    if (row.id.startsWith('tmp_')) {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Create failed');
      return await res.json();
    }

    const res = await fetch(`/api/partners/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Update failed');
    return await res.json();
  }, []);

  const onUploadImage = React.useCallback(async (file: File, ctx: { publicId: string }) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('publicId', ctx.publicId);

    const res = await fetch('/api/upload/partner-logo', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return { url: json.url as string };
  }, []);

  const onDeleteRows = React.useCallback(async (ids: string[]) => {
    const res = await fetch('/api/partners/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Bulk delete failed');
  }, []);

  return (
    <div className="px-8 pt-16">
      <h1 className="mb-9 text-4xl">Партнери</h1>
      <div className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Всі партнери</h2>
          <div className="flex items-center gap-7">
            <Input
              type="text"
              placeholder="Пошук..."
              className="w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="cursor-pointer" onClick={() => setAddTrigger(Date.now())}>
              Додати новий
            </Button>
          </div>
        </div>

        <PartnersTable
          partners={initialPartners}
          search={search}
          addTrigger={addTrigger}
          onSaveRow={onSaveRow}
          onUploadImage={onUploadImage}
          onDeleteRows={onDeleteRows}
        />
      </div>
    </div>
  );
}
