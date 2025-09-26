'use client';
import { ColumnDef, Table, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useEffect, useRef } from 'react';

export type User = {
  id: string;
  username: string;
  role: string;
  amount: number;
  image: string;
  password: string;
};

function SelectAllCheckbox({ table }: { table: Table<User> }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate =
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
    }
  }, [table.getIsAllPageRowsSelected(), table.getIsSomePageRowsSelected()]);

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={table.getIsAllPageRowsSelected()}
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      className="checkbox checkbox-sm"
      aria-label="Select all"
    />
  );
}

function RowCheckbox({ row }: { row: Row<User> }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = row.getIsSomeSelected() && !row.getIsSelected();
    }
  }, [row.getIsSelected(), row.getIsSomeSelected()]);

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(e.target.checked)}
      className="checkbox checkbox-sm"
      aria-label="Select row"
    />
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }: { table: Table<User> }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }: { row: Row<User> }) => <RowCheckbox row={row} />,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Username <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Password</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<User> }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Reset password</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
