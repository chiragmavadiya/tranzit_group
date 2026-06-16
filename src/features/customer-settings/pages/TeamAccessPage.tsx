// import { 
//   Shield, 
//   Lock
// } from 'lucide-react';

// export default function TeamAccessPage() {
//   return (
//     <div className="flex flex-1 flex-col gap-6 h-full animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-zinc-100 my-0">
//           <Shield className="w-6 h-6 text-primary" />
//           Team Access & Permissions
//         </h1>
//         <p className="text-sm text-slate-500 dark:text-zinc-400">
//           Manage your team members and roles.
//         </p>
//       </div>

//       {/* Coming Soon Content */}
//       <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
//         <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
//           <Lock className="w-6 h-6 text-primary" />
//         </div>

//         <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-0 mb-2">
//           Coming Soon
//         </h2>

//         <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md my-0 leading-relaxed">
//           We are currently building the team access and role-based permissions management system. Soon you will be able to invite team members, assign custom roles, and configure granular access controls for your organization.
//         </p>
//       </div>
//     </div>
//   );
// }

// ============================================================================
// PRESERVED ORIGINAL CODE (DISABLED)
// ============================================================================

import { useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { Switch } from '@/components/ui/switch';
import { ConformationModal } from '@/components/common/ConformationModal';
import { TeamMemberModal } from '../components/TeamMemberModal';
import { roles } from '../constant';

const mockUsers = [
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Admin', status: 'Active', createdAt: '2022-01-01' },
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Full Access User', status: 'Active', createdAt: '2022-01-01' },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: '3PL User', status: 'Invited', createdAt: '2022-01-01' },
];

export default function TeamAccessPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

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
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const columns = [
    {
      header: 'User',
      key: 'user',
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
            {row.name.substring(0, 2)}
          </div>
          <div>
            <p className="my-0 font-semibold text-gray-900 dark:text-zinc-100">{row.name}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      cell: (val: any) => (
        <p className="my-0 text-xs text-gray-500 dark:text-zinc-400">{val}</p>
      )
    },
    {
      header: 'Role',
      key: 'role',
      cell: (val: string) => <span className="font-medium">{val}</span>
    },
    {
      header: 'Status',
      key: 'status',
      cell: (val: string, row: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={val === 'Active'}
            onCheckedChange={(checked) => {
              setUsers(prev => prev.map(u => u.id === row.id ? { ...u, status: checked ? 'Active' : 'Invited' } : u));
            }}
            className="data-[state=checked]:bg-primary"
            disabled={row.role === "Admin"}
          />
          <span className="text-xs text-gray-500 font-medium">
            {val}
          </span>
        </div>
      )
    },
    {
      header: 'Created Date',
      key: 'createdAt',
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
            disabled={row.role === 'Admin'}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent"
            onClick={() => handleDeleteClick(row)}
            disabled={row.role === 'Admin'}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleFormSubmit = (data: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: roles.find(r => r.value === data.role)?.label || 'Full Access User',
      } : u));
    } else {
      const newUser = {
        id: String(Math.max(...users.map(u => Number(u.id)), 0) + 1),
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: roles.find(r => r.value === data.role)?.label || 'Full Access User',
        status: 'Invited',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

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
        />
      </div>

      <TeamMemberModal
        open={isAddUserOpen}
        onClose={(open) => {
          setIsAddUserOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
      />

      <ConformationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        className="w-full"
      />
    </div>
  );
}
