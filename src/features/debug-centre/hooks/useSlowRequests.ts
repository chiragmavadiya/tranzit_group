import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, SlowRequest } from '../types';

export const useSlowRequests = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<SlowRequest>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.SLOW_REQUESTS, filters],
    queryFn: () => debugCentreService.getSlowRequests(filters),
    placeholderData: keepPreviousData,
  });
};
