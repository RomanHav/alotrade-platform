import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import AddUserForm from '../AddUserForm';
import React from 'react';

type UserAndRolesTableProps = {
  add: boolean;
  setAdd: (value: boolean) => void;
};

const UserAndRolesTable: React.FC<UserAndRolesTableProps> = ({ add, setAdd }) => {
  return (
    <>
      <div className="relative h-full w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Користувачі та ролі</h2>
          <Button onClick={() => setAdd(true)} className="cursor-pointer">
            Додати
          </Button>
        </div>
        <DataTable />
      </div>
      {add && <AddUserForm setAdd={setAdd} />}
    </>
  );
};

export default UserAndRolesTable;
