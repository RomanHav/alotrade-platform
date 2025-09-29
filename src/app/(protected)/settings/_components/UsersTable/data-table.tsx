'use client';

import * as React from 'react';
import useSWR from 'swr';
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

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then(async (r) => {
    const data = await r.json();
    if (!r.ok || data?.ok === false) throw new Error(data?.error || 'Помилка завантаження');
    return data;
  });

export function DataTable() {
  const { data, error, isLoading } = useSWR<{ ok: boolean; users: User[] }>(
    '/api/users',
    fetcher,
    { revalidateOnFocus: false }
  );

  const rows = data?.users ?? [];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: rows,
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

  if (isLoading) return <div className="p-4">Завантаження…</div>;
  if (error) return <div className="p-4 text-red-600">Помилка: {(error as Error).message}</div>;

  return (
    <div className="w-full">
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
             
            }}
          >
            Видалити обране
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
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
