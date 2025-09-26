'use client';

import { useState } from 'react';
import { ColumnDef, Table, Row } from '@tanstack/react-table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export type User = {
  id: string;
  username: string;
  role: string;
  image: string;
  password: string;
};

/* --- український коллатор для сортування --- */
const ukCollator = new Intl.Collator('uk', { sensitivity: 'base', ignorePunctuation: true });

/* --- чекбокси вибору --- */
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

/* --- клітинка пароля (пароль по центру, «око» рівно в колонці) --- */
function PasswordCell({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  const masked = '•'.repeat(value?.length || 8);
  return (
    <div className="flex items-center justify-center gap-2">
      {/* фіксована ширина для стабільного вирівнювання іконки */}
      <span className="font-mono select-all text-center w-36">{show ? value : masked}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={show ? 'Сховати пароль' : 'Показати пароль'}
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

/* --- колонки таблиці --- */
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
              className="h-10 w-10 rounded-sm object-cover border"
            />
          ) : (
            <div className="h-10 w-10 rounded-sm border flex items-center justify-center text-xs">—</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
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
    cell: ({ row }) => <PasswordCell value={row.getValue('password') as string} />,
  },
  {
    id: 'actions',
    header: 'Дії',
    enableHiding: false,
    enableSorting: false,
    size: 64,
    cell: ({ row }) => {
      const user = row.original;
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
              {/* "Переглянути профіль" прибрано */}
              <DropdownMenuItem>Скинути пароль</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
