import { useState, useCallback, useMemo } from 'react';
import { Users, UserCheck, UserSearch, Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { Switch } from '@/components/ui/switch';
import { AddSubUserDialog } from '../components/AddSubUserDialog';
import type { Column } from '@/components/common/types/DataTable.types';
import { cn } from '@/lib/utils';
import { ConformationModal } from '@/components/common/ConformationModal';
import { showToast } from '@/components/ui/custom-toast';
import {
  useStaffList,
  useStaffCounts,
  useStaffDetails,
  useCreateStaff,
  useUpdateStaff,
  useToggleStaffStatus,
  useDeleteStaff,
  useExportStaff
} from '../hooks/useStaff';
import type { StaffUser } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

const getInitials = (firstName?: string, lastName?: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getBgColor = (email?: string) => {
  const colors = [
    'bg-rose-500 text-white',
    'bg-indigo-500 text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-sky-500 text-white'
  ];
  const hash = (email || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const StatusSwitch = ({ user }: { user: StaffUser }) => {
  const { mutate: toggleStatus, isPending } = useToggleStaffStatus();

  const statusVal = user.status_code !== undefined ? user.status_code : user.status;
  const isChecked = statusVal === true || statusVal === 1 || statusVal === "1";

  const handleToggle = () => {
    const targetStatus = isChecked ? 0 : 1;
    toggleStatus({ id: user.id, status: targetStatus }, {
      onSuccess: () => {
        showToast("Status updated successfully", "success");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || "Failed to update status", "error");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isChecked}
        disabled={isPending}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-zinc-100"
      />
      {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
    </div>
  );
};

export default function StaffManagementPage() {
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo(() => ({
    search: debouncedSearch || undefined,
    page,
    per_page: pageSize,
  }), [debouncedSearch, page, pageSize]);

  const { data: staffListResponse, isLoading } = useStaffList(queryParams);
  const { data: countsResponse } = useStaffCounts();
  const { data: staffDetailsResponse, isLoading: isLoadingDetails } = useStaffDetails(
    editingUser?.id || '',
    isAddDialogOpen && !!editingUser?.id
  );

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();
  const exportMutation = useExportStaff();

  const staffData = useMemo(() => staffListResponse?.data || [], [staffListResponse]);
  const totalItems = useMemo(() => staffListResponse?.meta?.total || staffListResponse?.data?.length || 0, [staffListResponse]);

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

  const handleExport = useCallback((format: string) => {
    exportMutation.mutate({ format, params: queryParams }, {
      onSuccess: ({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast("Exported successfully", "success");
      },
      onError: () => {
        showToast("Export failed", "error");
      }
    });
  }, [exportMutation, queryParams]);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete, {
        onSuccess: () => {
          showToast("Staff user deleted successfully", "success");
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to delete staff user", "error");
        }
      });
    }
  }, [userToDelete, deleteMutation]);


  const handleDialogSubmit = useCallback((formData: any) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData }, {
        onSuccess: () => {
          showToast("Staff user updated successfully", "success");
          setIsAddDialogOpen(false);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to update staff user", "error");
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          showToast("Staff user created successfully", "success");
          setIsAddDialogOpen(false);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to create staff user", "error");
        }
      });
    }
  }, [editingUser, createMutation, updateMutation]);

  const columns = useMemo<Column<StaffUser>[]>(() => [
    {
      key: 'first_name',
      header: 'DETAILS',
      cell: (_, row) => {
        const initials = getInitials(row.first_name, row.last_name);
        const initialsBg = getBgColor(row.email);
        const name = `${row.first_name} ${row.last_name}`;
        return (
          <div className="flex items-center gap-3 py-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-white dark:border-zinc-800 pt-[3px]", initialsBg)}>
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-[13px]">{name}</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{row.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      header: 'ROLE',
      cell: (val: string) => <span className="text-slate-500 dark:text-zinc-400 font-medium">{val}</span>
    },
    {
      key: 'last_login',
      header: 'LAST LOGIN',
      cell: (_, row: any) => <span className="text-slate-500 dark:text-zinc-400 font-medium">{row.last_login || '—'}</span>
    },
    {
      key: 'created_at',
      header: 'CREATED AT',
      // cell: (_, row: any) => {
      //   const dateStr = row.created_at;
      //   return (
      //     <span className="text-slate-500 dark:text-zinc-400 font-medium">
      //       {dateStr ? new Date(dateStr).toLocaleDateString() : '—'}
      //     </span>
      //   );
      // }
    },
    {
      key: 'status_code',
      header: 'STATUS',
      cell: (_, row) => <StatusSwitch user={row} />
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
  ], [handleEditClick, handleDeleteClick]);

  // Extract count details safely from API metrics
  const totalUsers = countsResponse?.data?.total_users?.count;
  const activeUsers = countsResponse?.data?.active_users?.count;
  const pendingUsers = countsResponse?.data?.pending_users?.count;

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <StatCard
          label="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          className='py-1'
        />
        <StatCard
          label="Active Users"
          value={activeUsers.toString()}
          icon={UserCheck}
          color="bg-green-50 dark:bg-green-900/20 text-green-500"
          className='py-1'
        />
        <StatCard
          label="Inactive Users"
          value={pendingUsers.toString()}
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
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(Number(size)); setPage(1); }}
          currentPage={page}
          onPageChange={setPage}
          searchable={true}
          headerTitle="SubUser"
          emptyMessage="No users found"
          className="pb-3"
          searchPlaceholder="Search users..."
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          searchValue={search}
          loading={isLoading}
          onExport={handleExport}
          isExporting={exportMutation.isPending}
          customHeader={
            <Button onClick={handleAddClick} className="gap-2 text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8">
              <Plus className="h-3.5 w-3.5 " />
              Add SubUser
            </Button>
          }
        />
      </div>

      <AddSubUserDialog
        key={isAddDialogOpen ? `staff-${editingUser?.id || 'new'}` : 'closed'}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        initialData={staffDetailsResponse?.data || editingUser}
        isLoading={isLoadingDetails}
        onSubmit={handleDialogSubmit}
      />

      <ConformationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete SubUser"
        description="Are you sure you want to delete this subuser? This action cannot be undone."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
