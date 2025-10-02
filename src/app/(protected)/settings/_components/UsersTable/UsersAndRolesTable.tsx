'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import AddUserForm from '../AddUserForm';
import React from 'react';
import { useAddUserModal } from './context';

const UserAndRolesTable: React.FC = () => {
  const { add, open } = useAddUserModal();

  return (
    <>
      <div className="relative h-full w-full">
        <div className="flex items-center justify-between mt-5">
          <h2 className="text-2xl">Користувачі та ролі</h2>
          <Button onClick={open} className="cursor-pointer">
            Додати
          </Button>
        </div>
        <DataTable />
      </div>
      {add && <AddUserForm />}
    </>
  );
};

export default UserAndRolesTable;
