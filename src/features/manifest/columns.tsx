import type { Column } from '@/components/common/types/DataTable.types';
import type { Manifest } from './types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { format } from 'date-fns';

const MANIFEST_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30',
  processing: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30',
  failed: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30',
};

export const getManifestColumns = (
  onDownloadPDF: (id: string | number) => void,
  downloadingId: string | number | null
): Column<Manifest>[] => [
  {
    key: 'manifest_number',
    header: 'MANIFEST NUMBER',
    sortable: true,
    sticky: 'left',
    cell: (value) => <span className="font-bold text-gray-900 dark:text-zinc-100">{value}</span>
  },
  {
    key: 'courier_name',
    header: 'COURIER',
    sortable: true,
    cell: (value) => <span className="text-slate-600 dark:text-zinc-400 font-medium">{value}</span>
  },
  {
    key: 'total_consignments',
    header: 'CONSIGNMENTS',
    sortable: true,
    cell: (value) => <span className="text-slate-600 dark:text-zinc-400 font-semibold">{value}</span>
  },
  {
    key: 'status',
    header: 'STATUS',
    sortable: true,
    cell: (value) => {
      const status = String(value).toLowerCase();
      const colorClass = MANIFEST_STATUS_COLORS[status] || 'bg-slate-50 text-slate-700 border border-slate-200/50';
      return (
        <Badge className={cn("px-2.5 py-0.5 rounded-md font-semibold text-[11px] capitalize shadow-none border-none", colorClass)}>
          {status}
        </Badge>
      );
    }
  },
  {
    key: 'created_at',
    header: 'CREATED DATE',
    sortable: true,
    cell: (value) => {
      try {
        return <span className="text-slate-500 dark:text-zinc-500 font-medium">{format(new Date(value), 'dd-MM-yyyy HH:mm')}</span>;
      } catch {
        return <span className="text-slate-500 dark:text-zinc-500 font-medium">{value}</span>;
      }
    }
  },
  {
    key: 'actions',
    header: 'ACTION',
    sticky: 'right',
    cell: (_, row) => {
      const isDownloading = downloadingId === row.id;
      return (
        <div className="flex items-center gap-2">
          <CustomTooltip title="Download PDF" placement="bottom">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 hover:text-primary bg-transparent hover:bg-transparent dark:hover:bg-transparent"
              onClick={() => onDownloadPDF(row.id)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </CustomTooltip>
        </div>
      );
    }
  }
];
