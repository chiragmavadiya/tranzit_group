import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, DebugTrace } from '../types';

export const useDebugTraces = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<DebugTrace>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.TRACES, filters],
    queryFn: () => debugCentreService.getTraces(filters),
    placeholderData: keepPreviousData,
  });
};
