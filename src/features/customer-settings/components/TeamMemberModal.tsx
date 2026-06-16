import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Shield, LayoutDashboard, Package, Calculator, ClipboardList, Wallet, Box, BookOpen, FileBarChart, FileText, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Checkbox } from '@/components/ui/checkbox';
import { roles } from '../constant';

const permissionModules = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', name: 'Orders', icon: Package },
  { id: 'quotes', name: 'Get Quotes', icon: Calculator },
  { id: 'manifest', name: 'Manifest Orders', icon: ClipboardList },
  { id: 'wallet', name: 'My Wallet', icon: Wallet },
  { id: 'my_items', name: 'My Items', icon: Box },
  { id: 'address_book', name: 'Address Book', icon: BookOpen },
  { id: 'reports', name: 'Reports', icon: FileBarChart },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  { id: 'enquiry', name: 'Enquiry', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings2 },
];

interface TeamMemberModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (data: any) => void;
  editingUser?: any;
}

export function TeamMemberModal({
  open,
  onClose,
  onSubmit,
  editingUser,
}: TeamMemberModalProps) {
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'full',
    }
  });

  useEffect(() => {
    if (open) {
      if (editingUser) {
        const [firstName, ...lastNameParts] = editingUser.name.split(' ');
        const lastName = lastNameParts.join(' ');
        const roleValue = roles.find(r => r.label === editingUser.role)?.value || 'full';
        reset({
          firstName,
          lastName,
          email: editingUser.email,
          role: roleValue,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          role: 'full',
        });
      }

      // Initialize permissions matrix state
      const initial: Record<string, Record<string, boolean>> = {};
      permissionModules.forEach(mod => {
        if (editingUser) {
          const isAdmin = editingUser.role === 'Admin';
          const isFull = editingUser.role === 'Full Access User';
          initial[mod.id] = {
            view: true,
            create: isAdmin || isFull,
            edit: isAdmin || isFull,
            delete: isAdmin,
          };
        } else {
          initial[mod.id] = {
            view: true,
            create: false,
            edit: false,
            delete: false,
          };
        }
      });
      setPermissions(initial);
    }
  }, [open, editingUser, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      permissions,
    });
    onClose(false);
  };

  const allSelected = permissionModules.every(mod =>
    permissions[mod.id]?.view &&
    permissions[mod.id]?.create &&
    permissions[mod.id]?.edit &&
    permissions[mod.id]?.delete
  );

  const handleSelectAll = () => {
    setPermissions(prev => {
      const updated = { ...prev };
      permissionModules.forEach(mod => {
        updated[mod.id] = {
          view: !allSelected,
          create: !allSelected,
          edit: !allSelected,
          delete: !allSelected,
        };
      });
      return updated;
    });
  };

  const handleCheckboxChange = (moduleId: string, action: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: checked,
      }
    }));
  };

  const isAllActionSelected = (action: string) => {
    if (permissionModules.length === 0 || !permissions) return false;
    return permissionModules.every(mod => !!permissions[mod.id]?.[action]);
  };

  const handleSelectAllAction = (action: string, checked: boolean) => {
    setPermissions(prev => {
      const updated = { ...prev };
      permissionModules.forEach(mod => {
        if (!updated[mod.id]) {
          updated[mod.id] = {};
        }
        updated[mod.id] = {
          ...updated[mod.id],
          [action]: checked,
        };
      });
      return updated;
    });
  };

  return (
    <CustomModel
      open={open}
      onOpenChange={onClose}
      title={editingUser ? "Edit User" : "Invite New User"}
      description={editingUser ? "Edit team member access and settings." : "Add a new member to your team and configure their access."}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitText={editingUser ? "Save Changes" : "Send Invitation"}
      contentClass="sm:max-w-3xl"
    >
      <div className="py-2 space-y-4">
        {/* Basic Info */}
        <section>
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5 ">
            <Controller name="firstName" control={control} render={({ field }) => (
              <FormInput label="First Name" isHalf required placeholder="e.g. Charlie" {...field} />
            )} />
            <Controller name="lastName" control={control} render={({ field }) => (
              <FormInput label="Last Name" isHalf required placeholder="e.g. Brown" {...field} />
            )} />
            <Controller name="email" control={control} render={({ field }) => (
              <FormInput label="Email Address" type="email" isHalf required placeholder="e.g. charlie@example.com" {...field} />
            )} />
            <Controller name="role" control={control} render={({ field }) => (
              <FormSelect label="Assigned Role" options={roles} isHalf required placeholder="Select a role..." {...field} onValueChange={field.onChange} searchdisable allowClear={false} />
            )} />
          </div>
        </section>

        {/* Permissions Matrix */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Permissions Matrix
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] font-bold"
              onClick={handleSelectAll}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
            <div className="grid grid-cols-12 bg-gray-50 dark:bg-zinc-900 p-3 border-b border-gray-200 dark:border-zinc-800 text-[11px] font-bold text-gray-500 uppercase tracking-wide items-center">
              <div className="col-span-4">Module</div>
              <div className="col-span-2 flex items-center justify-start gap-1.5">
                <Checkbox
                  checked={isAllActionSelected('view')}
                  onCheckedChange={(checked) => handleSelectAllAction('view', checked === true)}
                />
                <span>View</span>
              </div>
              <div className="col-span-2 flex items-center justify-start gap-1.5">
                <Checkbox
                  checked={isAllActionSelected('create')}
                  onCheckedChange={(checked) => handleSelectAllAction('create', checked === true)}
                />
                <span>Create</span>
              </div>
              <div className="col-span-2 flex items-center justify-start gap-1.5">
                <Checkbox
                  checked={isAllActionSelected('edit')}
                  onCheckedChange={(checked) => handleSelectAllAction('edit', checked === true)}
                />
                <span>Edit</span>
              </div>
              <div className="col-span-2 flex items-center justify-start gap-1.5">
                <Checkbox
                  checked={isAllActionSelected('delete')}
                  onCheckedChange={(checked) => handleSelectAllAction('delete', checked === true)}
                />
                <span>Delete</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {permissionModules.map((mod) => (
                <div key={mod.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <mod.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-semibold text-gray-700 dark:text-zinc-300">{mod.name}</span>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <Checkbox
                      checked={!!permissions[mod.id]?.view}
                      onCheckedChange={(checked) => handleCheckboxChange(mod.id, 'view', checked === true)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <Checkbox
                      checked={!!permissions[mod.id]?.create}
                      onCheckedChange={(checked) => handleCheckboxChange(mod.id, 'create', checked === true)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <Checkbox
                      checked={!!permissions[mod.id]?.edit}
                      onCheckedChange={(checked) => handleCheckboxChange(mod.id, 'edit', checked === true)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <Checkbox
                      checked={!!permissions[mod.id]?.delete}
                      onCheckedChange={(checked) => handleCheckboxChange(mod.id, 'delete', checked === true)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </CustomModel>
  );
}
