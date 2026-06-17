import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Shield,
  LayoutDashboard,
  Package,
  Calculator,
  ClipboardList,
  Wallet,
  Box,
  BookOpen,
  FileBarChart,
  FileText,
  Settings2,
  Users,
  Sliders,
  Link,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { roles } from '../constant';
import { useCreateTeamUser, useTeamUserFormOptions, useUpdateTeamUser } from '../hooks/useTeamUsers';
import { showToast } from '@/components/ui/custom-toast';

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  order: Package,
  get_quote: Calculator,
  manifest_order: ClipboardList,
  my_wallet: Wallet,
  my_items: Box,
  my_address_book: BookOpen,
  report: FileBarChart,
  invoice: FileText,
  enquiry: FileText,
  settings_account_detail: Settings2,
  settings_team_access: Users,
  settings_rule_management: Sliders,
  settings_integrations: Link,
};

interface TeamMemberModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  // onSubmit: (data: any) => void;
  editingUser?: any;
}

export function TeamMemberModal({
  open,
  onClose,
  // onSubmit,
  editingUser,
}: TeamMemberModalProps) {
  const [permissions, setPermissions] = useState<Record<string, string>>({});

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      orderCreationEmailReceived: false,
    }
  });

  const { data: formOptionsResponse, isLoading: isLoadingOptions } = useTeamUserFormOptions(open);

  const modules = useMemo(() => formOptionsResponse?.data?.modules || [], [formOptionsResponse]);
  const defaultPermissions = useMemo(() => formOptionsResponse?.data?.default_permissions || {}, [formOptionsResponse]);

  const createMutation = useCreateTeamUser();
  const updateMutation = useUpdateTeamUser();

  useEffect(() => {
    if (open && modules.length > 0) {
      if (editingUser) {
        const firstName = editingUser.first_name || (editingUser.name ? editingUser.name.split(' ')[0] : '');
        const lastName = editingUser.last_name || (editingUser.name ? editingUser.name.split(' ').slice(1).join(' ') : '');
        const roleValue = roles.find(r => r.label === editingUser.role || r.value === editingUser.role)?.value || 'user';
        const orderEmailVal = editingUser.order_creation_email_received !== undefined
          ? !!editingUser.order_creation_email_received
          : true;

        reset({
          firstName,
          lastName,
          email: editingUser.email,
          role: roleValue,
          orderCreationEmailReceived: orderEmailVal,
        });

        // Initialize permissions from editingUser
        const initial: Record<string, string> = {};
        modules.forEach((mod: any) => {
          initial[mod.key] = editingUser.permissions?.[mod.key] || defaultPermissions[mod.key] || 'no_access';
        });
        setPermissions(initial);
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          role: 'user',
          orderCreationEmailReceived: false,
        });

        // Default permissions for new user
        const initial: Record<string, string> = {};
        const fullAccessKeys = ['dashboard', 'order', 'manifest_order', 'my_address_book', 'my_items'];
        modules.forEach((mod: any) => {
          if (fullAccessKeys.includes(mod.key)) {
            initial[mod.key] = 'full';
          } else {
            initial[mod.key] = defaultPermissions[mod.key] || 'no_access';
          }
        });
        setPermissions(initial);
      }
    }
  }, [open, editingUser, reset, modules, defaultPermissions]);

  const handleRoleChange = (role: string) => {
    setPermissions(prev => {
      const updated = { ...prev };
      if (role === 'admin') {
        modules.forEach((mod: any) => {
          updated[mod.key] = 'full';
        });
      } else if (role === 'user') {
        const fullAccessKeys = ['dashboard', 'order', 'manifest_order', 'my_address_book', 'my_items'];
        modules.forEach((mod: any) => {
          if (fullAccessKeys.includes(mod.key)) {
            updated[mod.key] = 'full';
          } else {
            updated[mod.key] = 'no_access';
          }
        });
      } else if (role === 'custom') {
        modules.forEach((mod: any) => {
          updated[mod.key] = defaultPermissions[mod.key] || 'no_access';
        });
      }
      return updated;
    });
  };

  const handleFormSubmit = (data: any) => {
    const formData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role: data.role,
      permissions,
      order_creation_email_received: !!data.orderCreationEmailReceived,
    };
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData }, {
        onSuccess: () => {
          showToast("User updated successfully", "success");
          onClose(false);

        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to update user", "error");
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          showToast("User invited successfully", "success");
          onClose(false);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || "Failed to invite user", "error");
        }
      });
    }
  };


  const allSelected = useMemo(() => {
    if (modules.length === 0) return false;
    return modules.every((mod: any) => permissions[mod.key] === 'full');
  }, [modules, permissions]);

  const handleSelectAll = () => {
    setPermissions(prev => {
      const updated = { ...prev };
      const target = allSelected ? 'no_access' : 'full';
      modules.forEach((mod: any) => {
        updated[mod.key] = target;
      });
      return updated;
    });
    setValue('role', 'custom');
  };

  const handleRadioChange = (moduleId: string, value: string) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: value
    }));
    setValue('role', 'custom');
  };

  const isAllActionSelected = (action: string) => {
    if (modules.length === 0 || !permissions) return false;
    return modules.every((mod: any) => permissions[mod.key] === action);
  };

  const handleSelectAllAction = (action: string) => {
    setPermissions(prev => {
      const updated = { ...prev };
      modules.forEach((mod: any) => {
        updated[mod.key] = action;
      });
      return updated;
    });
    setValue('role', 'custom');
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
      isLoading={createMutation.isPending || updateMutation.isPending}
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
              <FormSelect
                label="Assigned Role"
                options={roles}
                isHalf
                required
                placeholder="Select a role..."
                {...field}
                onValueChange={(val) => {
                  field.onChange(val);
                  handleRoleChange(val);
                }}
                searchdisable
                allowClear={false}
              />
            )} />
            <Controller name="orderCreationEmailReceived" control={control} render={({ field }) => (
              <div className="col-span-12 flex items-center space-x-2.5 mt-2 bg-slate-50/50 dark:bg-zinc-900/30 p-3.5 rounded-lg border border-gray-100 dark:border-zinc-800/80">
                <Checkbox
                  id="orderCreationEmailReceived"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="orderCreationEmailReceived"
                  className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-zinc-300 cursor-pointer select-none"
                >
                  Receive Order Creation Email Notifications
                </label>
              </div>
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
              disabled={isLoadingOptions}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
            {isLoadingOptions ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-zinc-900 p-3 border-b border-gray-200 dark:border-zinc-800 text-[11px] font-bold text-gray-500 uppercase tracking-wide items-center">
                  <div className="col-span-6">Module</div>
                  <div className="col-span-2 flex items-center justify-start gap-1.5">
                    <Checkbox
                      checked={isAllActionSelected('no_access')}
                      onCheckedChange={(checked) => {
                        if (checked) handleSelectAllAction('no_access');
                      }}
                    />
                    <span>No Access</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-start gap-1.5">
                    <Checkbox
                      checked={isAllActionSelected('read_only')}
                      onCheckedChange={(checked) => {
                        if (checked) handleSelectAllAction('read_only');
                      }}
                    />
                    <span>Read Only</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-start gap-1.5">
                    <Checkbox
                      checked={isAllActionSelected('full')}
                      onCheckedChange={(checked) => {
                        if (checked) handleSelectAllAction('full');
                      }}
                    />
                    <span>Full</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {modules.map((mod: any) => {
                    const Icon = iconMap[mod.key] || Settings2;
                    return (
                      <div key={mod.key} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div className="col-span-6 flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-semibold text-gray-700 dark:text-zinc-300">{mod.label}</span>
                        </div>
                        <RadioGroup
                          value={permissions[mod.key] || 'no_access'}
                          onValueChange={(val) => handleRadioChange(mod.key, val)}
                          className="col-span-6 grid grid-cols-6 gap-0"
                        >
                          <div className="col-span-2 flex justify-start">
                            <RadioGroupItem value="no_access" />
                          </div>
                          <div className="col-span-2 flex justify-start">
                            <RadioGroupItem value="read_only" />
                          </div>
                          <div className="col-span-2 flex justify-start">
                            <RadioGroupItem value="full" />
                          </div>
                        </RadioGroup>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </CustomModel>
  );
}
