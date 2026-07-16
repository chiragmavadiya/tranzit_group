import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugDetailResponse, TraceDetail } from '../types';

export const useTraceDetail = (traceId: string | undefined) => {
  return useQuery<DebugDetailResponse<TraceDetail>>({
    queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.TRACE_DETAIL(traceId || ''),
    queryFn: () => debugCentreService.getTraceDetail(traceId as string),
    enabled: !!traceId,
  });
};
