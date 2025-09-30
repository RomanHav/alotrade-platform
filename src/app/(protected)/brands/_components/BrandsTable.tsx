'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Trash2, Pencil, Filter, SlidersHorizontal } from 'lucide-react';

type Item = {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  cover?: { url: string | null; alt?: string | null } | null;
};

export default function BrandsTable(props: {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const { items, total, page, pageSize } = props;
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();
  const sp = useSearchParams();

  const columns: ColumnDef<Item>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Вибрати всі"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
      ),
      size: 32,
    },
    {
      id: 'thumb',
      header: () => null,
      cell: ({ row }) => (
        <div className="size-8 overflow-hidden rounded-md border">
          {row.original.cover?.url ? (
            <Image
              src={row.original.cover.url}
              alt={row.original.cover.alt || row.original.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="bg-muted h-full w-full" />
          )}
        </div>
      ),
      size: 40,
    },
    {
      accessorKey: 'name',
      header: 'Назва бренду',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      size: 140,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'edit',
      header: 'Редагувати',
      size: 80,
      cell: ({ row }) => (
        <a href={`/brands/${row.original.id}/edit`} className="inline-flex">
          <Pencil className="size-4" />
        </a>
      ),
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = React.useMemo(
    () => table.getSelectedRowModel().rows.map((r) => r.original.id),
    [table],
  );

  const applyParam = (key: string, value?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const onBulkDelete = async () => {
    if (!selectedIds.length) return;
    await fetch('/api/brands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    router.refresh();
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-card rounded-2xl border p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Input
          placeholder="Пошук"
          defaultValue={sp.get('query') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              applyParam('query', (e.target as HTMLInputElement).value || undefined);
          }}
          className="w-56"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 size-4" /> Фільтри
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фільтрувати за:</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-2 text-sm font-medium">Назва бренду</div>
                <Input
                  defaultValue={sp.get('query') ?? ''}
                  onBlur={(e) => applyParam('query', e.target.value || undefined)}
                  placeholder="містить…"
                />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Статус</div>
                <Select
                  defaultValue={sp.get('status') ?? undefined}
                  onValueChange={(v) => applyParam('status', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Активний</SelectItem>
                    <SelectItem value="DRAFT">Чорновик</SelectItem>
                    <SelectItem value="ARCHIVE">Архів</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.refresh()} className="w-full">
                Застосувати
              </Button>
              <Button variant="ghost" onClick={() => router.push('?')}>
                Очистити
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 size-4" /> Сортувати
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Сортувати за:</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <RadioGroup
                defaultValue={sp.get('sort') ?? 'name_asc'}
                onValueChange={(v) => applyParam('sort', v)}
              >
                {[
                  ['name_asc', 'A-Я'],
                  ['name_desc', 'Я-А'],
                  ['status', 'Статус'],
                  ['updated', 'Останні оновлені'],
                ].map(([v, label]) => (
                  <div key={v} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value={v} id={v} />
                    <label htmlFor={v}>{label}</label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={() => router.refresh()} className="mt-4 w-full">
                Застосувати
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={onBulkDelete}>
              <Trash2 className="mr-2 size-4" /> Видалити
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} style={{ width: h.getSize() ?? undefined }}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((r) => (
              <TableRow key={r.id} data-state={r.getIsSelected() && 'selected'}>
                {r.getVisibleCells().map((c) => (
                  <TableCell key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm">
        <Button
          variant="ghost"
          onClick={() => applyParam('page', String(Math.max(1, page - 1)))}
          disabled={page <= 1}
        >
          «
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          onClick={() => applyParam('page', String(Math.min(totalPages, page + 1)))}
          disabled={page >= totalPages}
        >
          »
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Item['status'] }) {
  const map: Record<Item['status'], { label: string; className: string }> = {
    ACTIVE: {
      label: 'Активний',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    DRAFT: {
      label: 'Чорновик',
      className: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300',
    },
    ARCHIVE: {
      label: 'Архів',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    },
  };
  const v = map[status];
  return (
    <Badge className={cn('px-2', v.className)} variant="secondary">
      {v.label}
    </Badge>
  );
}
