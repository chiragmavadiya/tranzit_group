import { DataTable } from '@/components/common/DataTable';
import { useSlowRequests } from '../../hooks';
import { SLOW_REQUESTS_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface SlowRequestsTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const SlowRequestsTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: SlowRequestsTabProps) => {
  const { data: requestsData, isLoading } = useSlowRequests(filters);
  const requests = requestsData?.data || [];
  const totalItems = requestsData?.meta?.total || 0;

  return (
    <DataTable
      columns={SLOW_REQUESTS_COLUMNS}
      data={requests}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Slow Requests"
      exportable={false}
      emptyMessage="No slow requests found"
      className='pb-3'
    />
  );
};
