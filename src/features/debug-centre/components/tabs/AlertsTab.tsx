import { useMemo } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { useDebugAlerts, useIgnoreAlert, useResolveAlert } from '../../hooks';
import { ALERTS_COLUMNS } from '../../constants/columns';
import type { DebugAlert, DebugFilters } from '../../types';
import { showToast } from '@/components/ui/custom-toast';
import { Button } from '@/components/ui/button';
import { Check, EyeOff, Loader2 } from 'lucide-react';

interface AlertsTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

const AlertActionsCell = ({ alert }: { alert: DebugAlert }) => {
  const { mutate: resolveAlert, isPending: isResolving } = useResolveAlert();
  const { mutate: ignoreAlert, isPending: isIgnoring } = useIgnoreAlert();

  const handleResolve = () => {
    resolveAlert(alert.id, {
      onSuccess: () => {
        showToast("Alert resolved successfully", "success");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || "Failed to resolve alert", "error");
      }
    });
  };

  const handleIgnore = () => {
    ignoreAlert(alert.id, {
      onSuccess: () => {
        showToast("Alert ignored successfully", "success");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || "Failed to ignore alert", "error");
      }
    });
  };

  if (alert.status !== 'open') {
    return <span className="text-xs text-slate-400 dark:text-slate-500">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2 border-emerald-500/30 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs gap-1"
        onClick={handleResolve}
        disabled={isResolving || isIgnoring}
      >
        {isResolving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        Resolve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 text-xs gap-1"
        onClick={handleIgnore}
        disabled={isResolving || isIgnoring}
      >
        {isIgnoring ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
        Ignore
      </Button>
    </div>
  );
};

export const AlertsTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: AlertsTabProps) => {
  const { data: alertsData, isLoading } = useDebugAlerts(filters);
  const alerts = alertsData?.data || [];
  const totalItems = alertsData?.meta?.total || 0;

  const columns = useMemo(() => [
    ...ALERTS_COLUMNS,
    {
      key: 'actions',
      header: 'Actions',
      cell: (_: any, row: DebugAlert) => <AlertActionsCell alert={row} />,
      width: '200px',
    }
  ], []);

  return (
    <DataTable
      columns={columns}
      data={alerts}
      moduleName="alert"
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Alerts"
      exportable={false}
      emptyMessage="No alerts found"
      className='pb-3'
    />
  );
};
