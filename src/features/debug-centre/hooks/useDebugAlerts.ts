import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { debugCentreService } from '../services/debugCentre.service';
import type { DebugFilters, DebugListResponse, DebugAlert } from '../types';

export const useDebugAlerts = (filters: DebugFilters) => {
  return useQuery<DebugListResponse<DebugAlert>>({
    queryKey: [...QUERY_KEYS.ADMIN_DEBUG_CENTRE.ALERTS, filters],
    queryFn: () => debugCentreService.getAlerts(filters),
    placeholderData: keepPreviousData,
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debugCentreService.resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.ALERTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.STATS });
    },
  });
};

export const useIgnoreAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debugCentreService.ignoreAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.ALERTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DEBUG_CENTRE.STATS });
    },
  });
};
