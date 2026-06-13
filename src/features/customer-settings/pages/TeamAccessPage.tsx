import { 
  Shield, 
  Lock
} from 'lucide-react';

export default function TeamAccessPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-zinc-100 my-0">
          <Shield className="w-6 h-6 text-primary" />
          Team Access & Permissions
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Manage your team members and roles.
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-primary" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-0 mb-2">
          Coming Soon
        </h2>

        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md my-0 leading-relaxed">
          We are currently building the team access and role-based permissions management system. Soon you will be able to invite team members, assign custom roles, and configure granular access controls for your organization.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PRESERVED ORIGINAL CODE (DISABLED)
// ============================================================================
// 
// import { useState } from 'react';
// import { Plus, Shield, Settings2, Package, Users, Wallet, Link, FileText, MapPin } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/common/DataTable';
// import { CustomModel } from '@/components/ui/dialog';
// import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
// import { Switch } from '@/components/ui/switch';
// import { useForm, Controller } from 'react-hook-form';
// 
// const roles = [
//   { label: 'Parent Account', value: 'parent' },
//   { label: '3PL User', value: '3pl' },
//   { label: 'Full Access User', value: 'full' },
// ];
// 
// const mockUsers = [
//   { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Admin', status: 'Active', createdAt: '2022-01-01' },
//   { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Full Access User', status: 'Active', createdAt: '2022-01-01' },
//   { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: '3PL User', status: 'Invited', createdAt: '2022-01-01' },
// ];
// 
// const permissionModules = [
//   { id: 'orders', name: 'Orders', icon: Package },
//   { id: 'customers', name: 'Customers', icon: Users },
//   { id: 'wallet', name: 'Wallet', icon: Wallet },
//   { id: 'settings', name: 'Settings', icon: Settings2 },
//   { id: 'integrations', name: 'Integrations', icon: Link },
//   { id: 'reports', name: 'Reports', icon: FileText },
//   { id: 'pickup', name: 'Pickup Addresses', icon: MapPin },
// ];
// 
// export function TeamAccessPageOriginal() {
//   const [isAddUserOpen, setIsAddUserOpen] = useState(false);
//   const [users, setUsers] = useState(mockUsers);
// 
//   const { control, handleSubmit, reset } = useForm({
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       role: 'full',
//     }
//   });
// 
//   const columns = [
//     {
//       header: 'User',
//       key: 'user',
//       cell: (_: any, row: any) => (
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
//             {row.name.substring(0, 2)}
//           </div>
//           <div>
//             <p className="my-0 font-semibold text-gray-900 dark:text-zinc-100">{row.name}</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       header: 'Email',
//       key: 'email',
//       cell: (val: any) => (
//         <p className="my-0 text-xs text-gray-500 dark:text-zinc-400">{val}</p>
//       )
//     },
//     {
//       header: 'Role',
//       key: 'role',
//       cell: (val: string) => <span className="font-medium">{val}</span>
//     },
//     {
//       header: 'Status',
//       key: 'status',
//       cell: (val: string, row: any) => (
//         <div className="flex items-center gap-2">
//           <Switch
//             checked={val === 'Active'}
//             onCheckedChange={(checked) => {
//               setUsers(prev => prev.map(u => u.id === row.id ? { ...u, status: checked ? 'Active' : 'Invited' } : u));
//             }}
//             className="data-[state=checked]:bg-primary"
//             disabled={row.role === "Admin"}
//           />
//           <span className="text-xs text-gray-500 font-medium">
//             {val}
//           </span>
//         </div>
//       )
//     },
//     {
//       header: 'Created Date',
//       key: 'createdAt',
//     },
//   ];
// 
//   const onSubmit = (data: any) => {
//     const newUser = {
//       id: String(users.length + 1),
//       name: `${data.firstName} ${data.lastName}`,
//       email: data.email,
//       role: roles.find(r => r.value === data.role)?.label || 'Full Access User',
//       status: 'Invited',
//       createdAt: new Date().toISOString().split('T')[0],
//     };
//     setUsers(prev => [...prev, newUser]);
//     setIsAddUserOpen(false);
//     reset();
//   };
// 
//   return (
//     <div className="flex flex-1 flex-col gap-6 h-full">
//       <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
//         <DataTable
//           data={users}
//           columns={columns}
//           headerTitle="Team Members"
//           headerDescription="Manage your team access and permissions."
//           searchable
//           searchPlaceholder="Search users by name or email..."
//           customHeader={
//             <Button onClick={() => setIsAddUserOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2">
//               <Plus className="w-4 h-4" />
//               Add User
//             </Button>
//           }
//           totalItems={users.length}
//           className='pb-3'
//         />
//       </div>
// 
//       <CustomModel
//         open={isAddUserOpen}
//         onOpenChange={setIsAddUserOpen}
//         title="Invite New User"
//         description="Add a new member to your team and configure their access."
//         onSubmit={handleSubmit(onSubmit)}
//         submitText="Send Invitation"
//         contentClass="sm:max-w-3xl"
//       >
//         <div className="py-2 space-y-4">
//           {/* Basic Info */}
//           <section>
//             <div className="grid grid-cols-12 gap-x-4 gap-y-3.5 ">
//               <Controller name="firstName" control={control} render={({ field }) => (
//                 <FormInput label="First Name" isHalf required {...field} />
//               )} />
//               <Controller name="lastName" control={control} render={({ field }) => (
//                 <FormInput label="Last Name" isHalf required {...field} />
//               )} />
//               <Controller name="email" control={control} render={({ field }) => (
//                 <FormInput label="Email Address" type="email" isHalf required {...field} />
//               )} />
//               <Controller name="role" control={control} render={({ field }) => (
//                 <FormSelect label="Assigned Role" options={roles} isHalf required {...field} onValueChange={field.onChange} />
//               )} />
//             </div>
//           </section>
// 
//           {/* Permissions Matrix */}
//           <section>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-[13px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-2">
//                 <Shield className="w-4 h-4 text-primary" /> Permissions Matrix
//               </h3>
//               <Button variant="ghost" size="sm" className="h-6 text-[11px] font-bold">Select All</Button>
//             </div>
// 
//             <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
//               <div className="grid grid-cols-12 bg-gray-50 dark:bg-zinc-900 p-3 border-b border-gray-200 dark:border-zinc-800 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
//                 <div className="col-span-4">Module</div>
//                 <div className="col-span-2 text-center">View</div>
//                 <div className="col-span-2 text-center">Create</div>
//                 <div className="col-span-2 text-center">Edit</div>
//                 <div className="col-span-2 text-center">Delete</div>
//               </div>
// 
//               <div className="divide-y divide-gray-100 dark:divide-zinc-800">
//                 {permissionModules.map((mod) => (
//                   <div key={mod.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
//                     <div className="col-span-4 flex items-center gap-3">
//                       <mod.icon className="w-4 h-4 text-gray-400" />
//                       <span className="text-[13px] font-semibold text-gray-700 dark:text-zinc-300">{mod.name}</span>
//                     </div>
//                     <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked /></div>
//                     <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /></div>
//                     <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /></div>
//                     <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         </div>
//       </CustomModel>
//     </div>
//   );
// }
