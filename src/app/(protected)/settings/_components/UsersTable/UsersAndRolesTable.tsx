import { Button } from '@/components/ui/button';
import { DataTable } from "./data-table";

export default function UserAndRolesTable() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Користувачі та ролі</h2>
        <Button className="cursor-pointer">Додати</Button>
      </div>
      <DataTable/>
    </div>
  );
}
