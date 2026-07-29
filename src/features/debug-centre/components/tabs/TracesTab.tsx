import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { useDebugTraces } from '../../hooks';
import { TRACES_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface TracesTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const TracesTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: TracesTabProps) => {
  const navigate = useNavigate();
  const { data: tracesData, isLoading } = useDebugTraces(filters);
  const traces = tracesData?.data || [];
  const totalItems = tracesData?.meta?.total || 0;

  return (
    <DataTable
      columns={TRACES_COLUMNS}
      data={traces}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(row) => navigate(`/admin/debug-centre/${row.trace_id}`)}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Traces"
      emptyMessage="No traces found"
      className='pb-3'
    />
  );
};
