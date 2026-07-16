import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, ExternalApiFailure } from '../types';

export const useExternalApiFailures = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<ExternalApiFailure>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.EXTERNAL_API_FAILURES, filters],
    queryFn: () => debugCentreService.getExternalApiFailures(filters),
    placeholderData: keepPreviousData,
  });
};
