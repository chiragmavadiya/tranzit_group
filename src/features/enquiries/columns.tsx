import type { Column } from '@/components/common/types/DataTable.types';
import type { Enquiry, EnquiryStatus } from './types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
  }
};

export const ENQUIRY_COLUMNS = (onView: (row: Enquiry) => void): Column<Enquiry>[] => [
  {
    key: 'id',
    header: '#',
    cell: (_, __, index) => <span className="text-slate-400 font-medium text-[12px]">{index + 1}</span>
  },
  {
    key: 'date',
    header: 'DATE',
    sortable: true,
    cell: (val) => <span className="text-slate-600 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'customer',
    header: 'CUSTOMER',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px]">{val}</span>
  },
  {
    key: 'issueType',
    header: 'ISSUE TYPE',
    cell: (val) => <span className="text-slate-500 font-semibold text-[12px]">{val}</span>
  },
  {
    key: 'email',
    header: 'EMAIL',
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'status',
    header: 'STATUS',
    cell: (val: EnquiryStatus) => (
      <div className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all",
        STATUS_CONFIG[val].className
      )}>
        {STATUS_CONFIG[val].label}
      </div>
    )
  },
  {
    key: 'actions',
    header: 'ACTION',
    className: 'text-center',
    cell: (_, row) => (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
          onClick={() => onView(row)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];
