'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { columns, User } from './columns';

/* демо-дані (українські імена/ролі) */
const data: User[] = [
  {
    id: 'm5gr84i9',
    username: 'Анна Т.',
    role: 'Адмін',
    image: '/avatar.jpg',
    password: 'password123',
  },
  {
    id: '3u1reuv4',
    username: 'Олександр К.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'password1236',
  },
  {
    id: 'derv1ws0',
    username: 'Антоніна Л.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'password1234',
  },
  {
    id: '5kma53ae',
    username: 'Ірина П.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'prd12345',
  },
  {
    id: 'bhqecj4p',
    username: 'Павло С.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'pas345678',
  },
  // нові
  {
    id: 'u1x9a2b3',
    username: 'Богдан Р.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'qwerty123',
  },
  {
    id: 'k7m4n5p6',
    username: 'Світлана М.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'hello2024',
  },
  {
    id: 'z9q8w7e6',
    username: 'Марія Д.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'letmein42',
  },
  {
    id: 't2y3u4i5',
    username: 'Дмитро Б.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'secure777',
  },
  {
    id: 'r6f5g4h3',
    username: 'Катерина Ж.',
    role: 'Менеджер',
    image: '/example.jpg',
    password: 'testpass9',
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="w-full">
      {/* Топ-бар: фільтр ліворуч, "Видалити обране" праворуч (показуємо лише якщо є вибрані) */}
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Фільтр за користувачем…"
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('username')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        {selectedCount > 0 && (
          <Button
            variant="destructive"
            className="ml-auto"
            onClick={() => {
              /* поки без логіки видалення */
            }}
          >
            Видалити обране
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          {/* заголовки по центру */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* рендер пагінованих рядків */}
          <TableBody>
            {table.getPaginationRowModel().rows.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Немає результатів.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Низ: текст сторінки по центру, кнопки праворуч */}
      <div className="flex items-center py-4">
        <div className="flex-1" />
        <span className="text-muted-foreground flex-1 text-center text-sm">
          Сторінка {table.getState().pagination.pageIndex + 1} з {table.getPageCount() || 1}
        </span>
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Попередня
          </Button>
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Наступна
          </Button>
        </div>
      </div>
    </div>
  );
}
