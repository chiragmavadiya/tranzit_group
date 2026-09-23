import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, CustomerActivity } from '../types';

export const useCustomerActivity = (filters: DebugFilters, enabled: boolean = true) => {
  return useQuery<DebugListResponse<CustomerActivity>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.CUSTOMER_ACTIVITY, filters],
    queryFn: () => debugCentreService.getCustomerActivity(filters),
    placeholderData: keepPreviousData,
    enabled: enabled, // Only fetch data if user_id is provided
  });
};
