'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { makeColumns } from './makeColumns';
import { usePartnersTableState } from './usePartnersTableState';
import { useTableHotkeys } from './useTableHotkeys';
import type { Partner } from '../core/types';
import ConfirmDialog from '../common/ConfirmDialog';

const MOCK: Partner[] = [
  {
    id: 'p1',
    name: 'Cantina Mare',
    link: 'https://cantina.example.com',
    image: '/logos/cantina.png',
  },
  { id: 'p2', name: 'Ombra Bar', link: 'https://ombra.example.com', image: '/logos/ombra.png' },
  {
    id: 'p3',
    name: 'Alcotrade',
    link: 'https://alcotrade.example.com',
    image: '/logos/alcotrade.png',
  },
  { id: 'p4', name: 'Shabo', link: 'https://shabo.example.com', image: '/logos/shabo.png' },
  {
    id: 'p5',
    name: 'Kalyna Group',
    link: 'https://kalyna.example.com',
    image: '/logos/kalyna.png',
  },
  { id: 'p6', name: 'Wine & Co', link: 'https://wineco.example.com', image: '/logos/wineco.png' },
  {
    id: 'p7',
    name: 'Grape Hub',
    link: 'https://grapehub.example.com',
    image: '/logos/grapehub.png',
  },
];

export default function PartnersTable({
  partners = MOCK,
  onSaveRow,
  onUploadImage,
  onDeleteRows,
  search = '',
  addTrigger,
}: {
  partners?: Partner[];
  onSaveRow?: (p: Partner) => void | Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteRows?: (ids: string[]) => void | Promise<void>;
  search?: string;
  addTrigger?: number;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const {
    data,
    setData,
    editingId,
    drafts,
    setDrafts,
    onStartEdit,
    onCancelEdit,
    onDraftChange,
    onSaveEdit,
  } = usePartnersTableState(partners, onSaveRow);

  const newRowIdsRef = React.useRef<Set<string>>(new Set());
  const lastTriggerRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!addTrigger || lastTriggerRef.current === addTrigger) return;
    lastTriggerRef.current = addTrigger;

    const id = `tmp_${Date.now()}`;
    const fresh: Partner = { id, name: '', link: null, image: null };

    setData((prev) => [fresh, ...prev]);
    newRowIdsRef.current.add(id);
    onStartEdit(fresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTrigger]);

  const cancelAndMaybeRemove = React.useCallback(
    (id: string) => {
      if (newRowIdsRef.current.has(id)) {
        setData((prev) => prev.filter((p) => p.id !== id));
        newRowIdsRef.current.delete(id);
      }
      onCancelEdit(id);
    },
    [onCancelEdit, setData],
  );

  const normalizedQuery = React.useMemo(
    () =>
      search
        .toLocaleLowerCase('uk')
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .trim(),
    [search],
  );

  const viewData = React.useMemo(() => {
    if (!normalizedQuery) return data;
    return data.filter((p) => {
      const name = (p.name ?? '')
        .toLocaleLowerCase('uk')
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '');
      return name.includes(normalizedQuery);
    });
  }, [data, normalizedQuery]);

  const columns = React.useMemo(
    () =>
      makeColumns({
        editingId,
        drafts,
        onDraftChange,
        onStartEdit,
        onCancelEdit: cancelAndMaybeRemove,
        onSaveEdit,
        onUploadImage,
      }),
    [
      editingId,
      drafts,
      onDraftChange,
      onStartEdit,
      cancelAndMaybeRemove,
      onSaveEdit,
      onUploadImage,
    ],
  );

  useTableHotkeys(editingId, onSaveEdit, cancelAndMaybeRemove);

  const table = useReactTable({
    data: viewData,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  const [deleting, setDeleting] = React.useState(false);

  const handleDeleteSelected = React.useCallback(async () => {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    if (ids.length === 0) return;

    setDeleting(true);
    try {
      if (editingId && ids.includes(editingId)) {
        cancelAndMaybeRemove(editingId);
      }

      setData((prev) => prev.filter((p) => !ids.includes(p.id)));

      table.resetRowSelection();

      setDrafts((d) => {
        const copy = { ...d };
        ids.forEach((id) => delete copy[id]);
        return copy;
      });

      await onDeleteRows?.(ids);
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setDeleting(false);
    }
  }, [table, editingId, cancelAndMaybeRemove, setData, setDrafts, onDeleteRows]);

  const selectedCount = table.getSelectedRowModel().rows.length;
  

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-center" style={{ width: h.getSize() }}>
                    {h.isPlaceholder
                      ? null
                      : typeof h.column.columnDef.header === 'function'
                        ? h.column.columnDef.header(h.getContext())
                        : h.column.columnDef.header}
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
                    <TableCell
                      key={cell.id}
                      className="text-center align-middle"
                      style={{ width: cell.column.getSize() }}
                    >
                      <div className="mx-auto max-w-full">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.column.columnDef.cell}
                      </div>
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
        <div className="flex flex-1">
          {selectedCount > 0 && (
            <ConfirmDialog
              title="Видалити обрані?"
              description={`Буде видалено ${selectedCount} ${selectedCount === 1 ? 'партнера' : 'партнерів'}. Цю дію не можна скасувати.`}
              confirmText="Видалити"
              onConfirm={handleDeleteSelected}
              disabled={deleting}
              trigger={
                <Button variant="destructive" disabled={deleting}>
                  {deleting ? 'Видаляю…' : `Видалити обрані (${selectedCount})`}
                </Button>
              }
            />
          )}
        </div>

        <span className="text-muted-foreground flex-1 text-center text-sm">
          Сторінка {table.getState().pagination.pageIndex + 1} з {table.getPageCount() || 1}
        </span>

        <div className="flex flex-1 items-center justify-end gap-3">
          <Button className='cursor-pointer' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Попередня
          </Button>
          <Button className='cursor-pointer' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Наступна
          </Button>
        </div>
      </div>
    </div>
  );
}
