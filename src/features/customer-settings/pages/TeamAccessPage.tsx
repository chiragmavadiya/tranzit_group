import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { Switch } from '@/components/ui/switch';
import { ConformationModal } from '@/components/common/ConformationModal';
import { TeamMemberModal } from '../components/TeamMemberModal';
import { showToast } from '@/components/ui/custom-toast';
import {
  useTeamUsersList,
  useToggleTeamUserStatus,
  useDeleteTeamUser,
  useTeamUserDetails,
} from '../hooks/useTeamUsers';

const StatusSwitch = ({ user, isChecked }: { user: any; isChecked: boolean }) => {
  const { mutate: toggleStatus, isPending } = useToggleTeamUserStatus();

  const handleToggle = () => {
    toggleStatus(user.id, {
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
        disabled={isPending || user.role === "Admin" || user.role === "admin" || user.role === "parent"}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary"
      />
      {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
    </div>
  );
};

export default function TeamAccessPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const { data: teamUsersResponse, isLoading } = useTeamUsersList();
  const users = useMemo(() => teamUsersResponse?.data || [], [teamUsersResponse]);

  const { data: teamUserDetailsResponse } = useTeamUserDetails(
    editingUser?.id || '',
    isAddUserOpen && !!editingUser?.id
  );

  const deleteMutation = useDeleteTeamUser();

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setIsAddUserOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          showToast("User deleted successfully", "success");
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to delete user", "error");
        }
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const columns = useMemo(() => [
    {
      header: 'User',
      key: 'user',
      cell: (_: any, row: any) => {
        const nameVal = row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email || '';
        const initials = `${row.first_name?.[0] || ''}${row.last_name?.[0] || ''}`.toUpperCase() || nameVal.substring(0, 2);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase pt-[3px]">
              {initials || '??'}
            </div>
            <div>
              <p className="my-0 font-semibold text-gray-900 dark:text-zinc-100">{nameVal}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Email',
      key: 'email',
      cell: (val: any) => (
        <p className="my-0 text-xs text-gray-500 dark:text-zinc-400">{val}</p>
      )
    },
    {
      header: 'Status',
      key: 'status',
      cell: (val: string | number | boolean, row: any) => {
        const isChecked = val === 'Active' || val === 'active' || val === 1 || val === '1' || val === true;
        return (
          <StatusSwitch user={row} isChecked={isChecked} />
        );
      }
    },
    {
      header: 'Created Date',
      key: 'created_at',
    },
    {
      header: 'Actions',
      key: 'actions',
      className: "w-24 px-0 pr-3 print:hidden",
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:text-primary bg-transparent dark:hover:bg-transparent"
            onClick={() => handleEditClick(row)}
            disabled={row.role === 'Admin' || row.role === 'admin' || row.role === 'parent'}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent"
            onClick={() => handleDeleteClick(row)}
            disabled={row.role === 'Admin' || row.role === 'admin' || row.role === 'parent'}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ], []);


  return (
    <div className="flex flex-1 flex-col gap-6 h-full">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <DataTable
          data={users}
          columns={columns}
          headerTitle="Team Members"
          headerDescription="Manage your team access and permissions."
          searchable={false}
          exportable={false}
          searchPlaceholder="Search users by name or email..."
          customHeader={
            <Button onClick={() => setIsAddUserOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          }
          totalItems={users.length}
          className='pb-3'
          loading={isLoading}
        />
      </div>

      <TeamMemberModal
        open={isAddUserOpen}
        onClose={(open) => {
          setIsAddUserOpen(open);
          if (!open) setEditingUser(null);
        }}
        // onSubmit={handleFormSubmit}
        editingUser={teamUserDetailsResponse?.data || editingUser}
      />

      <ConformationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.first_name || userToDelete?.name || ''}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        className="w-full"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
