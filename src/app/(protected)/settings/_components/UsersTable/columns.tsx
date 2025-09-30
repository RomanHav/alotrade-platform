'use client';

import * as React from 'react';
import { ColumnDef, Table, Row } from '@tanstack/react-table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAddUserModal } from './context';

export type User = {
  id: string;
  username: string;
  email: string; 
  role: string;  
  image: string;
  password: string;
};

const ukCollator = new Intl.Collator('uk', { sensitivity: 'base', ignorePunctuation: true });

function SelectAllCheckbox({ table }: { table: Table<User> }) {
  const some = table.getIsSomePageRowsSelected();
  const all = table.getIsAllPageRowsSelected();
  return (
    <div className="flex justify-center">
      <Checkbox
        aria-label="Вибрати всі"
        checked={all ? true : some ? 'indeterminate' : false}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    </div>
  );
}

function RowCheckbox({ row }: { row: Row<User> }) {
  const some = row.getIsSomeSelected();
  const selected = row.getIsSelected();
  return (
    <div className="flex justify-center">
      <Checkbox
        aria-label="Вибрати рядок"
        checked={selected ? true : some ? 'indeterminate' : false}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    </div>
  );
}

function PasswordMaskedCell() {
  return (
    <div className="flex items-center justify-center">
      <span className="w-36 select-none text-center font-mono">••••••••</span>
    </div>
  );
}

function ActionCell({ user }: { user: User }) {
  const { openWith } = useAddUserModal();
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Відкрити меню</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Дії</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
            Скопіювати ID користувача
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openWith(user)}>
            Змінити пароль
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => <RowCheckbox row={row} />,
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    size: 48,
  },
  {
    accessorKey: 'image',
    header: 'Зображення',
    enableSorting: false,
    enableColumnFilter: false,
    size: 72,
    cell: ({ row }) => {
      const src = (row.getValue('image') as string) || '';
      const alt = (row.getValue('username') as string) || 'avatar';
      return (
        <div className="flex items-center justify-center">
          {src ? (
            <Image
              src={src}
              alt={alt}
              width={40}
              height={40}
              className="h-10 w-10 rounded-sm border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border text-xs">
              —
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="mx-auto flex items-center justify-center gap-1 px-0 font-medium"
        >
          Користувач
          {isSorted === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : isSorted === 'desc' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-60" />
          )}
        </Button>
      );
    },
    sortingFn: (rowA, rowB, id) => {
      const a = String(rowA.getValue(id) ?? '').replace(/\./g, '').trim();
      const b = String(rowB.getValue(id) ?? '').replace(/\./g, '').trim();
      return ukCollator.compare(a, b);
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Роль',
    sortingFn: (rowA, rowB, id) =>
      ukCollator.compare(String(rowA.getValue(id) ?? ''), String(rowB.getValue(id) ?? '')),
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'password',
    header: 'Пароль',
    enableSorting: false,
    cell: () => <PasswordMaskedCell />,
  },
  {
    id: 'actions',
    header: 'Дії',
    enableHiding: false,
    enableSorting: false,
    size: 64,
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];
