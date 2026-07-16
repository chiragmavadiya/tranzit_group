import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugStatsResponse } from '../types';

export const useDebugCentreStats = () => {
  return useQuery<DebugStatsResponse>({
    queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.STATS,
    queryFn: () => debugCentreService.getStats(),
  });
};
