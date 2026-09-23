import { DataTable } from '@/components/common/DataTable';
import { useCustomerActivity } from '../../hooks';
import { CUSTOMER_ACTIVITY_COLUMNS } from '../../constants/columns';
import type { DebugFilters } from '../../types';
import { showToast, suspendToast } from '@/components/ui/custom-toast';
import { useEffect } from 'react';

interface CustomerActivityTabProps {
  filters: DebugFilters;
  searchValue: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

export const CustomerActivityTab = ({ filters, searchValue, onPageChange, onPageSizeChange, onSearchChange }: CustomerActivityTabProps) => {
  const { data: activityData, isLoading } = useCustomerActivity(filters, Boolean(filters.user_id));
  const activity = activityData?.data || [];
  const totalItems = activityData?.meta?.total || 0;

  useEffect(() => {
    if (!filters.user_id) {
      showToast("Please select a customer to view their activity.", "error");
      suspendToast();
    }
  },[filters.user_id]);  

  return (
    <DataTable
      columns={CUSTOMER_ACTIVITY_COLUMNS}
      data={activity}
<<<<<<< HEAD
      moduleName="customerActivity"
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
      loading={isLoading}
      totalItems={totalItems}
      currentPage={filters.page || 1}
      pageSize={filters.per_page || 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      headerTitle="Customer Activity"
      exportable={false}
      emptyMessage="No activity found"
      className='pb-3'
    />
  );
};
