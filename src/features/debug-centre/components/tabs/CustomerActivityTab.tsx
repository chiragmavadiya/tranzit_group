import { DataTable } from '@/components/common/DataTable';
import { useCustomerActivity } from '../../hooks';
import { CUSTOMER_ACTIVITY_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';

interface CustomerActivityTabProps {
  filters: DebugFilters;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const CustomerActivityTab = ({ filters, onPageChange, onPageSizeChange, onSearchChange }: CustomerActivityTabProps) => {
  const { data: activityData, isLoading } = useCustomerActivity(filters);
  const activity = activityData?.data || [];
  const totalItems = activityData?.meta?.total || 0;

  return (
    <DataTable
      columns={CUSTOMER_ACTIVITY_COLUMNS}
      data={activity}
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={filters.search}
      onSearchChange={onSearchChange}
      headerTitle="Customer Activity"
      exportable={false}
      emptyMessage="No activity found"
      className='pb-3'
    />
  );
};
