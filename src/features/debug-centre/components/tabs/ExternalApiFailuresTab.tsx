import { DataTable } from '@/components/common/DataTable';
import { useExternalApiFailures } from '../../hooks';
import { EXTERNAL_API_FAILURES_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface ExternalApiFailuresTabProps {
  filters: DebugFilters;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const ExternalApiFailuresTab = ({ filters, onPageChange, onPageSizeChange, onSearchChange }: ExternalApiFailuresTabProps) => {
  const { data: failuresData, isLoading } = useExternalApiFailures(filters);
  const failures = failuresData?.data || [];
  const totalItems = failuresData?.meta?.total || 0;

  return (
    <DataTable
      columns={EXTERNAL_API_FAILURES_COLUMNS}
      data={failures}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={filters.search}
      onSearchChange={onSearchChange}
      headerTitle="External API Failures"
      exportable={false}
      className='pb-3'
      emptyMessage="No external API failures found"
    />
  );
};
