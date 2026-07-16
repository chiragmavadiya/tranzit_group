import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, FailedJob } from '../types';

export const useFailedJobs = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<FailedJob>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.FAILED_JOBS, filters],
    queryFn: () => debugCentreService.getFailedJobs(filters),
    placeholderData: keepPreviousData,
  });
};
