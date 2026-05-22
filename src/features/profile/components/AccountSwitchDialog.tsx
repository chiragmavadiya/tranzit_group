import { useState } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { showToast } from '@/components/ui/custom-toast';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';

interface Account {
  id: string;
  name: string;
  initials: string;
  initialsBg: string;
  type: 'Admin' | 'User' | 'Manager' | 'Viewer';
}

const MOCK_ACCOUNTS: Account[] = [
  { id: '1001', name: 'Acme Corporation', initials: 'AC', initialsBg: 'bg-[#0c1a30]', type: 'Admin' },
  { id: '1002', name: 'Global Tech Ltd', initials: 'GT', initialsBg: 'bg-[#f08519]', type: 'User' },
  { id: '1003', name: 'Nova Solutions', initials: 'NS', initialsBg: 'bg-[#5c6b73]', type: 'Manager' },
  { id: '1004', name: 'Bright Future Inc', initials: 'BF', initialsBg: 'bg-[#135835]', type: 'Viewer' },
  { id: '1005', name: 'Apex Tech Solutions', initials: 'AT', initialsBg: 'bg-[#0f4c81]', type: 'User' },
  { id: '1006', name: 'Pinnacle Group', initials: 'PG', initialsBg: 'bg-[#5b3256]', type: 'Manager' },
  { id: '1007', name: 'Horizon Systems', initials: 'HS', initialsBg: 'bg-[#9b111e]', type: 'Admin' },
  { id: '1008', name: 'Starlight Media', initials: 'SM', initialsBg: 'bg-[#008080]', type: 'Viewer' },
  { id: '1009', name: 'Vanguard Logistics', initials: 'VL', initialsBg: 'bg-[#6b4c35]', type: 'User' }
];

interface AccountSwitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSwitchDialog({ open, onOpenChange }: AccountSwitchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwitch = (account: Account) => {
    showToast(`Successfully switched to ${account.name}`, 'success');
    onOpenChange(false);
  };

  const filteredAccounts = MOCK_ACCOUNTS.filter(acc =>
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.id.includes(searchQuery) ||
    acc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Account>[] = [
    {
      key: 'id',
      header: 'ID',
      className: 'py-4 px-6 w-[80px]'
    },
    {
      key: 'name',
      header: 'Account Name',
      cell: (_, account) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-6 h-6 flex items-center justify-center rounded-sm font-bold text-white shadow-sm shrink-0", account.initialsBg)}>
            {account.initials}
          </div>
          <span className="font-semibold text-slate-900 dark:text-zinc-100">
            {account.name}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      className: 'py-4 px-6 text-xs text-slate-600 dark:text-zinc-300',
      cell: (_, account) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-none",
          account.type === 'Admin' ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/30" : "",
          account.type === 'User' ? "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700/30" : "",
          account.type === 'Manager' ? "bg-[#11223f] text-white dark:bg-blue-900/60 dark:text-blue-100 border border-transparent" : "",
          account.type === 'Viewer' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/30" : ""
        )}>
          {account.type}
        </span>
      )
    },
    {
      key: 'action',
      header: 'Action',
      className: 'py-4 px-6 text-right [&>div]:justify-end',
      cell: (_, account) => (
        <Button
          variant="default"
          onClick={() => handleSwitch(account)}
          className="h-8 text-xs font-semibold px-4 cursor-pointer"
        >
          Switch
        </Button>
      )
    }
  ];

  const customHeader = (
    <div className="flex items-center gap-2 py-1 pr-12 not-italic">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
        <ArrowLeftRight className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 leading-tight">Switch Account</span>
        <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Select an account to continue working</span>
      </div>
    </div>
  );

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title={customHeader as any}
      showFooter={false}
      contentClass="sm:max-w-2xl gap-0"
    >
      <div className="flex flex-col gap-0 -mx-4 max-h-full min-h-0">
        <DataTable
          data={filteredAccounts}
          columns={columns}
          rowKey="id"
          pagination={false}
          header={true}
          searchable={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search account..."
          exportable={false}
          // headerClass="bg-slate-50 dark:bg-zinc-900/40 border-b border-slate-100 dark:border-zinc-800/80 px-5 py-3 h-14"
          totalItems={filteredAccounts.length}
          emptyMessage="No accounts found."
        />
      </div>
    </CustomModel>
  );
}
