import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, SlowExternalCall } from '../types';

export const useSlowExternalCalls = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<SlowExternalCall>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.SLOW_EXTERNAL_CALLS, filters],
    queryFn: () => debugCentreService.getSlowExternalCalls(filters),
    placeholderData: keepPreviousData,
  });
};
