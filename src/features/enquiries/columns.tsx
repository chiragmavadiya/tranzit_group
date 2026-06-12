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
  closed: {
    label: 'Closed',
    className: 'bg-slate-50 text-slate-600 dark:bg-zinc-500/10 dark:text-zinc-400 border-slate-100 dark:border-zinc-500/20'
  }
};

export const ENQUIRY_COLUMNS = (onView: (row: Enquiry) => void): Column<Enquiry>[] => [
  {
    key: 'id',
    header: '#',
    cell: (_, __, index) => <span className="">{index + 1}</span>
  },

  {
    key: 'customer',
    header: 'CUSTOMER',
    sortable: true,
    cell: (val) => <span className="font-bold uppercase">{val}</span>
  },
  {
    key: 'issue_type',
    header: 'ISSUE TYPE',
    // cell: (val) => <span className="text-slate-500 font-semibold">{val}</span>
  },
  {
    key: 'email',
    header: 'EMAIL',
    // cell: (val) => <span className="text-slate-500 font-medium">{val}</span>
  },
  {
    key: 'status',
    header: 'STATUS',
    cell: (val: EnquiryStatus) => (
      <div className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium tracking-wide border transition-all",
        STATUS_CONFIG[val.toLowerCase() as EnquiryStatus]?.className || 'bg-gray-50 text-gray-600'
      )}>
        {val}
      </div>
    )
  },
  {
    key: 'date',
    header: 'DATE',
    sortable: true,
    cell: (val) => <span className="text-slate-600 font-medium">{val}</span>
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
          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all active:scale-90"
          onClick={() => onView(row)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];
