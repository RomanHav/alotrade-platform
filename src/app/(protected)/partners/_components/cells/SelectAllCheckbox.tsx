'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Table } from '@tanstack/react-table';
import type { Partner } from '../core/types';

export function SelectAllCheckbox({ table }: { table: Table<Partner> }) {
  const some = table.getIsSomePageRowsSelected();
  const all = table.getIsAllPageRowsSelected();

  return (
    <div className="flex justify-center">
      <Checkbox
        className="cursor-pointer"
        aria-label="Вибрати всі"
        checked={all ? true : some ? 'indeterminate' : false}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    </div>
  );
}
