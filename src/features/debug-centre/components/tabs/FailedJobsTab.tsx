import { DataTable } from '@/components/common/DataTable';
import { useFailedJobs } from '../../hooks';
import { FAILED_JOBS_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface FailedJobsTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const FailedJobsTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: FailedJobsTabProps) => {
  const { data: jobsData, isLoading } = useFailedJobs(filters);
  const jobs = jobsData?.data || [];
  const totalItems = jobsData?.meta?.total || 0;

  return (
    <DataTable
      columns={FAILED_JOBS_COLUMNS}
      data={jobs}
      moduleName="failedJobs"
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Failed Jobs"
      exportable={false}
      emptyMessage="No failed jobs found"
      className='pb-3'
    />
  );
};
