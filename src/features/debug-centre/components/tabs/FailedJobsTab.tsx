import { DataTable } from '@/components/common/DataTable';
import { useFailedJobs } from '../../hooks';
import { FAILED_JOBS_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface FailedJobsTabProps {
  filters: DebugFilters;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const FailedJobsTab = ({ filters, onPageChange, onPageSizeChange, onSearchChange }: FailedJobsTabProps) => {
  const { data: jobsData, isLoading } = useFailedJobs(filters);
  const jobs = jobsData?.data || [];
  const totalItems = jobsData?.meta?.total || 0;

  return (
    <DataTable
      columns={FAILED_JOBS_COLUMNS}
      data={jobs}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={filters.search}
      onSearchChange={onSearchChange}
      headerTitle="Failed Jobs"
      exportable={false}
      emptyMessage="No failed jobs found"
      className='pb-3'
    />
  );
};
