import { DataTable } from '@/components/common/DataTable';
import { useSlowExternalCalls } from '../../hooks';
import { SLOW_EXTERNAL_CALLS_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface SlowExternalCallsTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const SlowExternalCallsTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: SlowExternalCallsTabProps) => {
  const { data: callsData, isLoading } = useSlowExternalCalls(filters);
  const calls = callsData?.data || [];
  const totalItems = callsData?.meta?.total || 0;

  return (
    <DataTable
      columns={SLOW_EXTERNAL_CALLS_COLUMNS}
      data={calls}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Slow External Calls"
      exportable={false}
      emptyMessage="No slow external calls found"
      className='pb-3'
    />
  );
};
