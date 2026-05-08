import { useState, useCallback } from 'react';
import { Users, UserCheck, UserSearch, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, StatCard } from '@/components/common';
import { Switch } from '@/components/ui/switch';
import { AddSubUserDialog } from '../components/AddSubUserDialog';
import { MOCK_STAFF } from '../staff.mock';
import type { Column } from '@/components/common/types/DataTable.types';
import { cn } from '@/lib/utils';
import { ConformationModal } from '@/components/common/ConformationModal';

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  createdAt: string;
  status: boolean;
  initials: string;
  color: string;
}

export default function StaffManagementPage() {
  const [search, setSearch] = useState('');
  const [staffData, setStaffData] = useState<StaffUser[]>(MOCK_STAFF);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleAddClick = useCallback(() => {
    setEditingUser(null);
    setIsAddDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((user: StaffUser) => {
    setEditingUser(user);
    setIsAddDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      setStaffData(prev => prev.filter(user => user.id !== userToDelete));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete]);

  const toggleStatus = (id: number) => {
    setStaffData(prev => prev.map(user =>
      user.id === id ? { ...user, status: !user.status } : user
    ));
  };

  const columns: Column<StaffUser>[] = [
    {
      key: 'name',
      header: 'DETAILS',
      cell: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-white dark:border-zinc-800 pt-[3px]", row.color)}>
            {row.initials}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-white text-[13px]">{row.name}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'ROLE',
      cell: (val: string) => <span className="text-slate-500 dark:text-zinc-400 font-medium">{val}</span>
    },
    {
      key: 'lastLogin',
      header: 'LAST LOGIN',
      cell: (val: string) => <span className="text-slate-500 dark:text-zinc-400 font-medium">{val}</span>
    },
    {
      key: 'createdAt',
      header: 'CREATED AT',
      cell: (val: string) => <span className="text-slate-500 dark:text-zinc-400 font-medium">{val}</span>
    },
    {
      key: 'status',
      header: 'STATUS',
      cell: (val: boolean, row) => (
        <Switch
          checked={val}
          onCheckedChange={() => toggleStatus(row.id)}
          className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-zinc-100"
        />
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(row)}
            className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.id)}
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value="3"
          icon={Users}
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          className='py-1'
        />
        <StatCard
          label="Active Users"
          value="3"
          icon={UserCheck}
          color="bg-green-50 dark:bg-green-900/20 text-green-500"
          className='py-1'
        />
        <StatCard
          label="Pending Users"
          value="0"
          icon={UserSearch}
          color="bg-orange-50 dark:bg-orange-900/20 text-orange-500"
          className='py-1'
        />
      </div>

      {/* Table Section */}
      <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <DataTable
          columns={columns}
          data={staffData}
          totalItems={staffData.length}
          pageSize={25}
          searchable={true}
          headerTitle="SubUser"
          emptyMessage="No users found"
          className="pb-3"
          searchPlaceholder="Search users..."
          onSearchChange={setSearch}
          searchValue={search}
          customHeader={
            <Button onClick={handleAddClick} className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8">
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              Add SubUser
            </Button>
          }
        />
      </div>

      <AddSubUserDialog
        key={isAddDialogOpen ? `staff-${editingUser?.id || 'new'}` : 'closed'}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        initialData={editingUser}
        onSubmit={() => { }}
      />

      <ConformationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete SubUser"
        description="Are you sure you want to delete this subuser? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
